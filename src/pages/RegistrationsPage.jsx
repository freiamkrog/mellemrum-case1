import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { getRegistrations } from "../services/supabaseClient";

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
    const eventTitle = registration.eventTitle;

    if (!groups[eventTitle]) {
      groups[eventTitle] = [];
    }

    groups[eventTitle].push(registration);

    return groups;
  }, {});

  const statusLabels = {
    Ny: "Afventer bekræftelse",
    Bekræftet: "Bekræftet",
  };

  return (
    <>
      <header className="admin-header">
        <p className="eyebrow">Internt overblik</p>
        <h1>Tilmeldinger</h1>
        <p>{registrationCount} tilmeldinger i alt</p>
      </header>

      <main>
        <div className="registration-list">
          {loading && (
            <p className="message" role="status">
              Henter tilmeldinger...
            </p>
          )}

          {error && (
            <p className="message" role="alert">
              {error}
            </p>
          )}

          {!loading && !error && registrations.length === 0 && (
            <p className="message">Der er endnu ingen tilmeldinger.</p>
          )}

          {!loading &&
            !error &&
            Object.entries(registrationsByEvent).map(
              ([eventTitle, eventRegistrations]) => (
                <section className="registration-group" key={eventTitle}>
                  <div className="registration-group-header">
                    <h2>{eventTitle}</h2>
                    <p>{eventRegistrations.length} tilmeldinger</p>
                  </div>

                  <div className="registration-row registration-labels">
                    <span>Navn</span>
                    <span>E-mail</span>
                    <span>Dato</span>
                    <span>Status</span>
                  </div>

                  {eventRegistrations.map((registration) => (
                    <div className="registration-row" key={registration.id}>
                      <div>
                        <strong>{registration.name}</strong>
                      </div>

                      <span>{registration.email}</span>

                      <span>
                        {new Date(registration.eventDate).toLocaleDateString(
                          "da-DK",
                        )}
                      </span>

                      <span
                        className={`status ${
                          registration.status === "Ny"
                            ? "status-pending"
                            : "status-confirmed"
                        }`}
                      >
                        {statusLabels[registration.status] ||
                          registration.status}
                      </span>
                    </div>
                  ))}
                </section>
              ),
            )}
        </div>
      </main>

      <Footer />
    </>
  );
}
