import styles from './styles/FileLoading.module.css';

function FileLoading() {
    return (
        <div className={styles.overlay}>
            <div className={styles.loader}></div>
        </div>
    );
}

export default FileLoading;
