<?php

namespace App\Services;

class PhonePeClient
{
    public function __construct(private readonly array $cfg)
    {
    }

    public function initiatePayment(array $payload): array
    {
        $encoded = base64_encode((string) json_encode($payload, JSON_UNESCAPED_SLASHES));
        $path = '/pg/v1/pay';
        $hash = hash('sha256', $encoded . $path . $this->cfg['salt_key']);
        $xVerify = $hash . '###' . $this->cfg['salt_index'];

        return $this->request(
            'POST',
            $path,
            ['request' => $encoded],
            [
                'X-VERIFY: ' . $xVerify,
            ]
        );
    }

    public function checkStatus(string $merchantTransactionId): array
    {
        $path = '/pg/v1/status/' . rawurlencode($this->cfg['merchant_id']) . '/' . rawurlencode($merchantTransactionId);
        $hash = hash('sha256', $path . $this->cfg['salt_key']);
        $xVerify = $hash . '###' . $this->cfg['salt_index'];

        return $this->request(
            'GET',
            $path,
            null,
            [
                'X-VERIFY: ' . $xVerify,
                'X-MERCHANT-ID: ' . $this->cfg['merchant_id'],
            ]
        );
    }

    private function request(string $method, string $path, ?array $body = null, array $extraHeaders = []): array
    {
        $url = $this->cfg['base_url'] . $path;
        $ch = curl_init($url);
        if ($ch === false) {
            return ['success' => false, 'message' => 'Failed to initialize cURL'];
        }

        $headers = array_merge(
            ['Content-Type: application/json', 'Accept: application/json'],
            $extraHeaders
        );

        curl_setopt_array($ch, [
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_TIMEOUT => 30,
        ]);

        if ($body !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, (string) json_encode($body));
        }

        $raw = curl_exec($ch);
        $httpCode = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        $curlErr = curl_error($ch);
        curl_close($ch);

        if ($raw === false) {
            return ['success' => false, 'message' => $curlErr ?: 'PhonePe request failed'];
        }

        $decoded = json_decode($raw, true);
        if (!is_array($decoded)) {
            return ['success' => false, 'message' => 'Invalid PhonePe response', 'raw' => $raw, 'http_code' => $httpCode];
        }

        if (($decoded['success'] ?? false) !== true) {
            return [
                'success' => false,
                'message' => $decoded['message'] ?? 'PhonePe request failed',
                'response' => $decoded,
                'http_code' => $httpCode,
            ];
        }

        return ['success' => true, 'data' => $decoded, 'http_code' => $httpCode];
    }
}

