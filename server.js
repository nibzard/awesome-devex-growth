const express = require('express');
const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');
const { WebSocketServer } = require('ws');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { saveHTML } = require('./generate-html');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'", "data:", "https:"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            scriptSrc: ["'self'", "'unsafe-inline'"]
        }
    }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Compression and logging
app.use(compression());
app.use(morgan('combined'));

// Static file serving
app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// API endpoints
app.get('/api/stats', (req, res) => {
    try {
        if (fs.existsSync('./dist/stats.json')) {
            const stats = JSON.parse(fs.readFileSync('./dist/stats.json', 'utf8'));
            res.json(stats);
        } else {
            res.status(404).json({ error: 'Stats not generated yet' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to load stats' });
    }
});

app.get('/api/data', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync('./devex-growth.json', 'utf8'));
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load data' });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Main route - serve the generated HTML
app.get('/', (req, res) => {
    const htmlPath = path.join(__dirname, 'dist', 'index.html');
    
    if (fs.existsSync(htmlPath)) {
        res.sendFile(htmlPath);
    } else {
        res.status(404).send(`
            <html>
                <head>
                    <title>DevEx Growth - Building...</title>
                    <style>
                        body { 
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                            background: #f8fafc;
                            color: #334155;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                            margin: 0;
                        }
                        .container { text-align: center; }
                        .spinner {
                            border: 4px solid #e2e8f0;
                            border-top: 4px solid #3b82f6;
                            border-radius: 50%;
                            width: 40px;
                            height: 40px;
                            animation: spin 1s linear infinite;
                            margin: 0 auto 1rem;
                        }
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    </style>
                    <script>
                        setTimeout(() => location.reload(), 2000);
                    </script>
                </head>
                <body>
                    <div class="container">
                        <div class="spinner"></div>
                        <h2>Building DevEx Growth Directory...</h2>
                        <p>HTML is being generated. This page will refresh automatically.</p>
                    </div>
                </body>
            </html>
        `);
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`🚀 DevEx Growth server running at http://localhost:${PORT}`);
    console.log(`📊 API endpoints:`);
    console.log(`   • GET /api/stats - Statistics`);
    console.log(`   • GET /api/data - Raw data`);
    console.log(`   • GET /health - Health check`);
    
    // Initial build
    console.log('🔨 Generating initial HTML...');
    saveHTML().catch(console.error);
});

// WebSocket server for hot reload
const wss = new WebSocketServer({ port: 3001 });
let wsClients = [];

wss.on('connection', (ws) => {
    console.log('📡 Client connected for hot reload');
    wsClients.push(ws);
    
    ws.on('close', () => {
        wsClients = wsClients.filter(client => client !== ws);
        console.log('📡 Client disconnected');
    });
});

function broadcastReload() {
    wsClients.forEach(client => {
        if (client.readyState === 1) { // WebSocket.OPEN
            client.send(JSON.stringify({ type: 'reload' }));
        }
    });
    console.log(`📡 Sent reload signal to ${wsClients.length} clients`);
}

// File watching for hot reload
const watcher = chokidar.watch([
    './devex-growth.json',
    './template.js',
    './generate-html.js',
    './generate-readme.js'
], {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
});

let isRebuilding = false;

watcher.on('change', async (filePath) => {
    if (isRebuilding) return;
    
    console.log(`📝 File changed: ${filePath}`);
    
    isRebuilding = true;
    
    try {
        console.log('🔨 Rebuilding HTML...');
        await saveHTML();
        
        console.log('🔨 Regenerating README...');
        const { spawn } = require('child_process');
        const readmeProcess = spawn('node', ['generate-readme.js'], { stdio: 'inherit' });
        
        readmeProcess.on('close', (code) => {
            if (code === 0) {
                console.log('✅ Hot reload: All files updated');
                broadcastReload();
            } else {
                console.error('❌ Error regenerating README');
            }
            isRebuilding = false;
        });
        
    } catch (error) {
        console.error('❌ Hot reload error:', error);
        isRebuilding = false;
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully');
    watcher.close();
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('🛑 Received SIGINT, shutting down gracefully');
    watcher.close();
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

console.log('👀 Watching for changes...');
console.log('🔄 Hot reload available at ws://localhost:3001');