import Cookies from 'js-cookie';
import HomeLoading from './HomeLoading';
import FileLoading from './FileLoading';
import { Editor } from "@monaco-editor/react";
import { useState, useEffect, useRef } from 'react';
import styles from './styles/EditorPage.module.css';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditorPage() {
    const navigate = useNavigate();

    const token = Cookies.get('token');
    const { fileName } = useParams();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        function checkParams() {
            if (!token || !user || !fileName) {
                navigate('/login');
                return;
            }
        }

        checkParams();
    }, []);


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
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/file`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        method: "POST",
                        body: JSON.stringify({ fileName, "template_folder": user.template_folder })
                    }
                );

                if (!response.ok) {
                    setStatusMessage('Fetching Latex Code failed!');
                    return;
                }

                const data = await response.text();
                setLatexCode(data);

                const resumeFileName = `resume${fileName.match(/\d+/)?.[0]}`;
                const responseBlob = await fetch(`${import.meta.env.VITE_BACKEND_URL}/file/resume`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        method: "POST",
                        body: JSON.stringify({ fileName: resumeFileName, "template_folder": user.template_folder })
                    }
                );

                if (!responseBlob.ok) {
                    setStatusMessage('Fetching PDF failed!');
                    return;
                }

                const blob = await responseBlob.blob();
                const pdfUrl = URL.createObjectURL(blob);
                setPdfBlob(pdfUrl);

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
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/compile`,
                {
                    headers: {
                        'Content-Type': 'text/plain',
                        'templatefilename': fileName,
                        'token': `Bearer ${token}`
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
        const folder = user.template_folder;
        const pdfFileName = `resume${fileName.match(/\d+/)?.[0]}`;
        const shareUrl = `/file/${folder}/${pdfFileName}`;
        window.open(shareUrl, '_blank');
    };

    // Clearing cache of old pdf blob 
    useEffect(() => {
        return () => {
            if (pdfBlob)
                URL.revokeObjectURL(pdfBlob);
        };
    }, [pdfBlob]);

    return isLoading ? (
        <HomeLoading />
    ) : (
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
                            lineNumbers: 'off',
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
                                base: 'vs',
                                inherit: true,
                                rules: [
                                    { token: 'keyword', foreground: '007acc', fontStyle: 'bold' },
                                    { token: 'comment', foreground: '6a9955', fontStyle: 'italic' },
                                    { token: 'string', foreground: 'a31515' },
                                    { token: 'delimiter.bracket', foreground: '000000' },
                                ],
                            });

                            // Add Ctrl+/ (Cmd+/ on Mac) comment shortcut
                            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash, () => {
                                const selection = editor.getSelection();
                                const model = editor.getModel();

                                if (!selection || !model) return;

                                const startLine = selection.startLineNumber;
                                const endLine = selection.endLineNumber;
                                let shouldComment = true;

                                // Check if all selected lines are already commented
                                for (let i = startLine; i <= endLine; i++) {
                                    const line = model.getLineContent(i);
                                    if (!line.trim().startsWith('%')) {
                                        shouldComment = true;
                                        break;
                                    }
                                    shouldComment = false;
                                }

                                // Toggle comments
                                editor.executeEdits("", [
                                    ...Array.from({ length: endLine - startLine + 1 }, (_, i) => {
                                        const lineNum = startLine + i;
                                        const lineText = model.getLineContent(lineNum);

                                        if (shouldComment) {
                                            // Add comment
                                            return {
                                                range: new monaco.Range(lineNum, 1, lineNum, 1),
                                                text: '% ',
                                            };
                                        } else {
                                            // Remove comment
                                            if (lineText.startsWith('% ')) {
                                                return {
                                                    range: new monaco.Range(lineNum, 1, lineNum, 3),
                                                    text: '',
                                                };
                                            } else if (lineText.startsWith('%')) {
                                                return {
                                                    range: new monaco.Range(lineNum, 1, lineNum, 2),
                                                    text: '',
                                                };
                                            }
                                            return null;
                                        }
                                    }).filter(Boolean)
                                ]);
                            });
                        }}
                    />

                </div>

                <div className={styles.previewPane}>
                    <div className={styles.pdfWrapper}>
                        <iframe
                            ref={pdfRef}
                            src={pdfBlob ? `${pdfBlob}#toolbar=0` : ''}
                            title="PDF Preview"
                            className={styles.pdfPreview}
                            type="application/pdf"
                            style={{ width: '100%', height: '100%', border: 'none' }}
                        />
                        {isCompiling && <FileLoading />}
                    </div>
                </div>
            </div>
        </div>
    );
}