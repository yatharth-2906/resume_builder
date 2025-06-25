import { Editor } from "@monaco-editor/react";
import { useState, useEffect, useRef } from 'react';
import styles from './styles/EditorPage.module.css';

export default function EditorPage() {
    const pdfRef = useRef(null);
    const [pdfBlob, setPdfBlob] = useState(null);
    const [latexCode, setLatexCode] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isCompiling, setIsCompiling] = useState(false);
    const [statusMessage, setStatusMessage] = useState('Loading template...');

    useEffect(() => {
        async function handleFetchCode() {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:8000/file`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjg1YThmZDk5OTI5ODZhOGQzYzlhNjgyIiwidXNlcl9lbWFpbCI6IjIxMTQ2MkBqdWl0c29sYW4uaW4iLCJ0ZW1wbGF0ZV9mb2xkZXIiOiI4ZjNhYTBhNjc0NDQ1M2MyOTY0MTNkMWMiLCJpYXQiOjE3NTA3NjU1MzQsImV4cCI6MTc1MTk3NTEzNH0.7UL5Cva1Ady4HWVXq0UQ4Z8d52lC3yQ1KCLHoo6NRHE'
                        },
                        method: "POST",
                        body: JSON.stringify({ "fileName": "template1.tex" })
                    }
                );

                if (!response.ok) {
                    setStatusMessage('Fetching Latex Code failed!');
                    return;
                }

                const data = await response.text();
                setLatexCode(data);
                setStatusMessage(`You're all set! Start editing your LaTeX file.`);
            } catch (error) {
                console.log(error);
                setStatusMessage('Fetching Latex Code failed!');
            } finally {
                setIsLoading(false);
            }
        };

        handleFetchCode();
    }, []);

    const handleCompile = async () => {
        setIsCompiling(true);
        setStatusMessage("Generating PDF from LaTeX code...");

        try {
            const response = await fetch(`http://localhost:8000/compile`,
                {
                    headers: {
                        'Content-Type': 'text/plain',
                        'templatefilename': 'template1.tex',
                        'token': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjg1YThmZDk5OTI5ODZhOGQzYzlhNjgyIiwidXNlcl9lbWFpbCI6IjIxMTQ2MkBqdWl0c29sYW4uaW4iLCJ0ZW1wbGF0ZV9mb2xkZXIiOiI4ZjNhYTBhNjc0NDQ1M2MyOTY0MTNkMWMiLCJpYXQiOjE3NTA3NjU1MzQsImV4cCI6MTc1MTk3NTEzNH0.7UL5Cva1Ady4HWVXq0UQ4Z8d52lC3yQ1KCLHoo6NRHE'
                    },
                    method: "POST",
                    body: String(latexCode)
                }
            );

            if (!response.ok) {
                setStatusMessage('Latex Code Compilation failed!');
                return;
            }

            const blob = await response.blob();
            const pdfUrl = URL.createObjectURL(blob);
            setPdfBlob(pdfUrl);

            setStatusMessage("Compiled successfully! Preview updated.");
        } catch (error) {
            console.log(error);
            setStatusMessage('Latex Code Compilation failed!');
        } finally {
            setIsCompiling(false);
        }
    };

    const handleDownload = () => {
        if (!pdfBlob) return;

        const link = document.createElement("a");
        link.href = pdfBlob;
        link.download = "document.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShare = () => {
        if (!pdfBlob) return;
        window.open(pdfBlob, '_blank');
    };

    // Clearing cache of old pdf blob 
    useEffect(() => {
        return () => {
            if (pdfBlob)
                URL.revokeObjectURL(pdfBlob);
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
                        onClick={handleDownload}
                        disabled={!pdfBlob || isLoading || isCompiling}
                        className={`${styles.button} ${styles.downloadButton}`}
                    >
                        Download PDF
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
                    <Editor
                        height="100%"
                        language="latex"
                        value={latexCode}
                        onChange={(value) => setLatexCode(value)}
                        theme="latexTheme"
                        options={{
                            fontSize: 14,
                            minimap: { enabled: false },
                            wordWrap: 'on',
                        }}
                        onMount={(editor, monaco) => {
                            // Register LaTeX language
                            monaco.languages.register({ id: 'latex' });

                            monaco.languages.setMonarchTokensProvider('latex', {
                                tokenizer: {
                                    root: [
                                        [/\\[a-zA-Z]+/, 'keyword'],
                                        [/%.*$/, 'comment'],
                                        [/\$.*?\$/, 'string'],
                                        [/\{|\}/, 'delimiter.bracket'],
                                        [/[^\\%\${}]+/, 'text'],
                                    ],
                                },
                            });

                            monaco.editor.defineTheme('latexTheme', {
                                base: 'vs', // 'vs' is the correct light theme base
                                inherit: true,
                                rules: [
                                    { token: 'keyword', foreground: '007acc', fontStyle: 'bold' },
                                    { token: 'comment', foreground: '6a9955', fontStyle: 'italic' },
                                    { token: 'string', foreground: 'a31515' },
                                    { token: 'delimiter.bracket', foreground: '000000' },
                                ],
                            });
                        }}
                    />

                </div>

                <div className={styles.previewPane}>
                    {pdfBlob ? (
                        <iframe
                            ref={pdfRef}
                            src={`${pdfBlob}#toolbar=0`}
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