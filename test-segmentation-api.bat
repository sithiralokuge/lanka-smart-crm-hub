@echo off
echo Testing Segmentation API...
echo.
echo Make sure the segmentation server is running on port 8000
echo.

echo Testing comprehensive segmentation endpoint...
curl -X POST http://localhost:8000/segment/comprehensive -H "Content-Type: application/json" -d "{}"
echo.
echo.

echo Testing demographic segmentation endpoint...
curl -X POST http://localhost:8000/segment/demographic -H "Content-Type: application/json" -d "{}"
echo.
echo.

echo Testing preference segmentation endpoint...
curl -X POST http://localhost:8000/segment/preference -H "Content-Type: application/json" -d "{}"
echo.
echo.

echo Testing RFM segmentation endpoint...
curl -X POST http://localhost:8000/segment/rfm -H "Content-Type: application/json" -d "{}"
echo.
echo.

pause
