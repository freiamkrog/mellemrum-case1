import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import Footer from "../components/Footer";
import { getEvent } from "../services/supabaseClient";

export default function EventPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        setError("");

        const data = await getEvent(eventId);
        setEvent(data);
      } catch (error) {
        console.error(error);
        setError("Vi kunne ikke hente dette event. Prøv igen senere.");
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [eventId]);

  async function handleSubmit(eventSubmit) {
    eventSubmit.preventDefault();
    console.log({ name, email, event: event.title });
  }

  if (loading) {
    return (
      <>
        <main className="event-page">
          <p className="message" role="status">
            Henter event...
          </p>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <main className="event-page">
          <p className="message" role="alert">
            {error}
          </p>
          <Link className="back-link" to="/">
            ← Alle events
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  if (!event) {
    return (
      <>
        <main className="event-page">
          <p className="message">Vi kunne ikke finde dette event.</p>
          <Link className="back-link" to="/">
            ← Alle events
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const date = new Date(event.date);

  return (
    <>
      <main className="event-page">
        <Link className="back-link" to="/">
          ← Alle events
        </Link>

        <section className="event-detail">
          <img src={event.image} alt="" />
          <div className="event-detail-content">
            <p className="event-category">{event.category}</p>
            <h1>{event.title}</h1>
            <p className="lead">{event.summary}</p>
            <div className="detail-list">
              <p>
                <strong>Dato</strong>
                {date.toLocaleDateString("da-DK", { weekday: "long", day: "numeric", month: "long" })} kl.{" "}
                {date.toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" })}
              </p>
              <p>
                <strong>Sted</strong>
                <span>
                  {event.venueName}
                  <br />
                  {event.venueAddress}, {event.venuePostalCode} {event.venueCity}
                  {event.venueWebsite && (
                    <>
                      <br />
                      <a href={event.venueWebsite}>Besøg venue</a>
                    </>
                  )}
                </span>
              </p>
              <p>
                <strong>Pris</strong>
                {event.price === 0 ? "Gratis" : `${event.price} kr.`}
              </p>
            </div>
            <p>{event.description}</p>
          </div>
        </section>

        <section className="signup-panel">
          <div>
            <p className="eyebrow dark">Tilmelding</p>
            <h2>Reserver din plads</h2>
            <p>Udfyld formularen, så sender vi din tilmelding til arrangøren.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <label>
              Navn
              <input value={name} onChange={(inputEvent) => setName(inputEvent.target.value)} />
            </label>
            <span>E-mail</span>
            <input
              value={email}
              onChange={(inputEvent) => setEmail(inputEvent.target.value)}
              placeholder="dig@example.com"
            />
            <button type="submit">Tilmeld mig</button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
