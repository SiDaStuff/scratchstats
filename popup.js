(async function() {
    'use strict';
  
    async function openScratchStats() {
      try {
        const response = await fetch('https://api.scratch.mit.edu/health');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
  
        const htmlContent = generateHtmlContent(data);
  
        document.getElementById('stats-content').innerHTML = htmlContent;
  
        // Refresh every second
        setInterval(async () => {
          try {
            const response = await fetch('https://api.scratch.mit.edu/health');
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const updatedData = await response.json();
            const updatedHtmlContent = generateHtmlContent(updatedData);
            document.getElementById('stats-content').innerHTML = updatedHtmlContent;
          } catch (error) {
            console.error('Fetch error:', error);
          }
        }, 1000);
  
      } catch (error) {
        console.error('Fetch error:', error);
        document.getElementById('stats-content').innerText = 'Unable to fetch ScratchStats data.';
      }
    }
  
    // Function to generate the HTML content from the data
    function generateHtmlContent(data) {
      const version = data.version || 'Unknown';
      const uptime = data.uptime ? data.uptime.toFixed(2) : 'N/A';
      const load = Array.isArray(data.load) ? data.load.join(', ') : 'N/A';
      const timestamp = data.timestamp ? new Date(data.timestamp).toLocaleString() : 'N/A';
      const cacheConnected = data.cache?.connected ?? 'N/A';
      const cacheReady = data.cache?.ready ?? 'N/A';
  
      return `
        <div style="text-align: left;">
          <p><strong>Version:</strong> ${version}</p>
          <p><strong>Uptime:</strong> ${uptime} seconds</p>
          <p><strong>Load:</strong> ${load}</p>
          <p><strong>SQL:</strong></p>
          <ul>
            ${Object.keys(data.sql || {}).map(key => `
              <li><strong>${key}:</strong>
                <ul>
                  <li><strong>Primary:</strong>
                    <ul>
                      <li>SSL: ${data.sql[key].primary.ssl ?? 'N/A'}</li>
                      <li>Destroyed: ${data.sql[key].primary.destroyed ?? 'N/A'}</li>
                      <li>Min: ${data.sql[key].primary.min ?? 'N/A'}</li>
                      <li>Max: ${data.sql[key].primary.max ?? 'N/A'}</li>
                      <li>NumUsed: ${data.sql[key].primary.numUsed ?? 'N/A'}</li>
                      <li>NumFree: ${data.sql[key].primary.numFree ?? 'N/A'}</li>
                      <li>PendingAcquires: ${data.sql[key].primary.pendingAcquires ?? 'N/A'}</li>
                      <li>PendingCreates: ${data.sql[key].primary.pendingCreates ?? 'N/A'}</li>
                    </ul>
                  </li>
                  <li><strong>Replica:</strong>
                    <ul>
                      <li>SSL: ${data.sql[key].replica.ssl ?? 'N/A'}</li>
                      <li>Destroyed: ${data.sql[key].replica.destroyed ?? 'N/A'}</li>
                      <li>Min: ${data.sql[key].replica.min ?? 'N/A'}</li>
                      <li>Max: ${data.sql[key].replica.max ?? 'N/A'}</li>
                      <li>NumUsed: ${data.sql[key].replica.numUsed ?? 'N/A'}</li>
                      <li>NumFree: ${data.sql[key].replica.numFree ?? 'N/A'}</li>
                      <li>PendingAcquires: ${data.sql[key].replica.pendingAcquires ?? 'N/A'}</li>
                      <li>PendingCreates: ${data.sql[key].replica.pendingCreates ?? 'N/A'}</li>
                    </ul>
                  </li>
                </ul>
              </li>
            `).join('')}
          </ul>
          <p><strong>Timestamp:</strong> ${timestamp}</p>
          <p><strong>Cache:</strong></p>
          <ul>
            <li>Connected: ${cacheConnected}</li>
            <li>Ready: ${cacheReady}</li>
          </ul>
        </div>
      `;
    }
  
    // Open the ScratchStats window when the popup is loaded
    document.addEventListener('DOMContentLoaded', openScratchStats);
  
  })();
  