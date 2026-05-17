<?php
/**
 * Sleek Academia — GitHub Auto-Deploy Webhook
 * Called by GitHub on every push to main.
 * Set DEPLOY_SECRET in your cPanel environment or hardcode below.
 */

$secret = getenv('DEPLOY_SECRET') ?: 'REPLACE_WITH_YOUR_SECRET';
$repo_path = '/home/sleenegb/repositories/sleekacademia';

// Verify GitHub signature
$signature = 'sha256=' . hash_hmac('sha256', file_get_contents('php://input'), $secret);
if (!hash_equals($signature, $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '')) {
    http_response_code(403);
    die('Forbidden');
}

// Only act on pushes to main
$payload = json_decode(file_get_contents('php://input'), true);
if (($payload['ref'] ?? '') !== 'refs/heads/main') {
    http_response_code(200);
    die('Not main branch — ignored');
}

// Run git pull + cPanel deploy
$output = [];
exec("cd {$repo_path} && git pull origin main 2>&1", $output);

http_response_code(200);
header('Content-Type: application/json');
echo json_encode([
    'status' => 'deployed',
    'output' => implode("\n", $output)
]);
