<?php

namespace App\Controllers;

use App\Helpers\Response;
use App\Helpers\Validator;
use App\Middleware\AuthMiddleware;
use App\Models\Order;
use App\Services\PhonePeClient;

class PaymentController
{
    public static function initiatePhonePe(array $params): void
    {
        $authUser = AuthMiddleware::getUser();
        $body = Validator::getJsonBody();
        $orderId = (int) ($body['order_id'] ?? 0);
        if ($orderId <= 0) {
            Response::error('order_id is required', 422);
        }

        $order = Order::findById($orderId);
        if (!$order) {
            Response::error('Order not found', 404);
        }
        if ($authUser['role'] !== 'admin' && (int) $order['user_id'] !== (int) $authUser['sub']) {
            Response::error('Access denied', 403);
        }
        if (($order['payment_status'] ?? 'pending') === 'paid') {
            Response::error('Order already paid', 409);
        }

        $config = require __DIR__ . '/../../config/app.php';
        $phonePe = $config['phonepe'] ?? [];
        if (empty($phonePe['merchant_id']) || empty($phonePe['salt_key'])) {
            Response::error('PhonePe is not configured on server', 500);
        }

        $merchantTxnId = self::buildMerchantTxnId($orderId);
        $frontUrl = rtrim((string) $config['frontend_url'], '/');
        $redirectPath = (string) ($phonePe['redirect_path'] ?? '/payment-result');
        $redirectUrl = $frontUrl . $redirectPath . '?order_id=' . $orderId;
        $callbackUrl = $redirectUrl;
        $amountPaise = (int) round(((float) $order['amount']) * 100);

        $payload = [
            'merchantId' => $phonePe['merchant_id'],
            'merchantTransactionId' => $merchantTxnId,
            'merchantUserId' => 'USER-' . (int) $order['user_id'],
            'amount' => $amountPaise,
            'redirectUrl' => $redirectUrl,
            'redirectMode' => 'REDIRECT',
            'callbackUrl' => $callbackUrl,
            'mobileNumber' => preg_replace('/\D+/', '', (string) ($order['user_phone'] ?? '')),
            'paymentInstrument' => ['type' => 'PAY_PAGE'],
        ];

        $client = new PhonePeClient($phonePe);
        $res = $client->initiatePayment($payload);
        if (($res['success'] ?? false) !== true) {
            Response::error($res['message'] ?? 'Failed to initiate payment', 502, $res['response'] ?? null);
        }

        Order::setPaymentAttempt($orderId, 'phonepe', $merchantTxnId);
        $apiData = $res['data']['data'] ?? [];
        $redirectInfo = $apiData['instrumentResponse']['redirectInfo'] ?? [];

        Response::success([
            'order_id' => $orderId,
            'merchant_transaction_id' => $merchantTxnId,
            'redirect_url' => $redirectInfo['url'] ?? null,
            'phonepe' => [
                'state' => $apiData['state'] ?? null,
                'response_code' => $apiData['responseCode'] ?? null,
            ],
        ], 'PhonePe payment initiated');
    }

    public static function verifyPhonePe(array $params): void
    {
        $authUser = AuthMiddleware::getUser();
        $orderId = (int) ($params['orderId'] ?? 0);
        $order = Order::findById($orderId);
        if (!$order) {
            Response::error('Order not found', 404);
        }
        if ($authUser['role'] !== 'admin' && (int) $order['user_id'] !== (int) $authUser['sub']) {
            Response::error('Access denied', 403);
        }

        $merchantTxnId = (string) ($order['payment_id'] ?? '');
        if ($merchantTxnId === '') {
            Response::error('No PhonePe transaction found for this order', 404);
        }

        $config = require __DIR__ . '/../../config/app.php';
        $phonePe = $config['phonepe'] ?? [];
        $client = new PhonePeClient($phonePe);
        $res = $client->checkStatus($merchantTxnId);
        if (($res['success'] ?? false) !== true) {
            Response::error($res['message'] ?? 'Failed to verify payment', 502, $res['response'] ?? null);
        }

        $data = $res['data']['data'] ?? [];
        $state = strtoupper((string) ($data['state'] ?? ''));
        $gatewayTxnId = $data['transactionId'] ?? $merchantTxnId;
        $wasPaid = (($order['payment_status'] ?? 'pending') === 'paid');

        if ($state === 'COMPLETED') {
            Order::setPaymentResult($orderId, 'paid', (string) $gatewayTxnId);
            if (!$wasPaid) {
                $paidOrder = Order::findById($orderId);
                if ($paidOrder) {
                    OrderController::notifyAdminForNewOrder($paidOrder);
                }
            }
        } elseif ($state === 'FAILED') {
            Order::setPaymentResult($orderId, 'failed', (string) $merchantTxnId);
        } else {
            Order::setPaymentResult($orderId, 'pending', (string) $merchantTxnId);
        }

        Response::success([
            'order' => Order::findById($orderId),
            'phonepe' => $res['data'],
        ], 'Payment status fetched');
    }

    public static function phonePeCallback(array $params): void
    {
        $body = Validator::getJsonBody();
        $responseToken = (string) ($body['response'] ?? '');
        if ($responseToken === '') {
            Response::success(['ok' => true], 'No callback payload');
        }

        $decodedRaw = base64_decode($responseToken, true);
        $decoded = is_string($decodedRaw) ? json_decode($decodedRaw, true) : null;
        if (!is_array($decoded)) {
            Response::success(['ok' => true], 'Invalid callback payload');
        }

        $data = $decoded['data'] ?? [];
        $merchantTxnId = (string) ($data['merchantTransactionId'] ?? '');
        if ($merchantTxnId === '') {
            Response::success(['ok' => true], 'No merchantTransactionId');
        }

        $order = Order::findByPaymentId($merchantTxnId);
        if (!$order) {
            Response::success(['ok' => true], 'Order not found for callback');
        }

        $state = strtoupper((string) ($data['state'] ?? ''));
        $gatewayTxnId = (string) ($data['transactionId'] ?? $merchantTxnId);
        $wasPaid = (($order['payment_status'] ?? 'pending') === 'paid');
        if ($state === 'COMPLETED') {
            Order::setPaymentResult((int) $order['id'], 'paid', $gatewayTxnId);
            if (!$wasPaid) {
                $paidOrder = Order::findById((int) $order['id']);
                if ($paidOrder) {
                    OrderController::notifyAdminForNewOrder($paidOrder);
                }
            }
        } elseif ($state === 'FAILED') {
            Order::setPaymentResult((int) $order['id'], 'failed', $merchantTxnId);
        } else {
            Order::setPaymentResult((int) $order['id'], 'pending', $merchantTxnId);
        }

        Response::success(['ok' => true], 'Callback processed');
    }

    private static function buildMerchantTxnId(int $orderId): string
    {
        return 'MAORD' . $orderId . '_' . time() . '_' . substr(bin2hex(random_bytes(4)), 0, 8);
    }
}

