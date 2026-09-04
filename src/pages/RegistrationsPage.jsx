import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import { getRegistrations } from "../services/supabaseClient";
import styles from "./RegistrationsPage.module.css";

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRegistrations() {
      try {
        setLoading(true);
        setError("");

        const data = await getRegistrations();
        setRegistrations(data);
        setRegistrationCount(data.length);
      } catch (error) {
        console.error(error);
        setError("Vi kunne ikke hente tilmeldinger. Prøv igen senere.");
      } finally {
        setLoading(false);
      }
    }

    loadRegistrations();
  }, []);

  const registrationsByEvent = registrations.reduce((groups, registration) => {
    const eventId = registration.events?.id || "unknown";

    if (!groups[eventId]) {
      groups[eventId] = [];
    }

    groups[eventId].push(registration);

    return groups;
  }, {});

  const statusLabels = {
    Ny: "Afventer bekræftelse",
    Bekræftet: "Bekræftet",
  };

  return (
    <>
      <header className={styles.adminHeader}>
        <p className="eyebrow">Internt overblik</p>
        <h1>Tilmeldinger</h1>
        <p>{registrationCount} tilmeldinger i alt</p>
      </header>

      <main>
        <div className={styles.registrationList}>
          {loading && <LoadingState message="Henter tilmeldinger..." />}

          {error && (
            <ErrorState
              title="Tilmeldinger kunne ikke hentes"
              message={error}
            />
          )}

          {!loading && !error && registrations.length === 0 && (
            <EmptyState
              title="Ingen tilmeldinger endnu"
              message="Der er endnu ingen tilmeldinger."
            />
          )}

          {!loading &&
            !error &&
            Object.entries(registrationsByEvent).map(
              ([eventId, eventRegistrations]) => {
                const capacity = eventRegistrations[0]?.events?.capacity || 0;
                const eventRegistrationCount = eventRegistrations.length;
                const remainingSeats = capacity - eventRegistrationCount;

                let availability = "God plads";

                if (remainingSeats <= 0) {
                  availability = "Udsolgt";
                } else if (remainingSeats <= capacity / 4) {
                  availability = "Få pladser";
                }

                return (
                  <section className={styles.registrationGroup} key={eventId}>
                    <div className={styles.registrationGroupHeader}>
                      <h2>
                        {eventRegistrations[0]?.events?.title || "Ukendt event"}
                      </h2>

                      <p>
                        {eventRegistrationCount} / {capacity} tilmeldte ·{" "}
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
                      </p>
                    </div>

                    <div
                      className={`${styles.registrationRow} ${styles.registrationLabels}`}
                    >
                      <span>Navn</span>
                      <span>E-mail</span>
                      <span>Dato</span>
                      <span>Status</span>
                    </div>

                    {eventRegistrations.map((registration) => (
                      <div
                        className={styles.registrationRow}
                        key={registration.id}
                      >
                        <div>
                          <strong>{registration.name}</strong>
                        </div>

                        <span>{registration.email}</span>

                        <span>
                          {registration.events?.date
                            ? new Date(
                                registration.events.date,
                              ).toLocaleDateString("da-DK")
                            : "—"}
                        </span>

                        <span
                          className={`${styles.status} ${
                            registration.status === "Ny"
                              ? styles.statusPending
                              : styles.statusConfirmed
                          }`}
                        >
                          {statusLabels[registration.status] ||
                            registration.status}
                        </span>
                      </div>
                    ))}
                  </section>
                );
              },
            )}
        </div>
      </main>

      <Footer />
    </>
  );
}
