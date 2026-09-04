const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json",
};

export async function getEvents() {
  const response = await fetch(
    `${SUPABASE_URL}/events?select=*,venues(*),registrations(count)&order=date.asc`,
    {
      headers,
    },
  );

  if (!response.ok) {
    throw new Error("Kunne ikke hente events.");
  }

  const data = await response.json();

  return data;
}

export async function getEvent(eventId) {
  const response = await fetch(
    `${SUPABASE_URL}/events?id=eq.${eventId}&select=*,venues!events_venue_id_fkey(*),registrations(count)`,
    {
      headers,
    },
  );

  if (!response.ok) {
    throw new Error("Kunne ikke hente event.");
  }

  const data = await response.json();

  return data[0];
}

export async function getRegistrations() {
  const response = await fetch(
    `${SUPABASE_URL}/registrations?select=id,name,email,status,createdAt,events(id,title,date,capacity)&order=createdAt.desc`,
    {
      headers,
    },
  );

  if (!response.ok) {
    throw new Error("Kunne ikke hente tilmeldinger.");
  }

  const data = await response.json();

  return data;
}

export async function createRegistration(registration) {
  const existingResponse = await fetch(
    `${SUPABASE_URL}/registrations?email=eq.${encodeURIComponent(
      registration.email,
    )}&event_id=eq.${registration.event_id}`,
    {
      headers,
    },
  );

  if (!existingResponse.ok) {
    throw new Error("Kunne ikke kontrollere eksisterende tilmelding.");
  }

  const existingRegistrations = await existingResponse.json();

  if (existingRegistrations.length > 0) {
    throw new Error("Denne mail er allerede tilmeldt dette event.");
  }

  const response = await fetch(`${SUPABASE_URL}/registrations`, {
    method: "POST",
    headers,
    body: JSON.stringify(registration),
  });

  if (!response.ok) {
    throw new Error("Kunne ikke oprette tilmelding.");
  }

  return true;
}
