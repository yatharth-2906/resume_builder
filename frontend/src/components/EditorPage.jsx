import { useState, useEffect, useRef } from 'react';
import styles from './styles/EditorPage.module.css';

export default function EditorPage() {
    const [latexCode, setLatexCode] = useState('');
    const [pdfBlob, setPdfBlob] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCompiling, setIsCompiling] = useState(false);
    const [statusMessage, setStatusMessage] = useState('Loading template...');
    const pdfRef = useRef(null);

    // Cloudinary template URL
    const templateUrl = 'https://res.cloudinary.com/dv0ae81wn/raw/upload/resume-templates/289f762812f3fa9408a8767e/template1.tex';

    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                setStatusMessage('Fetching template...');
                const response = await fetch(templateUrl);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const template = await response.text();
                setLatexCode(template);
                setStatusMessage('Ready to edit');
            } catch (error) {
                console.error('Failed to load template:', error);
                setStatusMessage('Failed to load template');
                setLatexCode(`\\documentclass{article}\n\\begin{document}\n\n% Your resume content here\n\n\\end{document}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTemplate();
    }, []);

    const handleCompile = async () => {
        if (!latexCode.trim()) return;

        setIsCompiling(true);
        setStatusMessage('Compiling...');

        try {
            const compileResponse = await fetch('http://localhost:8000/compile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Content-Disposition': 'inline; filename="resume.pdf"' },
                body: JSON.stringify({
                    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjg1OTU1ZWM0MTIzNjBhMzIwMjlmYTQ3IiwidXNlcl9lbWFpbCI6IjIxMTQ2MUBqdWl0c29sYW4uaW4iLCJ0ZW1wbGF0ZV9mb2xkZXIiOiIyODlmNzYyODEyZjNmYTk0MDhhODc2N2UiLCJpYXQiOjE3NTA2ODUxNzYsImV4cCI6MTc1MTg5NDc3Nn0.R-VOUOtkhiL0d-YLXg5UL66cKlJf0LO1Xdw6GL1YyyU",
                    templateFileName: "template1.tex"
                })
            });

            if (!compileResponse.ok) {
                throw new Error(`Compilation failed: ${compileResponse.status}`);
            }

            const pdfBlob = await compileResponse.blob();
            const blobUrl = URL.createObjectURL(pdfBlob);
            setPdfBlob(blobUrl);
            setStatusMessage('Compilation successful');
            
        } catch (error) {
            console.error('Compilation error:', error);
            setStatusMessage(`Error: ${error.message}`);
        } finally {
            setIsCompiling(false);
        }
    };

    const handleShare = () => {
        if (pdfBlob) {
            navigator.clipboard.writeText(pdfBlob)
                .then(() => setStatusMessage('PDF link copied!'))
                .catch(() => setStatusMessage('Failed to copy link'));
        } else {
            setStatusMessage('Compile first to generate PDF');
        }
    };

    // Clean up blob URLs when component unmounts
    useEffect(() => {
        return () => {
            if (pdfBlob) {
                URL.revokeObjectURL(pdfBlob);
            }
        };
    }, [pdfBlob]);

    return (
        <div className={styles.container}>
            <div className={styles.topBar}>
                <div className={styles.fileInfo}>
                    <span className={styles.status}>{statusMessage}</span>
                </div>
                <div className={styles.actions}>
                    <button
                        onClick={handleCompile}
                        disabled={isLoading || isCompiling}
                        className={`${styles.button} ${styles.compileButton}`}
                    >
                        {isCompiling ? 'Compiling...' : 'Compile PDF'}
                    </button>
                    <button
                        onClick={handleShare}
                        disabled={!pdfBlob}
                        className={`${styles.button} ${styles.shareButton}`}
                    >
                        Share PDF
                    </button>
                </div>
            </div>

            <div className={styles.editorPreview}>
                <div className={styles.editorPane}>
                    <textarea
                        value={latexCode}
                        onChange={(e) => setLatexCode(e.target.value)}
                        disabled={isLoading}
                        placeholder={isLoading ? "Loading template..." : "Type LaTeX here..."}
                        className={styles.editor}
                        spellCheck="false"
                    />
                </div>

                <div className={styles.previewPane}>
                    {pdfBlob ? (
                        <iframe
                            ref={pdfRef}
                            src={pdfBlob}
                            title="PDF Preview"
                            className={styles.pdfPreview}
                            type="application/pdf"
                            style={{ width: '100%', height: '100%', border: 'none' }}
                        />
                    ) : (
                        <div className={styles.placeholder}>
                            {isCompiling ? (
                                <div className={styles.loader}>Generating PDF...</div>
                            ) : (
                                <div className={styles.message}>
                                    <p>Compiled PDF will appear here</p>
                                    <small>Click "Compile PDF" to generate preview</small>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}