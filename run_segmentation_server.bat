@echo off
echo Starting Segmentation API Server...
cd /d "C:\IIT\4th year\FYP\python_algo\crm-segmentation"

REM Start the FastAPI server
echo Starting FastAPI server on http://localhost:8000
echo Press Ctrl+C to stop the server

python -m uvicorn segmentation:app --reload --host 0.0.0.0 --port 8000

echo Server stopped.
pause
