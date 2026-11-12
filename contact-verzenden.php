<?php
/**
 * Captain Media contact form -> email to info@captain-media.nl.
 * Called by the form on contact.html (fetch, JSON answer) or as a plain form post (redirect back).
 * The server is allowed to send for captain-media.nl (SPF "+a"), so PHP mail() is used.
 */
declare(strict_types=1);

const TO   = 'info@captain-media.nl';
const FROM = 'info@captain-media.nl';

$wantsJson = stripos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false;

function done(bool $ok, string $msg, bool $json): void {
    if ($json) {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code($ok ? 200 : 400);
        echo json_encode(['ok' => $ok, 'message' => $msg]);
    } else {
        header('Location: contact.html' . ($ok ? '?verzonden=1' : '?fout=1'), true, 303);
    }
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Location: contact.html', true, 303);
    exit;
}

// spam trap: people never fill this hidden field
if (trim((string) ($_POST['website'] ?? '')) !== '') done(true, 'ok', $wantsJson);

$field = static function (string $key, int $max): string {
    $v = trim((string) ($_POST[$key] ?? ''));
    $v = str_replace("\0", '', $v);
    return mb_substr($v, 0, $max);
};
$oneLine = static fn (string $v): string => trim(preg_replace('/[\r\n\t]+/', ' ', $v));

$naam     = $oneLine($field('naam', 120));
$bedrijf  = $oneLine($field('bedrijf', 160));
$email    = $oneLine($field('email', 190));
$telefoon = $oneLine($field('telefoon', 40));
$dienst   = $oneLine($field('dienst', 400));
$bericht  = $field('bericht', 5000);

if ($naam === '' || $bericht === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    done(false, 'Vul je naam, een geldig e-mailadres en een bericht in.', $wantsJson);
}

// simple rate limit: max 5 messages per IP per 10 minutes
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rlFile = rtrim(sys_get_temp_dir(), '/\\') . '/cm-contact-' . md5($ip);
$now = time();
$hits = array_filter(array_map('intval', @file($rlFile, FILE_IGNORE_NEW_LINES) ?: []), static fn ($t) => $t > $now - 600);
if (count($hits) >= 5) done(false, 'Te veel berichten achter elkaar. Probeer het later opnieuw of stuur een WhatsApp.', $wantsJson);
$hits[] = $now;
@file_put_contents($rlFile, implode("\n", $hits));

$subject = 'Nieuwe aanvraag via de website: ' . $naam . ($bedrijf !== '' ? " ($bedrijf)" : '');
$body = "Nieuwe aanvraag via captain-media.nl\n"
    . "----------------------------------------\n"
    . "Naam:      $naam\n"
    . "Bedrijf:   " . ($bedrijf !== '' ? $bedrijf : '-') . "\n"
    . "E-mail:    $email\n"
    . "Telefoon:  " . ($telefoon !== '' ? $telefoon : '-') . "\n"
    . "Diensten:  " . ($dienst !== '' ? $dienst : '-') . "\n"
    . "----------------------------------------\n\n"
    . $bericht . "\n\n"
    . "----------------------------------------\n"
    . "Beantwoorden gaat direct naar $email.\n"
    . 'Verstuurd op ' . date('d-m-Y H:i') . " vanaf IP $ip\n";

$enc = static fn (string $s): string => '=?UTF-8?B?' . base64_encode($s) . '?=';
$headers = [
    'From: ' . $enc('Captain Media website') . ' <' . FROM . '>',
    'Reply-To: ' . $enc($naam) . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: captain-media.nl',
];

$sent = @mail(TO, $enc($subject), $body, implode("\r\n", $headers), '-f' . FROM);
done($sent, $sent ? 'Verzonden' : 'Versturen mislukt.', $wantsJson);
