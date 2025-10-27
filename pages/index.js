// pages/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/globals.css'; // Importing CSS

function StatusDisplay() {
  const [status, setStatus] = useState({ 
      online: false, 
      loading: true, 
      players: { online: 0, max: 0 }, 
      motd: 'Fetching server data...' 
  });

  const refreshStatus = async () => {
    try {
      const res = await fetch("/api/status");
      const data = await res.json();

      if (data.online) {
        setStatus({
          online: true,
          loading: false,
          players: data.players,
          motd: data.motd?.clean?.join(' ') || 'The Bollucks SMP - A great place to play!'
        });
      } else {
        setStatus({
          online: false,
          loading: false,
          players: { online: 0, max: 0 },
          motd: data.error || 'Server is currently offline. Use the renewal tool below to start it!'
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setStatus(prev => ({ 
          ...prev, 
          online: false, 
          loading: false, 
          motd: 'Failed to connect to status API.' 
      }));
    }
  };

  useEffect(() => {
    refreshStatus();
    // Refresh status every 15 seconds
    const intervalId = setInterval(refreshStatus, 15000); 
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId); 
  }, []);

  const statusClass = status.online ? 'online' : 'offline';
  const statusText = status.loading ? 'Loading...' : status.online ? 'Online' : 'Offline';

  return (
    <div className="container">
      <Head>
        <title>👑 Bollucks SMP - Server Status</title>
        <meta name="description" content="Official website for the Bollucks SMP Minecraft Bedrock server." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <h1>💎 BOLLUCKS SMP</h1>
        <p className="slogan">The premier Bedrock Survival Multiplayer Experience.</p>
      </header>

      {/* Server Status Card */}
      <div className="card">
        <h2>Server Status</h2>
        <p className={`status-indicator ${statusClass}`}>
          {status.loading ? '⏳' : status.online ? '🟢' : '🔴'} {statusText}
        </p>

        <div className="info-grid">
            <div className="info-item">
                <h3>IP Address</h3>
                <p>65.108.224.31</p>
            </div>
            <div className="info-item">
                <h3>Port</h3>
                <p>19490</p>
            </div>
            <div className="info-item">
                <h3>Players</h3>
                <p>{status.players.online}/{status.players.max}</p>
            </div>
        </div>
        
        <p style={{ marginTop: '20px', fontWeight: 'bold' }}>MOTD:</p>
        <p id="motd" style={{ fontStyle: 'italic' }}>{status.motd}</p>
      </div>
      
      {/* Server Renewal Embed Section */}
      <div className="card renewal-section">
        <h2>🚀 Renew & Start Server</h2>
        <p>Use the tool below to renew the server time or start it up if it's offline.</p>
        <iframe 
            className="renewal-iframe"
            src="https://game4free.net/josh"
            title="Bollucks SMP Server Renewal"
            frameBorder="0"
            allowFullScreen
        ></iframe>
      </div>

      <footer>
        <p>&copy; {new Date().getFullYear()} Bollucks SMP. Powered by Vercel.</p>
      </footer>
    </div>
  );
}

export default StatusDisplay;
