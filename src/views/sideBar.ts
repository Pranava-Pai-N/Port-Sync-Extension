import * as vscode from 'vscode';

export class SidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'PortSync.sideBar';

  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = { enableScripts: true };

    webviewView.webview.html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      :root {
        --font-family: var(--vscode-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif);
      }
      
      body {
        font-family: var(--font-family);
        color: var(--vscode-sideBar-foreground, var(--vscode-foreground));
        padding: 12px;
        margin: 0;
        background-color: var(--vscode-sideBar-background);
        user-select: none;
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--vscode-sideBar-border, #444);
      }

      .header h3 {
        margin: 0;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--vscode-descriptionForeground);
      }

      .refresh-btn {
        background: transparent;
        border: none;
        color: var(--vscode-icon-foreground);
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .refresh-btn:hover {
        background-color: var(--vscode-toolbar-hoverBackground);
      }

      .services-container {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .service-card {
        background-color: var(--vscode-welcomePage-tileBackground, rgba(255, 255, 255, 0.03));
        border: 1px solid var(--vscode-widget-border, transparent);
        border-radius: 6px;
        padding: 10px 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: border-color 0.2s ease, background-color 0.2s ease;
      }

      .service-card:hover {
        border-color: var(--vscode-focusBorder);
        background-color: var(--vscode-list-hoverBackground);
      }

      .service-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .service-name {
        font-size: 13px;
        font-weight: 600;
        color: var(--vscode-foreground);
      }

      .service-port {
        font-family: var(--vscode-editor-font-family, monospace);
        font-size: 11px;
        color: var(--vscode-descriptionForeground);
      }

      .status-badge {
        font-size: 11px;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 12px;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }

      .status-badge.active {
        background-color: rgba(73, 156, 112, 0.15);
        color: #499c70;
        border: 1px solid rgba(73, 156, 112, 0.25);
      }

      .status-badge.inactive {
        background-color: rgba(241, 76, 76, 0.1);
        color: #f14c4c;
        border: 1px solid rgba(241, 76, 76, 0.2);
      }

      .status-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        display: inline-block;
      }

      .status-badge.active .status-dot {
        background-color: #499c70;
        box-shadow: 0 0 6px #499c70;
      }

      .status-badge.inactive .status-dot {
        background-color: #f14c4c;
      }

      .empty-state {
        font-size: 12px;
        color: var(--vscode-descriptionForeground);
        text-align: center;
        margin-top: 24px;
        font-style: italic;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <h3>Port Sync - Monitor Active Ports at ease</h3>
      <button class="refresh-btn" id="refresh" title="Scan Ports Now">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <path d="M13.6 2.3C12.2.9 10.2 0 8 0 3.6 0 0 3.6 0 8s3.6 8 8 8c3.7 0 6.8-2.5 7.7-6h-2.1c-.8 2.3-3 4-5.6 4-3.3 0-6-2.7-6-6s2.7-6 6-6c1.7 0 3.1.7 4.2 1.8L10 6h6V0l-2.4 2.3z"/>
        </svg>
      </button>
    </div>
    
    <div id="services-list" class="services-container">
      <div class="empty-state">Scanning workspace folders ...</div>
    </div>

    <script>
      const vscode = acquireVsCodeApi();

      document.getElementById('refresh').addEventListener('click', () => {
        vscode.postMessage({ command: 'triggerRefresh' });
      });

      window.addEventListener('message', event => {
        const services = event.data;
        const container = document.getElementById('services-list');
        
        if (!services || services.length === 0) {
          container.innerHTML = '<div class="empty-state">No active development ports detected.</div>';
          return;
        }

        container.innerHTML = services.map(s => {

        const isActive = s.status === 'Active';
          const badgeClass = isActive ? 'active' : 'inactive';
          
          return \`
            <div class="service-card">
              <div class="service-info">
                <span class="service-name">\${s.name}</span>
                <span class="service-port">localhost:\${s.port}</span>
              </div>
              <div class="status-badge \${badgeClass}">
                <span class="status-dot"></span>
                \${s.status}
              </div>
            </div>
          \`;
        }).join('');
      });
    </script>
  </body>
  </html>
`;
  }
}