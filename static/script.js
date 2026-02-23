const API_URL = 'http://localhost:8000';

const form = document.getElementById('analysisForm');
const submitBtn = document.getElementById('submitBtn');
const loadingSection = document.getElementById('loadingSection');
const resultsSection = document.getElementById('resultsSection');
const errorSection = document.getElementById('errorSection');

// Progress step elements
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const step4 = document.getElementById('step4');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const resumeText = document.getElementById('resumeText').value.trim();
    const targetRole = document.getElementById('targetRole').value.trim();

    if (!resumeText || !targetRole) {
        showError('Please fill in all required fields');
        return;
    }

    // Disable button and show loading state
    submitBtn.disabled = true;
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    if (btnText) btnText.style.display = 'none';
    if (btnLoader) btnLoader.style.display = 'inline';

    // Hide form and results, show loading
    form.style.display = 'none';
    resultsSection.style.display = 'none';
    errorSection.style.display = 'none';
    loadingSection.style.display = 'block';

    // Reset progress steps
    [step1, step2, step3, step4].forEach(step => step.classList.remove('active'));

    // Get status text element
    const statusText = document.getElementById('statusText');
    
    // Initial status
    if (statusText) {
        statusText.textContent = '🚀 Starting analysis...';
    }
    
    // Progress steps with status updates
    const progressSteps = [
        { delay: 800, step: step1, text: '📄 Analyzing Resume...', subtext: 'Extracting key skills and experiences' },
        { delay: 3000, step: step2, text: '🔍 Detecting Skill Gaps...', subtext: 'Identifying areas for improvement' },
        { delay: 6000, step: step3, text: '📚 Generating Study Roadmap...', subtext: 'Creating personalized learning plan' },
        { delay: 9000, step: step4, text: '💼 Creating Interview Questions...', subtext: 'Preparing tailored questions' }
    ];

    // Update status text and activate steps
    progressSteps.forEach(({ delay, step, text, subtext }, index) => {
        setTimeout(() => {
            if (statusText) {
                statusText.textContent = text;
                statusText.classList.add('status-update');
                setTimeout(() => statusText.classList.remove('status-update'), 400);
            }
            
            // Update step status
            const stepStatus = step.querySelector('.step-status');
            if (stepStatus) {
                stepStatus.textContent = 'Processing...';
            }
            
            step.classList.add('active');
            
            // Mark previous step as complete
            if (index > 0) {
                const prevStep = progressSteps[index - 1].step;
                const prevStatus = prevStep.querySelector('.step-status');
                if (prevStatus) {
                    prevStatus.textContent = '✓ Complete';
                    prevStatus.style.opacity = '0.9';
                }
            }
        }, delay);
    });
    
    // Final completion message
    setTimeout(() => {
        if (statusText) {
            statusText.textContent = '✨ Finalizing results...';
        }
        // Mark last step as complete
        const lastStatus = step4.querySelector('.step-status');
        if (lastStatus) {
            lastStatus.textContent = '✓ Complete';
            lastStatus.style.opacity = '0.9';
        }
    }, 11000);

    try {
        const response = await fetch(`${API_URL}/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                resume_text: resumeText,
                target_role: targetRole
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Analysis failed');
        }

        if (data.success) {
            // Show completion message
            const statusText = document.getElementById('statusText');
            if (statusText) {
                statusText.textContent = '✅ Analysis Complete!';
                statusText.classList.add('status-update');
            }
            
            // Mark all steps as complete
            [step1, step2, step3, step4].forEach(step => {
                const stepStatus = step.querySelector('.step-status');
                if (stepStatus) {
                    stepStatus.textContent = '✓ Complete';
                    stepStatus.style.opacity = '0.9';
                }
                step.classList.add('active');
            });
            
            // Small delay before showing results with fade out
            setTimeout(() => {
                loadingSection.style.opacity = '0';
                loadingSection.style.transform = 'translateY(-20px)';
                loadingSection.style.transition = 'all 0.5s ease';
                
                setTimeout(() => {
                    loadingSection.style.display = 'none';
                    displayResults(data);
                }, 500);
            }, 1000);
        } else {
            throw new Error(data.message || 'Analysis failed');
        }

    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'An error occurred during analysis. Please try again.');
    } finally {
        loadingSection.style.display = 'none';
        submitBtn.disabled = false;
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        if (btnText) btnText.style.display = 'inline';
        if (btnLoader) btnLoader.style.display = 'none';
    }
});

function displayResults(data) {
    // Format and display results
    document.getElementById('analysisContent').textContent = data.analysis || 'No analysis available';
    document.getElementById('gapsContent').textContent = data.gaps || 'No gap analysis available';
    document.getElementById('roadmapContent').textContent = data.roadmap || 'No roadmap available';
    document.getElementById('questionsContent').textContent = data.questions || 'No questions available';

    // Reset loading section styles
    loadingSection.style.opacity = '1';
    loadingSection.style.transform = 'translateY(0)';
    
    // Show results section with animation
    resultsSection.style.display = 'block';
    resultsSection.style.opacity = '0';
    resultsSection.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        resultsSection.style.transition = 'all 0.6s ease';
        resultsSection.style.opacity = '1';
        resultsSection.style.transform = 'translateY(0)';
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    errorSection.style.display = 'block';
    loadingSection.style.display = 'none';
}

function resetForm() {
    form.reset();
    form.style.display = 'block';
    resultsSection.style.display = 'none';
    errorSection.style.display = 'none';
    loadingSection.style.display = 'none';
    
    // Reset button state
    submitBtn.disabled = false;
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    if (btnText) btnText.style.display = 'inline';
    if (btnLoader) btnLoader.style.display = 'none';
    
    // Reset progress steps
    [step1, step2, step3, step4].forEach(step => {
        step.classList.remove('active');
        const stepStatus = step.querySelector('.step-status');
        if (stepStatus) {
            stepStatus.textContent = 'Pending';
            stepStatus.style.opacity = '0.8';
            stepStatus.style.color = '';
        }
    });
    
    // Reset status text
    const statusText = document.getElementById('statusText');
    if (statusText) {
        statusText.textContent = 'Initializing analysis...';
        statusText.classList.remove('status-update');
    }
    
    // Reset loading section styles
    loadingSection.style.opacity = '1';
    loadingSection.style.transform = 'translateY(0)';
    loadingSection.style.transition = '';
    
    // Reset results section styles
    resultsSection.style.opacity = '1';
    resultsSection.style.transform = 'translateY(0)';
    resultsSection.style.transition = '';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
