import sys
import traceback
import logging
import os

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("debug.log"),
        logging.StreamHandler(sys.stdout)
    ]
)

# Change to the segmentation directory
os.chdir(r"C:\IIT\4th year\FYP\python_algo\crm-segmentation")

try:
    # Import the app from segmentation_fixed
    print("Importing app from segmentation_fixed.py...")
    
    # First check if the file exists
    if not os.path.exists("segmentation_fixed.py"):
        print("ERROR: segmentation_fixed.py does not exist!")
        sys.exit(1)
        
    # Try to import the module
    import segmentation_fixed
    
    # Add global exception handler
    from fastapi import Request
    from fastapi.responses import JSONResponse
    
    @segmentation_fixed.app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        error_msg = f"Unhandled exception: {str(exc)}"
        print(error_msg)
        print(traceback.format_exc())
        return JSONResponse(
            status_code=500,
            content={"detail": error_msg, "traceback": traceback.format_exc()}
        )
    
    # Run the app
    if __name__ == "__main__":
        print("Starting server with detailed error logging...")
        import uvicorn
        uvicorn.run(segmentation_fixed.app, host="0.0.0.0", port=8000, log_level="debug")
        
except Exception as e:
    print(f"Error importing app: {str(e)}")
    traceback.print_exc()
