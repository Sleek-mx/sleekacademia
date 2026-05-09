<?php
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// TODO: Switch to live credentials and change PAYPAL_BASE to https://api-m.paypal.com before going live
$PAYPAL_CLIENT_ID = 'ATf8sFRIgqXlFSAOez7l5RrQykpYoS1u0ZyjhizLV00vhJwwQ6wbL83cu12X1OufISwDoOIfvZh2gT50';
$PAYPAL_SECRET    = 'EG4XzhT7IR5VTiD8Q6azf9N9rUSpP4jOTYtK8C4j1ubMJLcE3vGaieVm5QVRSDD4ANTw-fMoya1gLvp2';
$PAYPAL_BASE      = 'https://api-m.sandbox.paypal.com';

// orderId comes from .htaccess rewrite: /api/paypal/capture-order/{id} → ?orderId={id}
$orderId = $_GET['orderId'] ?? '';
if (!preg_match('/^[A-Z0-9]{10,30}$/', $orderId)) {
    http_response_code(400);
    exit(json_encode(['error' => 'Invalid order ID.']));
}

// Obtain access token
$ch = curl_init("$PAYPAL_BASE/v1/oauth2/token");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_USERPWD        => "$PAYPAL_CLIENT_ID:$PAYPAL_SECRET",
    CURLOPT_POSTFIELDS     => 'grant_type=client_credentials',
]);
$tokenData = json_decode(curl_exec($ch), true);
curl_close($ch);

$token = $tokenData['access_token'] ?? null;
if (!$token) {
    http_response_code(500);
    exit(json_encode(['error' => 'PayPal authentication failed.']));
}

// Capture payment
$ch = curl_init("$PAYPAL_BASE/v2/checkout/orders/$orderId/capture");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        "Authorization: Bearer $token",
    ],
    CURLOPT_POSTFIELDS => '{}',
]);
$capture = json_decode(curl_exec($ch), true);
curl_close($ch);

echo json_encode($capture);
