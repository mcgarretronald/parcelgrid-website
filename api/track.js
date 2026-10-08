export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Accept, Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const raw =
      (typeof req.query?.tracking === "string" && req.query.tracking) ||
      (typeof req.query?.trackingNo === "string" && req.query.trackingNo) ||
      "";

    // Support /api/track/:id style paths when the host rewrites them.
    const pathTail = String(req.url || "")
      .split("?")[0]
      .replace(/^\/api\/track\/?/i, "")
      .replace(/^\/+/g, "");

    const trackingNo = decodeURIComponent(raw || pathTail || "").trim();
    if (!trackingNo) {
      return res.status(400).json({ error: "Tracking number is required" });
    }

    const apiUrl = `https://app.escrowcourier.com/order-services/api/track/${encodeURIComponent(trackingNo)}`;
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Origin: "https://escrowcourier.com",
      },
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(502).json({
        error: "Invalid response from tracking service",
        status: response.status,
      });
    }

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      message: error?.message || "Unknown error",
    });
  }
}
