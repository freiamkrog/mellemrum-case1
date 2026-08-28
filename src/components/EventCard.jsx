import { Link } from "react-router";

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

  return (
    <article className="event-card">
      <img src={event.image} alt="" />

      <div className="event-card-content">
        <p className="event-category">{event.category}</p>
        <h3>{event.title}</h3>
        <p>{event.summary}</p>

        <div className="event-meta">
          <span>{formatEventDate(event.date)}</span>
          <span>{event.venueName}</span>
        </div>

        <Link className="card-link" to={`/events/${event.id}`}>
          Læs mere
        </Link>
      </div>
    </article>
  );
}
