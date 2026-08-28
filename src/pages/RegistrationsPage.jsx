import { useEffect, useState } from "react";
import { Link } from "react-router";
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

  return (
    <>
      <header className="admin-header">
        <p className="eyebrow">Internt overblik</p>
        <h1>Tilmeldinger</h1>
        <p>{registrationCount} tilmeldinger i alt</p>
      </header>
      <main>
        <div className="registration-list">
          <div className="registration-row registration-labels">
            <span>Navn</span>
            <span>Event</span>
            <span>Dato</span>
            <span>Status</span>
          </div>
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
            registrations.length > 0 &&
            registrations.map((registration) => (
              <div className="registration-row" key={registration.id}>
                <div>
                  <strong>{registration.name}</strong>
                  <small>{registration.email}</small>
                </div>
                <span>{registration.eventTitle}</span>
                <span>
                  {new Date(registration.eventDate).toLocaleDateString("da-DK")}
                </span>
                <span className="status">{registration.status}</span>
              </div>
            ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
