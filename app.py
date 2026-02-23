from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional
import uvicorn
from career_langgraph import graph

app = FastAPI(title="AI Career Mentor Agent", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CareerAnalysisRequest(BaseModel):
    resume_text: str
    target_role: str


class CareerAnalysisResponse(BaseModel):
    analysis: str
    gaps: str
    roadmap: str
    questions: str
    success: bool
    message: Optional[str] = None


# Serve static files
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def root():
    return FileResponse("static/index.html")


@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.post("/analyze", response_model=CareerAnalysisResponse)
async def analyze_career(request: CareerAnalysisRequest):
    """
    Analyze resume and generate career insights including:
    - Resume Analysis
    - Skill Gap Analysis
    - Study Roadmap
    - Interview Questions
    """
    try:
        if not request.resume_text.strip():
            raise HTTPException(status_code=400, detail="Resume text cannot be empty")
        
        if not request.target_role.strip():
            raise HTTPException(status_code=400, detail="Target role cannot be empty")

        # Initialize state
        initial_state = {
            "resume_text": request.resume_text,
            "target_role": request.target_role,
            "analysis": "",
            "gaps": "",
            "roadmap": "",
            "questions": ""
        }

        # Run the LangGraph agent
        result = graph.invoke(initial_state)

        return CareerAnalysisResponse(
            analysis=result.get("analysis", ""),
            gaps=result.get("gaps", ""),
            roadmap=result.get("roadmap", ""),
            questions=result.get("questions", ""),
            success=True,
            message="Analysis completed successfully"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error during analysis: {str(e)}"
        )


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
