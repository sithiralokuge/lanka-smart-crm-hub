@echo off
echo Starting Segmentation API Server...
cd /d "C:\IIT\4th year\FYP\python_algo\crm-segmentation"

REM Activate virtual environment if it exists
if exist venv (
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
)

REM Start the FastAPI server
echo Starting FastAPI server on http://localhost:8000
python -m uvicorn segmentation_cors:app --reload --host 0.0.0.0 --port 8000

pause
