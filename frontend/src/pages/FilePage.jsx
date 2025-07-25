import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './styles/FilePage.module.css';

function FilePage() {
    const { folder, fileName } = useParams();
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const fetchPdf = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/file/resumeurl`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fileName, template_folder: folder }),
                });

                const data = await response.json();
                if (data.status === 'success') {
                    setPdfUrl(data.url);
                } else {
                    console.error('Error from backend:', data.message);
                }
            } catch (error) {
                console.error('Error loading PDF:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPdf();

        const handleResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (loading) return <div className={styles.loader}>Loading PDF...</div>;

    return (
        <div className={styles.pdfWrapper}>
            {pdfUrl && (
                <div className={styles.pdfContainer}>
                    <div className={styles.fallbackText}>
                        <a href={pdfUrl} download className={styles.downloadLink}>
                            Download PDF
                        </a>
                        if it doesn't load properly
                    </div>
                    <iframe
                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`}
                        className={styles.pdfViewer}
                        style={{
                            width: '100%',
                            height: dimensions.height * 0.9,
                            maxWidth: '900px',
                            border: 'none'
                        }}
                        title="Resume PDF"
                        allowFullScreen
                    />
                </div>
            )}
        </div>
    );
}

export default FilePage;
