import { Link } from "react-router";
import styles from "./EventCard.module.css";

export default function EventCard({ event }) {
  function formatEventDate(eventDate) {
    const date = new Date(eventDate);
    const formattedDate = date.toLocaleDateString("da-DK", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  const registrationCount = event.registrations?.[0]?.count || 0;

  return (
    <Link className={styles.eventCard} to={`/events/${event.id}`}>
      <img src={event.image} alt="" loading="lazy" />

      <div className={styles.eventCardContent}>
        <p className={styles.eventCategory}>{event.category}</p>

        <h3>{event.title}</h3>

        <p>{event.summary}</p>

        <div className={styles.eventMeta}>
          <span>{formatEventDate(event.date)}</span>
          <span>{event.venues?.name}</span>
        </div>

        <div className={styles.cardFooter}>
          <span className={styles.cardLink}>Læs mere</span>

          <span className={styles.eventAvailability}>
            {registrationCount} / {event.capacity} tilmeldte
          </span>
        </div>
      </div>
    </Link>
  );
}
