import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import Footer from "../components/Footer";
import { createRegistration, getEvent } from "../services/supabaseClient";
import styles from "./EventPage.module.css";

export default function EventPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState("");

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

    try {
      setSubmitting(true);
      setRegistrationSuccess(false);
      setRegistrationError("");

      const registration = {
        name,
        email,
        event_id: event.id,
        status: "Ny",
      };

      await createRegistration(registration);

      setRegistrationSuccess(true);
      setName("");
      setEmail("");
    } catch (error) {
      console.error(error);
      setRegistrationError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <>
        <main className={styles.eventPage}>
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
        <main className={styles.eventPage}>
          <p className="message" role="alert">
            {error}
          </p>

          <Link className={styles.backLink} to="/">
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
        <main className={styles.eventPage}>
          <p className="message">Vi kunne ikke finde dette event.</p>

          <Link className={styles.backLink} to="/">
            ← Alle events
          </Link>
        </main>

        <Footer />
      </>
    );
  }

  const date = new Date(event.date);
  const venue = event.venues;

  return (
    <>
      <main className={styles.eventPage}>
        <Link className={styles.backLink} to="/">
          ← Alle events
        </Link>

        <section className={styles.eventDetail}>
          <img src={event.image} alt="" />

          <div className={styles.eventDetailContent}>
            <p className={styles.eventCategory}>{event.category}</p>

            <h1>{event.title}</h1>

            <p className="lead">{event.summary}</p>

            <div className={styles.detailList}>
              <p>
                <strong>Dato</strong>
                {date.toLocaleDateString("da-DK", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}{" "}
                kl.{" "}
                {date.toLocaleTimeString("da-DK", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <p>
                <strong>Sted</strong>
                <span>
                  {venue?.name}
                  <br />
                  {venue?.address}, {venue?.postalCode} {venue?.city}
                  {venue?.website && (
                    <>
                      <br />
                      <a href={venue.website} target="_blank" rel="noreferrer">
                        Besøg venue
                      </a>
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

        <section className={styles.signupPanel}>
          <div>
            <p className="eyebrow dark">Tilmelding</p>

            <h2>Reserver din plads</h2>

            <p>
              Udfyld formularen, så sender vi din tilmelding til arrangøren.
            </p>
          </div>

          {registrationSuccess && (
            <p className="message" role="status">
              Du er nu tilmeldt eventet.
            </p>
          )}

          {registrationError && (
            <p className="message" role="alert">
              {registrationError}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <label>
              Navn
              <input
                value={name}
                onChange={(inputEvent) => setName(inputEvent.target.value)}
                required
              />
            </label>

            <label>
              E-mail
              <input
                type="email"
                value={email}
                onChange={(inputEvent) => setEmail(inputEvent.target.value)}
                placeholder="dig@example.com"
                required
              />
            </label>

            <button type="submit" disabled={submitting}>
              {submitting ? "Tilmelder..." : "Tilmeld mig"}
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
}
