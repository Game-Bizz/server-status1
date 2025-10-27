// pages/api/status.js

export default async function handler(req, res) {
  // Define the target API URL for the Bedrock server
  const API_URL = 'https://api.mcsrvstat.us/bedrock/3/65.108.224.31:19490';

  try {
    const response = await fetch(API_URL);
    
    // Check for non-200 status codes from the external API
    if (!response.ok) {
        throw new Error(`External API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Vercel/Next.js handles caching well, but this is a good practice for real-time data
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=5'); 
    
    // Respond with the server data
    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching server status:', err.message);
    // Respond with an offline status and the error for debugging
    res.status(200).json({ 
        online: false, 
        error: "Failed to fetch status.",
        details: err.message 
    });
  }
