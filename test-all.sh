#!/bin/zsh

echo "Verifying Svelte files..."
npm run check

if [ $? -eq 0 ]; then
    echo "Svelte check passed ✅"
else
    echo "Svelte check failed ❌"
    exit 1
fi

echo "Linting Racquet Rivals frontend..."
npx eslint

if [ $? -eq 0 ]; then
    echo "Frontend linting passed ✅"
else
    echo "Frontend linting failed ❌"
    exit 1
fi

echo "Testing Racquet Rivals frontend..."
npm test

if [ $? -eq 0 ]; then
    echo "Frontend tests passed ✅"
else
    echo "Frontend tests failed ❌"
    exit 1
fi

echo "Testing Racquet Rivals backend..."
cd ../tennis-bracket-pb-extend &&
go test ./src/...

if [ $? -eq 0 ]; then
    echo "Backend tests passed ✅"
else
    echo "Backend tests failed ❌"
    exit 1
fi

echo "Testing Racquet Rivals web scraper..."
cd ../tennis-bracket-scripts &&
go test

if [ $? -eq 0 ]; then
    echo "Web scraping tests passed ✅"
else
    echo "Web scraping tests failed ❌"
    exit 1
fi

echo "All tests passed ✅ ✅ ✅"