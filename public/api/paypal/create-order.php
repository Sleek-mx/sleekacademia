<?php
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// TODO: Switch to live credentials and change PAYPAL_BASE to https://api-m.paypal.com before going live
$PAYPAL_CLIENT_ID = 'ATf8sFRIgqXlFSAOez7l5RrQykpYoS1u0ZyjhizLV00vhJwwQ6wbL83cu12X1OufISwDoOIfvZh2gT50';
$PAYPAL_SECRET    = 'EG4XzhT7IR5VTiD8Q6azf9N9rUSpP4jOTYtK8C4j1ubMJLcE3vGaieVm5QVRSDD4ANTw-fMoya1gLvp2';
$PAYPAL_BASE      = 'https://api-m.sandbox.paypal.com';

$input  = json_decode(file_get_contents('php://input'), true) ?: [];
$amount = intval($input['amount'] ?? 0);
$desc   = substr(strip_tags($input['description'] ?? 'Sleek Academia'), 0, 127);

if ($amount < 50) {
    http_response_code(400);
    exit(json_encode(['error' => 'Invalid amount.']));
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

// Create order
$ch = curl_init("$PAYPAL_BASE/v2/checkout/orders");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        "Authorization: Bearer $token",
    ],
    CURLOPT_POSTFIELDS => json_encode([
        'intent'         => 'CAPTURE',
        'purchase_units' => [[
            'description' => $desc,
            'amount'      => [
                'currency_code' => 'USD',
                'value'         => number_format($amount / 100, 2, '.', ''),
            ],
        ]],
    ]),
]);
$order = json_decode(curl_exec($ch), true);
curl_close($ch);

if (isset($order['id'])) {
    echo json_encode(['id' => $order['id']]);
} else {
    http_response_code(500);
    echo json_encode(['error' => $order['message'] ?? 'Order creation failed.']);
}
