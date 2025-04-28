from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn
import os

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SegmentationRequest(BaseModel):
    reference_date: Optional[str] = None
    min_clusters: Optional[int] = 2
    max_clusters: Optional[int] = 5

@app.get("/")
async def root():
    return {"message": "Mock Segmentation API is running"}

@app.post("/api/segment/comprehensive")
async def run_segmentation(request: SegmentationRequest):
    print("Received request for comprehensive segmentation")
    return {
        "summary": {
            "demographic": {"Male": 250, "Female": 200, "Unknown": 6},
            "preference": {"Preference Group 1": 150, "Preference Group 2": 200, "Preference Group 3": 106},
            "value_based_rfm": {"Champions": 100, "Loyal Customers": 150, "Potential Loyalists": 80, "At Risk": 70, "Lost Customers": 56},
        },
        "details": {},
        "customer_count": 456,
        "data_exported_status": "No data exported"
    }

@app.post("/api/segment/{segment_type}")
async def run_specific_segmentation(segment_type: str, request: SegmentationRequest):
    print(f"Received request for {segment_type} segmentation")
    if segment_type == "demographic":
        return {"message": "Demographic segmentation completed", "distribution": {"Male": 250, "Female": 200, "Unknown": 6}}
    elif segment_type == "preference":
        return {"message": "Preference segmentation completed", "distribution": {"Preference Group 1": 150, "Preference Group 2": 200, "Preference Group 3": 106}, "profiles": {}}
    elif segment_type == "rfm":
        return {"message": "RFM segmentation completed", "distribution": {"Champions": 100, "Loyal Customers": 150, "Potential Loyalists": 80, "At Risk": 70, "Lost Customers": 56}, "avg_values": {}}
    else:
        raise HTTPException(status_code=400, detail="Invalid segmentation type")

if __name__ == "__main__":
    # Create a batch file to run this server
    bat_path = r"C:\IIT\4th year\FYP\python_algo\crm-segmentation\run_mock_server.bat"
    bat_content = """@echo off
echo Starting Mock Segmentation API Server...
cd /d "C:\\IIT\\4th year\\FYP\\Sithira_Prod\\lanka-smart-crm-hub"

REM Start the FastAPI server
echo Starting FastAPI server on http://localhost:8001
echo Press Ctrl+C to stop the server

python mock_server.py

echo Server stopped.
pause
"""

    with open(bat_path, 'w') as file:
        file.write(bat_content)

    print(f"Created batch file at {bat_path}")
    print("Starting mock segmentation server on http://localhost:8001")
    uvicorn.run(app, host="0.0.0.0", port=8001)
