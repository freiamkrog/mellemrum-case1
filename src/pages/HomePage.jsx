import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import EventCard from "../components/EventCard";
import { getEvents } from "../services/supabaseClient";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Alle");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        setError("");

        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error(error);
        setError("Vi kunne ikke hente events. Prøv igen senere.");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  const categories = [
    "Alle",
    ...new Set(events.map((event) => event.category)),
  ];

  const filteredEvents = events.filter((event) => {
    const searchText =
      `${event.title} ${event.summary} ${event.venueName}`.toLowerCase();
    const matchesSearch = searchText.includes(search.toLowerCase());
    const matchesCategory = category === "Alle" || event.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <header className={styles.hero}>
        <p className="eyebrow">Kultur i Aarhus</p>
        <h1>Find plads til noget nyt.</h1>
        <p className={styles.heroCopy}>
          Koncerter, talks og workshops samlet ét sted. Find dit næste event, og
          tilmeld dig på få minutter.
        </p>
        <a className={styles.heroLink} href="#events">
          Se kommende events ↓
        </a>
      </header>

      <main id="events">
        <section className={styles.sectionHeading}>
          <div>
            <p className="eyebrow dark">Det sker</p>
            <h2>Kommende events</h2>
          </div>
          <p>Kuraterede oplevelser i byen – fra små scener til store idéer.</p>
        </section>

        <section className={styles.filters}>
          <label>
            Søg
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Søg efter titel eller sted"
            />
          </label>

          <label>
            Kategori
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </section>

        {loading && (
          <p className="message" role="status">
            Henter kommende events...
          </p>
        )}

        {error && (
          <p className="message" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && filteredEvents.length === 0 && (
          <p className="message">
            Vi fandt ingen events, der matcher din søgning.
          </p>
        )}

        {!loading && !error && filteredEvents.length > 0 && (
          <section className={styles.eventGrid}>
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
