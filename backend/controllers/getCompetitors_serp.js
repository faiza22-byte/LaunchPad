import axios from "axios";

/**
 * Controller: Get competitors using SerpAPI
 * Expects: req.query.keyword
 */
export const getCompetitors = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "Keyword is required",
      });
    }

    const response = await axios.get("https://serpapi.com/search", {
      params: {
        q: keyword,
        api_key: process.env.SERP_API_KEY,
        engine: "google",
      },
    });

    const organicResults = response.data?.organic_results || [];

    // Extract competitor data
    const competitors = organicResults.map((item) => ({
      title: item.title,
      link: item.link,
      domain: item.displayed_link,
      snippet: item.snippet,
    }));

    return res.status(200).json({
      success: true,
      keyword,
      competitors,
    });

  } catch (error) {
    console.error("Competitor fetch error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch competitors",
      error: error.message,
    });
  }
};