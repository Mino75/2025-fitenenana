// main.js - Logique principale de l'application Fitenenana

// Application state
let currentTemplate = null;
let currentStep = 0;
let templateData = {};
let templates = {};

// Initialize app
async function initApp() {
    await loadTemplates();
    setupEventListeners();
    showScreen('case-selection');
}

// Load templates from JSON file (optimized for PWA caching)
async function loadTemplates() {
    try {
        // Fast fetch - let service worker handle caching/offline
        const response = await fetch('./templates.json', {
            cache: 'default' // Use cache when available
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        templates = await response.json();
        console.log('Templates loaded:', Object.keys(templates));
        
        // Optional: Validate template structure
        validateTemplates();
        
    } catch (error) {
        console.error('Error loading templates:', error);
        
        // Check if we're offline or if it's a real error
        if (!navigator.onLine) {
            showErrorScreen('Tsy misy connexion internet. Mila mijery ny connexion.');
        } else {
            showErrorScreen('Tsy afaka naka ny templates. Mila mijery ny connexion internet na avereno manokatra ny app.');
        }
    }
}

// Validate template structure (optional but useful)
function validateTemplates() {
    const requiredCases = ['famangiana-zava-manjo', 'fiterahana', 'didi-poatra', 'fangatahana-vady', 'fiarahabana-taona'];
    
    const missingCases = requiredCases.filter(caseId => !templates[caseId]);
    if (missingCases.length > 0) {
        console.warn('Missing template cases:', missingCases);
    }
    
    // Validate each template has required fields
    Object.keys(templates).forEach(caseId => {
        const template = templates[caseId];
        if (!template.title || !template.steps || !Array.isArray(template.steps)) {
            console.warn(`Invalid template structure for: ${caseId}`);
        }
    });
}

function showErrorScreen(message) {
    document.getElementById('app').innerHTML = `
        <div style="padding: 2rem; text-align: center; background: #f8f9fa; min-height: 100vh; display: flex; flex-direction: column; justify-content: center;">
            <h2 style="color: #dc3545; margin-bottom: 1rem;">Olana!</h2>
            <p style="color: #6c757d; margin-bottom: 2rem;">${message}</p>
            <button onclick="location.reload()" style="padding: 0.75rem 1.5rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Avereno
            </button>
        </div>
    `;
}

function setupEventListeners() {
    // Case selection
    document.querySelectorAll('.case-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const caseId = e.currentTarget.dataset.case;
            selectCase(caseId);
        });
    });

    // Navigation
    document.getElementById('back-btn').addEventListener('click', () => {
        showScreen('case-selection');
    });

    document.getElementById('preview-btn').addEventListener('click', () => {
        showPreview();
    });

    document.getElementById('preview-back-btn').addEventListener('click', () => {
        showScreen('template-editor');
    });

    // Export functionality
    document.getElementById('export-btn').addEventListener('click', () => {
        exportText();
    });

    // Save editable content changes
    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('editable-field') || e.target.classList.contains('editable-variable')) {
            saveFieldChange(e.target);
        }
    });
}

function saveFieldChange(element) {
    if (element.dataset.variable) {
        // Save variable change
        templateData[element.dataset.variable] = element.textContent;
    }
    // Field changes are saved automatically via contenteditable
}

function selectCase(caseId) {
    if (templates[caseId]) {
        currentTemplate = templates[caseId];
        currentStep = 0;
        templateData = { ...currentTemplate.variables };
        
        document.getElementById('current-case-title').textContent = currentTemplate.title;
        loadTemplate();
        showScreen('template-editor');
    } else {
        console.error('Template not found:', caseId);
    }
}

function loadTemplate() {
    const dialogueView = document.getElementById('full-dialogue');
    dialogueView.innerHTML = '';
    
    currentTemplate.steps.forEach((step, index) => {
        const stepElement = document.createElement('div');
        stepElement.className = 'dialogue-step';
        stepElement.innerHTML = `
            <div class="step-header">
                <span class="step-number">${step.id}</span>
                <h3 class="step-title">${step.title}</h3>
            </div>
            <div class="step-content">
                ${createEditableContent(step, index)}
            </div>
        `;
        dialogueView.appendChild(stepElement);
    });
}

function createEditableContent(step, stepIndex) {
    let content = step.content;
    
    // Replace quotes and variables with editable spans
    step.editableFields?.forEach((field, fieldIndex) => {
        const editableId = `editable-${stepIndex}-${fieldIndex}`;
        const editableSpan = `<span class="editable-field" contenteditable="true" data-field="${editableId}" data-original="${field.text}">"${field.text}"</span>`;
        content = content.replace(`"${field.text}"`, editableSpan);
    });
    
    // Replace variables
    Object.keys(templateData).forEach(key => {
        const variableSpan = `<span class="editable-variable" contenteditable="true" data-variable="${key}">${templateData[key]}</span>`;
        content = content.replace(templateData[key], variableSpan);
    });
    
    // Preserve line breaks
    content = content.replace(/\n/g, '<br>');
    
    return `<div class="editable-content">${content}</div>`;
}

function showPreview() {
    // Generate complete text with user modifications
    let previewContent = '';
    
    // Get current content from the editable fields
    currentTemplate.steps.forEach((step, stepIndex) => {
        previewContent += `<div class="preview-step">`;
        previewContent += `<h4>${step.title}</h4>`;
        
        let content = step.content;
        
        // Replace with current values from editable fields
        const editableFields = document.querySelectorAll(`[data-field^="editable-${stepIndex}"]`);
        editableFields.forEach(field => {
            const original = field.dataset.original;
            const current = field.textContent.replace(/"/g, '');
            content = content.replace(`"${original}"`, `"${current}"`);
        });
        
        // Replace variables with current values
        Object.keys(templateData).forEach(key => {
            const variableElements = document.querySelectorAll(`[data-variable="${key}"]`);
            if (variableElements.length > 0) {
                const currentValue = variableElements[0].textContent;
                content = content.replace(templateData[key], currentValue);
            }
        });
        
        previewContent += `<p>${content.replace(/\n/g, '<br>')}</p>`;
        previewContent += `</div>`;
    });
    
    document.getElementById('preview-content').innerHTML = previewContent;
    showScreen('preview-screen');
}

function exportText() {
    // Get the preview content as plain text
    let exportContent = '';
    
    currentTemplate.steps.forEach((step, stepIndex) => {
        exportContent += `${step.title}\n`;
        exportContent += '=' .repeat(step.title.length) + '\n\n';
        
        let content = step.content;
        
        // Replace with current values from editable fields
        const editableFields = document.querySelectorAll(`[data-field^="editable-${stepIndex}"]`);
        editableFields.forEach(field => {
            const original = field.dataset.original;
            const current = field.textContent.replace(/"/g, '');
            content = content.replace(`"${original}"`, `"${current}"`);
        });
        
        // Replace variables with current values
        Object.keys(templateData).forEach(key => {
            const variableElements = document.querySelectorAll(`[data-variable="${key}"]`);
            if (variableElements.length > 0) {
                const currentValue = variableElements[0].textContent;
                content = content.replace(templateData[key], currentValue);
            }
        });
        
        exportContent += content + '\n\n';
    });
    
    // Try to use the Web Share API if available
    if (navigator.share) {
        navigator.share({
            title: currentTemplate.title,
            text: exportContent
        }).catch(err => {
            console.log('Sharing failed:', err);
            fallbackExport(exportContent);
        });
    } else {
        fallbackExport(exportContent);
    }
}

function fallbackExport(content) {
    // Fallback: copy to clipboard or download
    if (navigator.clipboard) {
        navigator.clipboard.writeText(content).then(() => {
            showNotification('Nadika tao amin\'ny clipboard!');
        }).catch(() => {
            downloadAsFile(content);
        });
    } else {
        downloadAsFile(content);
    }
}

function downloadAsFile(content) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTemplate.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('Voadownload ny rakitra!');
}

function showNotification(message) {
    // Simple notification system
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
        style.remove();
    }, 3000);
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
