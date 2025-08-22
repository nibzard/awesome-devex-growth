const playwright = require('playwright');
const fs = require('fs');
const path = require('path');
const { imageToDataURL } = require('./generate-html');

// Simple template for social image generation
function generateSocialImageHTML(data) {
    const { title, metadata, categories, impact_levels } = data;
    const totalCompanies = categories.reduce((total, cat) => total + cat.companies.length, 0);
    
    // Get some featured companies for the image
    const featuredCompanies = categories.flatMap(cat => cat.companies)
        .filter(c => c.impact === 'proven')
        .slice(0, 6);

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                width: 1200px;
                height: 630px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                font-family: 'Inter', sans-serif;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                overflow: hidden;
            }
            
            .background-pattern {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                opacity: 0.1;
                background-image: 
                    radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 2px, transparent 2px),
                    radial-gradient(circle at 75% 75%, rgba(255,255,255,0.2) 2px, transparent 2px);
                background-size: 50px 50px;
            }
            
            .container {
                text-align: center;
                z-index: 2;
                max-width: 1000px;
                padding: 3rem;
            }
            
            .badge {
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 50px;
                padding: 0.5rem 1.5rem;
                font-size: 0.875rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                margin-bottom: 2rem;
                display: inline-block;
            }
            
            .title {
                font-family: 'JetBrains Mono', monospace;
                font-size: 4rem;
                font-weight: 900;
                line-height: 1.1;
                margin-bottom: 1.5rem;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            
            .subtitle {
                font-size: 1.5rem;
                opacity: 0.9;
                margin-bottom: 3rem;
                line-height: 1.4;
                max-width: 800px;
                margin-left: auto;
                margin-right: auto;
            }
            
            .stats {
                display: flex;
                justify-content: center;
                gap: 3rem;
                margin-bottom: 2rem;
            }
            
            .stat {
                text-align: center;
            }
            
            .stat-number {
                font-family: 'JetBrains Mono', monospace;
                font-size: 3rem;
                font-weight: 700;
                line-height: 1;
                display: block;
                margin-bottom: 0.5rem;
            }
            
            .stat-label {
                font-size: 1rem;
                opacity: 0.8;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                font-weight: 600;
            }
            
            .featured-companies {
                display: flex;
                justify-content: center;
                gap: 1.5rem;
                flex-wrap: wrap;
                margin-top: 2rem;
            }
            
            .company-logo {
                width: 60px;
                height: 60px;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.3);
            }
            
            .company-logo img {
                width: 40px;
                height: 40px;
                object-fit: contain;
            }
            
            .footer {
                position: absolute;
                bottom: 2rem;
                left: 0;
                right: 0;
                text-align: center;
                font-size: 0.875rem;
                opacity: 0.7;
            }
        </style>
    </head>
    <body>
        <div class="background-pattern"></div>
        
        <div class="container">
            <div class="badge">Developer Experience Growth</div>
            
            <h1 class="title">${title.heading}</h1>
            
            <p class="subtitle">Tools and practices that demonstrably drive business growth through exceptional developer experience</p>
            
            <div class="stats">
                <div class="stat">
                    <span class="stat-number">${totalCompanies}</span>
                    <span class="stat-label">Companies</span>
                </div>
                <div class="stat">
                    <span class="stat-number">${categories.length}</span>
                    <span class="stat-label">Categories</span>
                </div>
                <div class="stat">
                    <span class="stat-number">${featuredCompanies.length}</span>
                    <span class="stat-label">Proven Impact</span>
                </div>
            </div>
            
            <div class="featured-companies">
                ${featuredCompanies.map(company => `
                    <div class="company-logo">
                        <img src="${company.logo}" alt="${company.name}" onerror="this.style.display='none'">
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="footer">
            github.com/nikola/awesome-devex-growth
        </div>
    </body>
    </html>`;
}

async function generateImage() {
    let browser;
    try {
        console.log('📖 Reading devex-growth.json...');
        
        // Read and parse the JSON file
        const data = JSON.parse(fs.readFileSync('./devex-growth.json', 'utf8'));

        console.log('🖼️  Processing company logos for social image...');
        
        // Process the data while preserving the company object structure
        const processedData = {
            ...data,
            categories: data.categories.map(category => ({
                ...category,
                companies: category.companies.map(company => ({
                    ...company,
                    logo: imageToDataURL(company.logo)
                }))
            }))
        };

        console.log('🎨 Generating social image HTML...');
        
        // Generate HTML content for social image
        const html = generateSocialImageHTML(processedData);

        console.log('🚀 Launching browser...');
        
        // Launch browser with enhanced settings
        browser = await playwright.chromium.launch({
            args: ['--disable-web-security', '--no-sandbox'],
            timeout: 60000
        });

        // Create context with specific viewport and scale settings
        const context = await browser.newContext({
            viewport: { width: 1200, height: 630 },
            deviceScaleFactor: 2 // Higher resolution
        });

        const page = await context.newPage();

        // Add console logging for debugging
        page.on('console', msg => console.log('Browser console:', msg.text()));
        page.on('pageerror', err => console.error('Browser error:', err));

        // Set content with networkidle wait
        await page.setContent(html, {
            waitUntil: 'networkidle',
            timeout: 30000
        });

        console.log('📸 Capturing screenshot...');
        
        // Ensure dist directory exists
        if (!fs.existsSync('./dist')) {
            fs.mkdirSync('./dist', { recursive: true });
        }

        // Take screenshot
        await page.screenshot({
            path: './dist/devex-growth-social.png',
            type: 'png',
            fullPage: false
        });

        console.log('✅ Social image generated successfully!');
        console.log('📄 Output: ./dist/devex-growth-social.png');
        
        // Also generate a smaller version for different uses
        await page.screenshot({
            path: './dist/devex-growth-preview.png',
            type: 'png',
            fullPage: false,
            clip: { x: 0, y: 0, width: 600, height: 315 } // Twitter card size
        });
        
        console.log('📄 Preview image: ./dist/devex-growth-preview.png');

    } catch (error) {
        console.error('❌ Error generating social image:', error);
        process.exit(1);
    } finally {
        if (browser) {
            await browser.close();
            console.log('🔒 Browser closed');
        }
    }
}

// Run if this file is executed directly
if (require.main === module) {
    generateImage();
}

module.exports = { generateImage };