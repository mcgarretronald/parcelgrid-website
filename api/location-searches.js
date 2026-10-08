export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Accept, Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const searchQuery = String(body.searchQuery || "").trim();
    if (!searchQuery) {
      return res.status(400).json({ error: "searchQuery is required" });
    }

    const apiUrl = "https://app.escrowcourier.com/location-service/api/location-searches";
    // No Origin header — location-service CORS treats missing Origin as allowed
    // (service-to-service), same as user-service agent search miss logging.
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        searchQuery,
        notFound: Boolean(body.notFound),
        town: body.town,
        county: body.county,
        constituency: body.constituency,
        address: body.address,
        metadata: body.metadata || {},
      }),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(502).json({ error: "Invalid response from location-searches API" });
    }

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      message: error?.message || "Unknown error",
    });
  }
}
