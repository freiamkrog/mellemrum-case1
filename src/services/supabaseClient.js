const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json",
};

export async function getEvents() {
  const response = await fetch(`${SUPABASE_URL}/events?order=date.asc`, {
    headers,
  });

  const data = await response.json();

  return data;
}

export async function getEvent(eventId) {
  const response = await fetch(`${SUPABASE_URL}/events?id=eq.${eventId}`, {
    headers,
  });

  const data = await response.json();

  return data[0];
}

export async function getRegistrations() {
  const response = await fetch(
    `${SUPABASE_URL}/registrations?order=createdAt.desc`,
    { headers },
  );

  const data = await response.json();

  return data;
}

export async function createRegistration(registration) {
  const existingResponse = await fetch(
    `${SUPABASE_URL}/registrations?email=eq.${encodeURIComponent(
      registration.email,
    )}&eventTitle=eq.${encodeURIComponent(registration.eventTitle)}`,
    {
      headers,
    },
  );

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