const fs = require('fs');
const path = require('path');
const generateHTML = require('./template');

function imageToDataURL(imagePath) {
    if (!imagePath) return '';
    try {
        const resolvedPath = path.resolve(__dirname, imagePath);
        if (!fs.existsSync(resolvedPath)) {
            console.warn(`⚠️  Image not found: ${imagePath}`);
            return '';
        }
        
        const imageBuffer = fs.readFileSync(resolvedPath);
        const imageExt = path.extname(imagePath).substring(1).toLowerCase();

        // Special handling for SVG files
        if (imageExt === 'svg') {
            const svgString = imageBuffer.toString('utf8');
            // Clean up SVG for embedding
            const cleanSvg = svgString
                .replace(/<\?xml.*?\?>/, '')
                .replace(/<!DOCTYPE.*?>/, '')
                .replace(/[\r\n\t]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
            return `data:image/svg+xml;base64,${Buffer.from(cleanSvg).toString('base64')}`;
        }

        // For other image formats
        return `data:image/${imageExt};base64,${imageBuffer.toString('base64')}`;
    } catch (error) {
        console.error(`❌ Error loading image: ${imagePath}`, error.message);
        return '';
    }
}

async function saveHTML() {
    try {
        console.log('📖 Reading devex-growth.json...');
        
        // Read and parse the JSON file
        const data = JSON.parse(fs.readFileSync('./devex-growth.json', 'utf8'));

        console.log('🖼️  Processing company logos...');
        
        // Process the data and embed logos as base64 data URLs
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

        console.log('🎨 Generating HTML from template...');
        
        // Generate background image data URL if it exists
        const bgImageDataUrl = imageToDataURL('./public/bg.png');

        // Generate HTML content
        const html = generateHTML(processedData, bgImageDataUrl);

        // Ensure dist directory exists
        if (!fs.existsSync('./dist')) {
            fs.mkdirSync('./dist', { recursive: true });
        }

        // Save the HTML file
        fs.writeFileSync('./dist/index.html', html);
        
        console.log('✅ HTML generated successfully!');
        console.log(`📄 Output: ./dist/index.html`);
        console.log(`📊 Total companies: ${processedData.categories.reduce((total, cat) => total + cat.companies.length, 0)}`);
        console.log(`📂 Categories: ${processedData.categories.length}`);
        
        // Generate simple stats for reference
        const stats = {
            generated_at: new Date().toISOString(),
            total_companies: processedData.categories.reduce((total, cat) => total + cat.companies.length, 0),
            total_categories: processedData.categories.length,
            impact_breakdown: {
                proven: processedData.categories.flatMap(c => c.companies).filter(c => c.impact === 'proven').length,
                measured: processedData.categories.flatMap(c => c.companies).filter(c => c.impact === 'measured').length,
                favorite: processedData.categories.flatMap(c => c.companies).filter(c => c.impact === 'favorite').length
            },
            categories: processedData.categories.map(cat => ({
                name: cat.name,
                id: cat.id,
                company_count: cat.companies.length
            }))
        };
        
        fs.writeFileSync('./dist/stats.json', JSON.stringify(stats, null, 2));
        console.log('📈 Statistics generated: ./dist/stats.json');
        
    } catch (error) {
        console.error('❌ Error generating HTML:', error);
        process.exit(1);
    }
}

// Run if this file is executed directly
if (require.main === module) {
    saveHTML();
}

module.exports = { saveHTML, imageToDataURL };