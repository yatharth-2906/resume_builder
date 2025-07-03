import styles from './styles/HomeLoading.module.css';

function HomeLoading() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div className={styles.loader}></div>
    </div>
  );
}

export default HomeLoading;
