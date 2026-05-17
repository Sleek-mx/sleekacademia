<?php
/**
 * Sleek Academia — GitHub Auto-Deploy Webhook
 * Receives GitHub push events, pulls latest code, syncs to live site.
 */

$secret     = 'sleek2026deploy';
$repo_path  = '/home/sleenegb/repositories/sleekacademia';
$live_path  = '/home/sleenegb/public_html/sleekacademianewsite';
$npm        = '/opt/alt/alt-nodejs20/root/usr/bin/npm';
$log_file   = '/home/sleenegb/deploy.log';

// ── Verify GitHub signature ────────────────────────────────────────────────
$raw_body  = file_get_contents('php://input');
$signature = 'sha256=' . hash_hmac('sha256', $raw_body, $secret);
if (!hash_equals($signature, $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '')) {
    http_response_code(403);
    die(json_encode(['error' => 'Invalid signature']));
}

// ── Only deploy on pushes to main ─────────────────────────────────────────
$payload = json_decode($raw_body, true);
if (($payload['ref'] ?? '') !== 'refs/heads/main') {
    http_response_code(200);
    die(json_encode(['status' => 'ignored', 'reason' => 'not main branch']));
}

// ── Run deployment ─────────────────────────────────────────────────────────
$steps  = [];
$errors = [];

function run($cmd, &$steps, &$errors) {
    $output = [];
    $code   = 0;
    exec($cmd . ' 2>&1', $output, $code);
    $steps[] = ['cmd' => $cmd, 'output' => implode("\n", $output), 'code' => $code];
    if ($code !== 0) $errors[] = $cmd;
    return $code === 0;
}

// 1. Pull latest code into the cPanel-managed repo
run("cd {$repo_path} && git pull origin main", $steps, $errors);

// 2. Sync repo files to the live site (mirrors .cpanel.yml behaviour)
run(
    "/usr/bin/rsync -a --delete " .
    "--exclude='.git' --exclude='.cpanel.yml' --exclude='node_modules' --exclude='deploy.log' " .
    "{$repo_path}/ {$live_path}/",
    $steps, $errors
);

// 3. Install / update npm dependencies in the live site
run("cd {$live_path} && {$npm} install --omit=dev", $steps, $errors);

// 4. Restart the Node.js app
run("mkdir -p {$live_path}/tmp && touch {$live_path}/tmp/restart.txt", $steps, $errors);

// ── Log result ────────────────────────────────────────────────────────────
$commit  = $payload['after'] ?? 'unknown';
$pusher  = $payload['pusher']['name'] ?? 'unknown';
$log_line = date('Y-m-d H:i:s') . " | commit={$commit} | pusher={$pusher} | errors=" . count($errors) . "\n";
file_put_contents($log_file, $log_line, FILE_APPEND);

// ── Respond ────────────────────────────────────────────────────────────────
http_response_code(count($errors) ? 500 : 200);
header('Content-Type: application/json');
echo json_encode([
    'status'  => count($errors) ? 'partial' : 'success',
    'commit'  => $commit,
    'steps'   => count($steps),
    'errors'  => $errors,
], JSON_PRETTY_PRINT);
