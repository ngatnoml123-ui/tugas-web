#!/usr/bin/env bash
# Exit on error
set -e

echo "Installing PHP dependencies..."
composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

echo "Installing Node dependencies..."
npm install

echo "Building frontend assets..."
npm run build

echo "Clearing caches..."
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Running migrations..."
php artisan migrate --force

echo "Build complete!"
