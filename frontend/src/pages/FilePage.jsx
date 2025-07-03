import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HomeLoading from './HomeLoading';
import styles from './styles/FilePage.module.css';

function FilePage() {
    const { folder, fileName } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [fileContent, setFileContent] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check if mobile device
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

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
    }, [folder, fileName]);

    return (
        <div className={styles.container}>
            {isLoading ? (
                <HomeLoading />
            ) : (
                <div className={styles.content}>
                    {fileContent ? (
                        <>
                            {!isMobile ? (
                                <iframe
                                    src={fileContent}
                                    title="Resume PDF"
                                    className={styles.pdfViewer}
                                ></iframe>
                            ) : (
                                <div className={styles.mobileView}>
                                    <p className={styles.mobileMessage}>
                                        For best experience on mobile, please download the PDF:
                                    </p>
                                    <a
                                        href={fileContent}
                                        download={`resume.pdf`}
                                        className={styles.downloadLink}
                                    >
                                        Download PDF
                                    </a>
                                </div>
                            )}
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