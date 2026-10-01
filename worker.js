const ALLOWED_HOSTS = [
  "example.com"
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders()
    }
  });
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders()
      });
    }

    const url = new URL(request.url);

    if (url.pathname !== "/api/download") {
      return json({ error: "Not found." }, 404);
    }

    if (request.method !== "POST") {
      return json({ error: "POST required." }, 405);
    }

    try {
      const body = await request.json();
      const mediaUrl = String(body.mediaUrl || "").trim();

      if (!mediaUrl) {
        return json({ error: "Media URL is required." }, 400);
      }

      const media = new URL(mediaUrl);

      if (!["http:", "https:"].includes(media.protocol)) {
        return json({ error: "Invalid media URL." }, 400);
      }

      if (!ALLOWED_HOSTS.includes(media.hostname)) {
        return json({
          error: "This media source is not supported."
        }, 403);
      }

      const response = await fetch(mediaUrl);

      if (!response.ok) {
        return json({
          error: "Media could not be fetched."
        }, 502);
      }

      const contentLength = Number(
        response.headers.get("content-length") || 0
      );

      if (contentLength > MAX_FILE_SIZE) {
        return json({
          error: "File is too large."
        }, 413);
      }

      const headers = new Headers(response.headers);

      headers.set(
        "Content-Disposition",
        'attachment; filename="download.mp4"'
      );

      headers.set("Access-Control-Allow-Origin", "*");

      return new Response(response.body, {
        status: 200,
        headers
      });

    } catch (error) {
      return json({
        error: "Invalid request."
      }, 400);
    }
  }
};
