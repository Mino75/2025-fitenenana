// styles.js - Injection du CSS dans la page
(function() {
    const styles = `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            color: #333;
        }

        .screen {
            display: none;
            min-height: 100vh;
        }

        .screen.active {
            display: block;
        }

        header {
            background: #2c3e50;
            color: white;
            padding: 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        h1, h2 {
            font-size: 1.5rem;
        }

        .case-list {
            padding: 2rem;
            max-width: 600px;
            margin: 0 auto;
        }

        .case-btn {
            display: flex;
            align-items: center;
            width: 100%;
            padding: 1rem;
            margin-bottom: 1rem;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .case-btn:hover {
            background: #f8f9fa;
            border-color: #2c3e50;
        }

        .case-number {
            background: #2c3e50;
            color: white;
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 1rem;
        }

        .case-title {
            font-weight: 500;
        }

        .editor-container {
            height: calc(100vh - 80px);
            overflow-y: auto;
        }

        .dialogue-view {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
        }

        .dialogue-step {
            background: white;
            margin-bottom: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .step-header {
            background: #34495e;
            color: white;
            padding: 1rem;
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .step-number {
            background: #3498db;
            color: white;
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 0.9rem;
        }

        .step-title {
            font-size: 1.1rem;
            margin: 0;
        }

        .dialogue-step .step-content {
            padding: 1.5rem;
        }

        .editable-content {
            line-height: 1.6;
            font-size: 1rem;
        }

        .editable-field, .editable-variable {
            background: #fff3cd;
            padding: 2px 6px;
            border-radius: 4px;
            border: 2px dashed #ffc107;
            cursor: text;
            transition: all 0.2s;
        }

        .editable-field:hover, .editable-variable:hover {
            background: #ffeaa7;
            border-color: #e17055;
        }

        .editable-field:focus, .editable-variable:focus {
            outline: none;
            background: #e3f2fd;
            border: 2px solid #007bff;
            box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
        }

        .back-btn, .preview-btn, .export-btn {
            padding: 0.5rem 1rem;
            background: #3498db;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        .back-btn:hover, .preview-btn:hover, .export-btn:hover {
            background: #2980b9;
        }

        .preview-container {
            max-width: 800px;
            margin: 2rem auto;
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .preview-step {
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #eee;
        }

        .preview-step:last-child {
            border-bottom: none;
        }

        .preview-step h4 {
            color: #2c3e50;
            margin-bottom: 0.5rem;
            font-size: 1.1rem;
        }

        .preview-step p {
            line-height: 1.6;
            white-space: pre-wrap;
        }

        /* Responsive design */
        @media (max-width: 768px) {
            .case-list {
                padding: 1rem;
            }
            
            .dialogue-view {
                padding: 1rem;
            }
            
            .preview-container {
                margin: 1rem;
                padding: 1rem;
            }
            
            header {
                padding: 0.75rem;
            }
            
            h1, h2 {
                font-size: 1.25rem;
            }
        }
    `;

    // Injecter les styles dans la page
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
})();
