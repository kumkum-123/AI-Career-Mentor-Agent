# AI Career Mentor Agent - Web App

A modern web application for your AI Career Mentor Agent built with LangGraph. This app provides personalized career insights including resume analysis, skill gap identification, study roadmaps, and interview question generation.

## Features

- 📄 **Resume Analyzer Agent**: Analyzes your resume for key skills, strengths, and suitability
- 🔍 **Skill Gap Analyzer Agent**: Identifies missing technical and practical skills
- 📚 **Daily Study Planner Agent**: Creates a personalized 7-day study roadmap
- 💼 **Interview Question Generator Agent**: Generates tailored interview questions

## Tech Stack

- **Backend**: FastAPI (Python)
- **Frontend**: HTML, CSS, JavaScript
- **AI Framework**: LangGraph
- **AI Model**: OpenAI GPT-3.5-turbo (via OpenRouter)

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure API Key

The API key is currently in `career_langgraph.py`. For production, consider using environment variables:

```python
import os
client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)
```

### 3. Run the Web App

**Option 1: Using the run script (recommended)**
```bash
python run.py
```

**Option 2: Using app.py directly**
```bash
python app.py
```

The web app will be available at `http://localhost:8000`

- **Frontend**: http://localhost:8000 (automatically served)
- **API**: http://localhost:8000/analyze
- **API Documentation**: http://localhost:8000/docs (Swagger UI)

## API Endpoints

### POST `/analyze`

Analyze a resume and generate career insights.

**Request Body:**
```json
{
  "resume_text": "Your resume text here...",
  "target_role": "Software Engineer"
}
```

**Response:**
```json
{
  "analysis": "Resume analysis results...",
  "gaps": "Skill gap analysis...",
  "roadmap": "7-day study roadmap...",
  "questions": "Interview questions...",
  "success": true,
  "message": "Analysis completed successfully"
}
```

### GET `/health`

Check API health status.

### GET `/`

Get API information.

## Project Structure

```
.
├── app.py                 # FastAPI backend server
├── run.py                 # Simple startup script
├── career_langgraph.py    # LangGraph agent implementation
├── requirements.txt       # Python dependencies
├── static/
│   ├── index.html        # Frontend HTML
│   ├── style.css         # Frontend styles
│   └── script.js         # Frontend JavaScript
└── README.md             # This file
```

## Usage

1. Enter your target role (e.g., "Software Engineer", "Data Scientist")
2. Paste your resume text in the textarea
3. Click "Analyze Career"
4. Wait for the AI agents to process your information
5. View your personalized career insights

## Development

To modify the agents, edit `career_langgraph.py`. The web app will automatically use the updated agent logic.

## Security Note

⚠️ **Important**: The API key is currently hardcoded in `career_langgraph.py`. For production deployment:
- Use environment variables
- Never commit API keys to version control
- Consider using a secrets management service

## License

MIT License
