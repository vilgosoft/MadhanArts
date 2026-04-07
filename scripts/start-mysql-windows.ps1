# Try to help when PHP gets "connection refused" on port 3306.
# Run in PowerShell:  .\scripts\start-mysql-windows.ps1

$port = 3306
$tcp = Test-NetConnection -ComputerName 127.0.0.1 -Port $port -WarningAction SilentlyContinue
if ($tcp.TcpTestSucceeded) {
    Write-Host "Port $port is open — MySQL is already accepting connections."
    exit 0
}

Write-Host "Nothing is listening on 127.0.0.1:$port (MySQL is probably stopped).`n"

$candidates = @(
    @{ Name = "XAMPP"; Path = "C:\xampp\mysql_start.bat" },
    @{ Name = "XAMPP (alt)"; Path = "C:\xampp\xampp_start.exe" },
    @{ Name = "WampServer"; Path = "C:\wamp64\bin\mysql\mysql8.0.31\bin\mysqld.exe" },
    @{ Name = "Laragon"; Path = "C:\laragon\laragon.exe" }
)

$found = $false
foreach ($c in $candidates) {
    if (Test-Path $c.Path) {
        Write-Host "Found $($c.Name) at: $($c.Path)"
        $found = $true
    }
}

if (-not $found) {
    Write-Host "No common XAMPP/WAMP/Laragon paths found under C:\`n"
}

Write-Host @"

What to do next:
  1) Open your stack's control panel and START MySQL / MariaDB (e.g. XAMPP Control Panel -> MySQL [Start]).
  2) Or install Docker Desktop, then from the project folder run:
       docker compose up -d
     and set password in backend\config\database.local.php to: madhanarts
     (see backend\config\database.local.docker.example.php)

Then test:
  php backend\scripts\test-db-connection.php
"@
