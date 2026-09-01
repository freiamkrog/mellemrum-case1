import styles from "./EmptyState.module.css";

export default function EmptyState({
  title = "Ingen events fundet",
  message = "Der er ikke noget at vise lige nu.",
}) {
  return (
    <div className={styles.emptyState}>
      <strong>{title}</strong>
      <p>{message}</p>
    </div>
  );
}
