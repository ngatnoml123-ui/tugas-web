<?php

$app_dir = '/tmp/storage/app';
$framework_dir = '/tmp/storage/framework';
$bootstrap_dir = '/tmp/storage/bootstrap/cache';

$dirs = [
    $app_dir,
    $framework_dir.'/views',
    $framework_dir.'/cache/data',
    $framework_dir.'/sessions',
    $framework_dir.'/testing',
    $bootstrap_dir,
    '/tmp/storage/logs',
];

foreach ($dirs as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0777, true);
    }
}

// Redirect cache and view paths to /tmp
putenv('VIEW_COMPILED_PATH=' . $framework_dir.'/views');
putenv('APP_CONFIG_CACHE=' . $bootstrap_dir.'/config.php');
putenv('APP_EVENTS_CACHE=' . $bootstrap_dir.'/events.php');
putenv('APP_PACKAGES_CACHE=' . $bootstrap_dir.'/packages.php');
putenv('APP_ROUTES_CACHE=' . $bootstrap_dir.'/routes.php');
putenv('APP_SERVICES_CACHE=' . $bootstrap_dir.'/services.php');

$_ENV['VIEW_COMPILED_PATH'] = $framework_dir.'/views';
$_ENV['APP_CONFIG_CACHE'] = $bootstrap_dir.'/config.php';
$_ENV['APP_EVENTS_CACHE'] = $bootstrap_dir.'/events.php';
$_ENV['APP_PACKAGES_CACHE'] = $bootstrap_dir.'/packages.php';
$_ENV['APP_ROUTES_CACHE'] = $bootstrap_dir.'/routes.php';
$_ENV['APP_SERVICES_CACHE'] = $bootstrap_dir.'/services.php';

require __DIR__ . '/../public/index.php';
