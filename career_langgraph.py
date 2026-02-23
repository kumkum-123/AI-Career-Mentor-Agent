from langgraph.graph import StateGraph, END
from typing import TypedDict
from openai import OpenAI

# OpenRouter client
client = OpenAI(
    api_key="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",
    base_url="https://openrouter.ai/api/v1",
)

# ---- Define State ----
class CareerState(TypedDict):
    resume_text: str
    target_role: str
    analysis: str
    gaps: str
    roadmap: str
    questions: str


# ---- Agent Nodes ----

def resume_analyzer_node(state: CareerState):
    prompt = f"""
    Analyze this resume for the role: {state['target_role']}.

    Resume:
    {state['resume_text']}

    Provide:
    1. Key Skills
    2. Strength Areas
    3. Suitable Roles
    4. Overall Evaluation
    """

    response = client.chat.completions.create(
        model="openai/gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
    )

    state["analysis"] = response.choices[0].message.content
    return state


def skill_gap_node(state: CareerState):
    prompt = f"""
    Based on this resume analysis, identify skill gaps for role: {state['target_role']}.

    Analysis:
    {state['analysis']}

    Provide:
    1. Missing Technical Skills
    2. Missing Practical Skills
    3. Learning Priority
    """

    response = client.chat.completions.create(
        model="openai/gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
    )

    state["gaps"] = response.choices[0].message.content
    return state


def study_planner_node(state: CareerState):
    prompt = f"""
    Create a 7-day study roadmap for role: {state['target_role']}.

    Skill Gaps:
    {state['gaps']}
    """

    response = client.chat.completions.create(
        model="openai/gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
    )

    state["roadmap"] = response.choices[0].message.content
    return state


def interview_coach_node(state: CareerState):
    prompt = f"""
    Generate personalized interview questions for role: {state['target_role']}.

    Resume Analysis:
    {state['analysis']}

    Provide:
    1. Technical Questions
    2. Project-Based Questions
    3. HR Questions
    """

    response = client.chat.completions.create(
        model="openai/gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
    )

    state["questions"] = response.choices[0].message.content
    return state


# ---- Build Graph ----
builder = StateGraph(CareerState)

builder.add_node("resume_analyzer", resume_analyzer_node)
builder.add_node("skill_gap", skill_gap_node)
builder.add_node("study_planner", study_planner_node)
builder.add_node("interview_coach", interview_coach_node)

builder.set_entry_point("resume_analyzer")
builder.add_edge("resume_analyzer", "skill_gap")
builder.add_edge("skill_gap", "study_planner")
builder.add_edge("study_planner", "interview_coach")
builder.add_edge("interview_coach", END)

graph = builder.compile()


# ---- Run Graph ----
if __name__ == "__main__":
    file_path = input("Enter resume file path: ")
    with open(file_path, "r", encoding="utf-8") as f:
        resume_text = f.read()

    target_role = input("Enter target role: ")

    result = graph.invoke({
        "resume_text": resume_text,
        "target_role": target_role
    })

    print("\n===== Resume Analysis =====\n", result["analysis"])
    print("\n===== Skill Gaps =====\n", result["gaps"])
    print("\n===== Study Roadmap =====\n", result["roadmap"])
    print("\n===== Interview Questions =====\n", result["questions"])