#!/bin/zsh

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
go test ./src/tests

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