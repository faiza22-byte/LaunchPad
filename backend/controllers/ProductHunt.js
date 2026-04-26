import fetch from "node-fetch";

const MOZ_TOKEN ="bW96c2NhcGUtSlpDNFBUNjYwSDpWUGpaMmM2emplcVE5Q1ZxWGpCdVl5TVF3S0xiZG9vOA==";
const SERPAPI_KEY ="1c4dec1cf398449ac1ef0dcb3a393927f8a2fa4627c347f7309a9a8dc69ca880";

if (!MOZ_TOKEN || !SERPAPI_KEY) {
  console.error("Please set MOZ_API_KEY and SERPAPI_KEY in environment variables.");
  process.exit(1);
}

// -----------------------------
// Helper: Extract domain name
// -----------------------------
function extractName(url) {
  const domain = new URL(url).hostname;
  return domain.replace("www.", "").split(".")[0];
}

// -----------------------------
// Moz API: Fetch SEO Metrics (v2 POST)
// -----------------------------
async function fetchMozData(url) {
  try {
    const endpoint = "https://lsapi.seomoz.com/v2/url_metrics";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${MOZ_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ targets: [url] }),
    });

    if (!res.ok) {
      console.error("Moz API error:", await res.text());
      return null;
    }

    const data = await res.json();
    const metrics = data.results[0];

    return {
      domainAuthority: metrics.domain_authority || null,
      pageAuthority: metrics.page_authority || null,
      spamScore: metrics.spam_score || null,
      backlinksCount: metrics.links || null,
      mozRank: metrics.moz_rank || null,
    };
  } catch (err) {
    console.error("Moz fetch error:", err.message);
    return null;
  }
}

// -----------------------------
// SerpApi: Fetch Reviews
// -----------------------------
async function fetchReviewsSerpapi(competitorName) {
  try {
    // Search "<competitor> reviews" on Google
    const url = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(
      competitorName + " reviews"
    )}&api_key=${SERPAPI_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    // Extract top 5 snippets from organic search results
    if (!data.organic_results) return null;

    const reviews = data.organic_results
      .slice(0, 5)
      .map(r => r.snippet)
      .filter(Boolean);

    return reviews.length ? reviews : null;
  } catch (err) {
    console.error("SerpApi fetch error:", err.message);
    return null;
  }
}

// -----------------------------
// Controller
// -----------------------------
export const getCompetitorDashboard = async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: "Missing 'url' query parameter" });

  const competitorName = extractName(url);

  try {
    const [seoData, reviews] = await Promise.all([
      fetchMozData(url),
      fetchReviewsSerpapi(competitorName),
    ]);

    return res.json({
      competitor: competitorName,
      url,
      seoData,
      reviews, // top 5 reviews from SerpApi
    });
  } catch (err) {
    console.error("Controller error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};