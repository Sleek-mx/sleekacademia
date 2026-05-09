<?php
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// TODO: Replace with your live secret key before going live → sk_live_…
$stripe_secret = getenv('STRIPE_SECRET_KEY');

$input  = json_decode(file_get_contents('php://input'), true) ?: [];
$amount = intval($input['amount'] ?? 0);
$desc   = substr(strip_tags($input['description'] ?? 'Sleek Academia'), 0, 255);

if ($amount < 50) {
    http_response_code(400);
    exit(json_encode(['error' => 'Invalid amount. Minimum is $0.50.']));
}

$ch = curl_init('https://api.stripe.com/v1/payment_intents');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_USERPWD        => "$STRIPE_SECRET:",
    CURLOPT_POSTFIELDS     => http_build_query([
        'amount'                            => $amount,
        'currency'                          => 'usd',
        'description'                       => $desc,
        'automatic_payment_methods[enabled]'=> 'true',
    ]),
]);

$res  = json_decode(curl_exec($ch), true);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if (isset($res['client_secret'])) {
    echo json_encode(['clientSecret' => $res['client_secret']]);
} else {
    http_response_code(500);
    echo json_encode(['error' => $res['error']['message'] ?? 'Payment failed.']);
}
