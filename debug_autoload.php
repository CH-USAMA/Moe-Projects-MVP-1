<?php
$loader = require __DIR__ . '/vendor/autoload.php';

echo "Autoloaded classes count: " . count($loader->getClassMap()) . "\n";
$map = $loader->getPrefixesPsr4();
if (isset($map['Minishlink\\WebPush\\'])) {
    echo "WebPush is registered: " . implode(', ', $map['Minishlink\\WebPush\\']) . "\n";
} else {
    echo "WebPush is NOT registered in PSR-4 map.\n";
    print_r(array_keys($map));
}
