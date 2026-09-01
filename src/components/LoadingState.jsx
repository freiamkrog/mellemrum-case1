import styles from "./LoadingState.module.css";

export default function LoadingState({ message = "Henter..." }) {
  return (
    <div className={styles.loadingState} role="status">
      <span className={styles.loadingSpinner} aria-hidden="true"></span>

      <div>
        <strong>{message}</strong>
        <p>Vi gør siden klar.</p>
      </div>
    </div>
  );
}
