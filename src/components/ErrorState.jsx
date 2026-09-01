import { Link } from "react-router";
import styles from "./ErrorState.module.css";

export default function ErrorState({
  title = "Noget gik galt",
  message = "Vi kunne ikke hente indholdet. Prøv igen senere.",
  linkText = "← Tilbage",
  linkTo = "/",
  onAction,
}) {
  return (
    <div className={styles.errorState} role="alert">
      <div>
        <strong>{title}</strong>
        <p>{message}</p>
      </div>

      {onAction ? (
        <button
          className={styles.errorBackLink}
          type="button"
          onClick={onAction}
        >
          {linkText}
        </button>
      ) : (
        <Link className={styles.errorBackLink} to={linkTo}>
          {linkText}
        </Link>
      )}
    </div>
  );
}
