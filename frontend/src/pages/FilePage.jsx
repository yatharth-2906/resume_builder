import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HomeLoading from './HomeLoading';
import styles from './styles/FilePage.module.css';

function FilePage() {
    const { folder, fileName } = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [fileContent, setFileContent] = useState(null);

    useEffect(() => {
        async function fetchFileContent() {
            setIsLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/file/resume`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        fileName: fileName,
                        template_folder: folder,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch file content');
                }

                const blob = await response.blob();
                const pdfUrl = URL.createObjectURL(blob);
                setFileContent(pdfUrl);
            } catch (error) {
                console.error('Error fetching file content:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchFileContent();

        return () => {
            if (fileContent) {
                URL.revokeObjectURL(fileContent);
            }
        };
    }, []);

    return (
        <div style={{ width: '100vw', height: '100dvh', overflow: 'hidden' }}>
            {isLoading ? (
                <HomeLoading />
            ) : (
                <div>
                    {fileContent ? (
                        <>
                            <iframe
                                src={fileContent}
                                title="Resume PDF"
                                style={{ width: '100%', height: '100dvh', border: 'none' }}
                            ></iframe>
                            <div className={styles.mobileFallback}>
                                <a href={fileContent} download className={styles.downloadLink}>
                                    Download PDF
                                </a>
                            </div>
                        </>
                    ) : (
                        <p className={styles.errorMessage}>Error loading file content.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default FilePage;
