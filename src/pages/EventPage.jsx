import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import Footer from "../components/Footer";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
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

      setEvent((currentEvent) => ({
        ...currentEvent,
        registrations: [
          {
            count: (currentEvent.registrations?.[0]?.count || 0) + 1,
          },
        ],
      }));

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
          <LoadingState message="Henter event..." />
        </main>

        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <main className={styles.eventPage}>
          <ErrorState
            title="Eventet kunne ikke hentes"
            message={error}
            linkText="← Alle events"
            linkTo="/"
          />
        </main>

        <Footer />
      </>
    );
  }

  if (!event) {
    return (
      <>
        <main className={styles.eventPage}>
          <div className={styles.emptyState}>
            <div>
              <strong>Vi kunne ikke finde dette event</strong>
              <p>Eventet findes ikke længere eller kunne ikke findes.</p>
            </div>

            <Link className={styles.errorBackLink} to="/">
              ← Alle events
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  const date = new Date(event.date);
  const venue = event.venues;

  const registrationCount = event.registrations?.[0]?.count || 0;
  const remainingSeats = event.capacity - registrationCount;

  let availability = "God plads";

  if (remainingSeats <= 0) {
    availability = "Udsolgt";
  } else if (remainingSeats <= event.capacity / 4) {
    availability = "Få pladser";
  }

  const isSoldOut = remainingSeats <= 0;

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

            <p className={styles.lead}>{event.summary}</p>

            <div className={styles.availability}>
              <strong>
                {registrationCount} / {event.capacity} tilmeldte
              </strong>

              <span
                className={
                  availability === "Udsolgt"
                    ? styles.soldOut
                    : availability === "Få pladser"
                      ? styles.fewSeats
                      : styles.goodAvailability
                }
              >
                {availability}
              </span>
            </div>

            <div className={styles.detailList}>
              <p>
                <strong>Dato</strong>

                <span>
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
                </span>
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
                        Besøg venue →
                      </a>
                    </>
                  )}
                </span>
              </p>

              <p>
                <strong>Pris</strong>

                <span>
                  {event.price === 0 ? "Gratis" : `${event.price} kr.`}
                </span>
              </p>
            </div>

            <p className={styles.description}>{event.description}</p>
          </div>
        </section>

        <section className={styles.signupPanel}>
          <div className={styles.signupIntro}>
            <p className="eyebrow dark">Tilmelding</p>

            <h2>Reserver din plads</h2>

            <p>
              Udfyld formularen, så sender vi din tilmelding til arrangøren.
            </p>
          </div>

          <div className={styles.signupFormArea}>
            {isSoldOut ? (
              <div className={styles.registrationError} role="status">
                <strong>Eventet er udsolgt</strong>

                <p>Der er ikke flere ledige pladser.</p>
              </div>
            ) : (
              <>
                {registrationSuccess && (
                  <div className={styles.successMessage} role="status">
                    <strong>Tilmeldingen er gennemført</strong>

                    <p>Du er nu tilmeldt eventet.</p>
                  </div>
                )}

                {registrationError && (
                  <div className={styles.registrationError} role="alert">
                    <strong>Der opstod en fejl</strong>

                    <p>{registrationError}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <label>
                    Navn
                    <input
                      type="text"
                      value={name}
                      onChange={(inputEvent) =>
                        setName(inputEvent.target.value)
                      }
                      required
                    />
                  </label>

                  <label>
                    E-mail
                    <input
                      type="email"
                      value={email}
                      onChange={(inputEvent) =>
                        setEmail(inputEvent.target.value)
                      }
                      placeholder="dig@example.com"
                      required
                    />
                  </label>

                  <button type="submit" disabled={submitting}>
                    {submitting ? "Tilmelder..." : "Tilmeld mig →"}
                  </button>
                </form>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
