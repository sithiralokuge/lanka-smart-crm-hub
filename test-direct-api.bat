@echo off
echo Testing Segmentation API directly...
echo.

echo Testing the API endpoint directly (should match what's in segmentation.py)...
curl -X POST http://localhost:8000/api/segment/comprehensive -H "Content-Type: application/json" -d "{}"
echo.
echo.

pause
