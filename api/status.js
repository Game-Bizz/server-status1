// /api/status.js
export default async function handler(req, res) {
  try {
    const response = await fetch('https://api.mcsrvstat.us/2/play.childsmp.net');
    const data = await response.json();
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ online: false, error: err.message });
  }
}
