"""
Simple script to run the FastAPI server
"""
import uvicorn

if __name__ == "__main__":
    print("🚀 Starting AI Career Mentor Agent Web App...")
    print("📡 Backend API: http://localhost:8000")
    print("🌐 Frontend: http://localhost:8000")
    print("📊 API Docs: http://localhost:8000/docs")
    print("\nPress Ctrl+C to stop the server\n")
    
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Auto-reload on code changes
        log_level="info"
    )
