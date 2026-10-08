export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Accept, Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  }
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const forwardedFor = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();

    // No Origin header — customer-support-service CORS treats missing Origin as server-to-server.
    const response = await fetch("https://app.escrowcourier.com/customer-support/api/contact", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: body.fullName,
        phone: body.phone,
        senderType: body.senderType,
        message: body.message,
        website: body.website,
        sourcePage: body.sourcePage,
        clientIp: forwardedFor || undefined,
      }),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(502).json({ success: false, message: "Invalid response from contact API" });
    }
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message || "Unknown error" });
  }
}
