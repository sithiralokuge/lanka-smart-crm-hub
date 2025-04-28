@echo off
echo Starting Fixed Segmentation API Server...
cd /d "C:\IIT\4th year\FYP\python_algo\crm-segmentation"

REM Create a fixed version of the segmentation.py file
echo Creating fixed version of segmentation.py...
powershell -Command "(Get-Content segmentation.py) -replace 'if not customers_list', 'if len(customers_list) == 0' -replace 'if not preference_data', 'if len(preference_data) == 0' -replace 'if not transactions', 'if len(transactions) == 0' -replace 'if not rfm_list', 'if len(rfm_list) == 0' -replace 'if not cluster_df\[col\]\.empty', 'if len(cluster_df[col]) > 0' -replace 'if not mode_result\.empty', 'if len(mode_result) > 0' -replace 'if errors', 'if len(errors) > 0' -replace 'if db_errors', 'if len(db_errors) > 0' | Set-Content segmentation_fixed.py"

REM Start the FastAPI server with the fixed file
echo Starting FastAPI server on http://localhost:8000
echo Press Ctrl+C to stop the server

python -m uvicorn segmentation_fixed:app --reload --host 0.0.0.0 --port 8000

echo Server stopped.
pause
