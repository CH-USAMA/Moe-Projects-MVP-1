<?php
require __DIR__ . '/vendor/autoload.php';
use Minishlink\WebPush\VAPID;

error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    $keys = VAPID::createVapidKeys();
    print_r($keys);
} catch (Exception $e) {
    echo "Message: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
    
    if (function_exists('openssl_pkey_new')) {
        echo "openssl_pkey_new exists\n";
        $res = openssl_pkey_new();
        if (!$res) {
            echo "openssl_pkey_new failed\n";
            while ($msg = openssl_error_string()) {
                echo "OpenSSL Error: " . $msg . "\n";
            }
        } else {
            echo "openssl_pkey_new worked directly\n";
        }
    } else {
        echo "openssl_pkey_new DOES NOT exist\n";
    }
}
