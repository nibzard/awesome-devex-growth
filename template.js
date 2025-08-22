const generateHTML = (data, bgImageDataUrl = '') => {
    const { title, metadata, impact_levels, categories } = data;
    
    const generationDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Calculate total companies
    const totalCompanies = categories.reduce((total, category) => total + category.companies.length, 0);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title.heading} - Interactive Directory</title>
    <meta name="description" content="${title.subtitle}">
    <meta property="og:title" content="${title.heading}">
    <meta property="og:description" content="${title.subtitle}">
    <meta property="og:type" content="website">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --bg-color: #fafafa;
            --bg-secondary: #ffffff;
            --text-primary: #1a1a1a;
            --text-secondary: #666666;
            --text-tertiary: #999999;
            --border-color: #e5e5e5;
            --border-hover: #d1d1d1;
            --accent-color: #0066cc;
            --accent-light: #f0f7ff;
            
            /* Impact level colors */
            --proven-color: #059669;
            --proven-bg: #ecfdf5;
            --measured-color: #dc2626;
            --measured-bg: #fef2f2;
            --favorite-color: #7c3aed;
            --favorite-bg: #f3f4f6;
            
            /* Category colors */
            --cat-1: #3b82f6;
            --cat-2: #10b981;
            --cat-3: #f59e0b;
            --cat-4: #ef4444;
            --cat-5: #8b5cf6;
            --cat-6: #06b6d4;
            --cat-7: #f97316;
            
            /* Shadows */
            --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        }
        
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            background-color: var(--bg-color);
            color: var(--text-primary);
            margin: 0;
            padding: 0;
            line-height: 1.6;
            background-image: url('${bgImageDataUrl}');
            background-repeat: no-repeat;
            background-position: top right;
            background-size: 30% auto;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .header {
            text-align: center;
            margin-bottom: 3rem;
            padding: 3rem 0;
            background: linear-gradient(135deg, var(--accent-light) 0%, var(--bg-secondary) 100%);
            border-radius: 1rem;
            box-shadow: var(--shadow-md);
        }
        
        .header h1 {
            font-family: "JetBrains Mono", monospace;
            font-size: clamp(2rem, 5vw, 3.5rem);
            font-weight: 700;
            margin: 0;
            color: var(--text-primary);
            letter-spacing: -0.02em;
        }
        
        .header .subtitle {
            font-size: 1.25rem;
            color: var(--text-secondary);
            margin: 1rem 0;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .stats {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-top: 2rem;
            flex-wrap: wrap;
        }
        
        .stat {
            background: var(--bg-secondary);
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: var(--shadow-sm);
            border: 1px solid var(--border-color);
        }
        
        .stat-number {
            font-family: "JetBrains Mono", monospace;
            font-size: 2rem;
            font-weight: 700;
            color: var(--accent-color);
            display: block;
        }
        
        .stat-label {
            font-size: 0.875rem;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .filters {
            background: var(--bg-secondary);
            border-radius: 1rem;
            padding: 1.5rem;
            margin-bottom: 2rem;
            box-shadow: var(--shadow-md);
            border: 1px solid var(--border-color);
        }
        
        .filter-group {
            display: flex;
            gap: 1rem;
            align-items: center;
            margin-bottom: 1rem;
            flex-wrap: wrap;
        }
        
        .filter-group:last-child {
            margin-bottom: 0;
        }
        
        .filter-label {
            font-weight: 500;
            color: var(--text-primary);
            min-width: 100px;
        }
        
        .search-input {
            flex: 1;
            max-width: 400px;
            padding: 0.75rem 1rem;
            border: 2px solid var(--border-color);
            border-radius: 0.5rem;
            font-size: 1rem;
            transition: border-color 0.2s ease;
        }
        
        .search-input:focus {
            outline: none;
            border-color: var(--accent-color);
        }
        
        .filter-buttons {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }
        
        .filter-btn {
            padding: 0.5rem 1rem;
            border: 2px solid var(--border-color);
            background: var(--bg-secondary);
            border-radius: 2rem;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all 0.2s ease;
            font-weight: 500;
        }
        
        .filter-btn:hover {
            border-color: var(--border-hover);
            transform: translateY(-1px);
        }
        
        .filter-btn.active {
            background: var(--accent-color);
            color: white;
            border-color: var(--accent-color);
        }
        
        .categories {
            display: grid;
            gap: 2rem;
        }
        
        .category {
            background: var(--bg-secondary);
            border-radius: 1rem;
            padding: 2rem;
            box-shadow: var(--shadow-md);
            border: 1px solid var(--border-color);
            transition: all 0.3s ease;
        }
        
        .category:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
        }
        
        .category-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid var(--border-color);
        }
        
        .category-icon {
            width: 3rem;
            height: 3rem;
            border-radius: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            font-weight: 600;
            color: white;
        }
        
        .category:nth-child(1) .category-icon { background: var(--cat-1); }
        .category:nth-child(2) .category-icon { background: var(--cat-2); }
        .category:nth-child(3) .category-icon { background: var(--cat-3); }
        .category:nth-child(4) .category-icon { background: var(--cat-4); }
        .category:nth-child(5) .category-icon { background: var(--cat-5); }
        .category:nth-child(6) .category-icon { background: var(--cat-6); }
        .category:nth-child(7) .category-icon { background: var(--cat-7); }
        
        .category-title {
            font-family: "JetBrains Mono", monospace;
            font-size: 1.5rem;
            font-weight: 600;
            margin: 0;
        }
        
        .category-description {
            color: var(--text-secondary);
            margin: 0.5rem 0 0 0;
            font-size: 0.95rem;
        }
        
        .companies-grid {
            display: grid;
            gap: 1rem;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }
        
        .company-card {
            background: var(--bg-color);
            border: 2px solid var(--border-color);
            border-radius: 0.75rem;
            padding: 1.5rem;
            transition: all 0.2s ease;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        
        .company-card:hover {
            border-color: var(--accent-color);
            transform: translateY(-1px);
            box-shadow: var(--shadow-sm);
        }
        
        .company-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
        }
        
        .company-logo {
            width: 48px;
            height: 48px;
            border-radius: 0.5rem;
            object-fit: contain;
            background: var(--bg-secondary);
            padding: 0.25rem;
            border: 1px solid var(--border-color);
        }
        
        .company-info h3 {
            margin: 0;
            font-size: 1.25rem;
            font-weight: 600;
        }
        
        .company-info a {
            color: var(--text-primary);
            text-decoration: none;
        }
        
        .company-info a:hover {
            color: var(--accent-color);
        }
        
        .impact-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: 0.75rem;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            margin-top: 0.25rem;
        }
        
        .impact-proven {
            background: var(--proven-bg);
            color: var(--proven-color);
        }
        
        .impact-measured {
            background: var(--measured-bg);
            color: var(--measured-color);
        }
        
        .impact-favorite {
            background: var(--favorite-bg);
            color: var(--favorite-color);
        }
        
        .company-description {
            color: var(--text-secondary);
            margin-bottom: 1rem;
            font-size: 0.95rem;
        }
        
        .company-features {
            margin-bottom: 1rem;
        }
        
        .feature-list {
            display: none;
            margin-top: 0.5rem;
            padding-left: 1rem;
        }
        
        .feature-list.expanded {
            display: block;
        }
        
        .feature-list li {
            color: var(--text-secondary);
            font-size: 0.875rem;
            margin-bottom: 0.25rem;
        }
        
        .expand-features {
            color: var(--accent-color);
            background: none;
            border: none;
            cursor: pointer;
            font-size: 0.875rem;
            font-weight: 500;
            padding: 0;
        }
        
        .evidence-link {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--accent-color);
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 500;
            margin-top: 0.5rem;
        }
        
        .evidence-link:hover {
            text-decoration: underline;
        }
        
        .footer {
            text-align: center;
            padding: 3rem 0;
            margin-top: 4rem;
            border-top: 2px solid var(--border-color);
            color: var(--text-secondary);
        }
        
        .footer p {
            margin: 0.5rem 0;
        }
        
        .hidden {
            display: none;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            
            .header {
                padding: 2rem 1rem;
            }
            
            .stats {
                gap: 1rem;
            }
            
            .filter-group {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .filter-label {
                min-width: auto;
            }
            
            .companies-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>${title.heading}</h1>
            <p class="subtitle">${title.subtitle}</p>
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
                    <span class="stat-number">${categories.filter(cat => cat.companies.some(c => c.impact === 'proven')).length}</span>
                    <span class="stat-label">Proven Impact</span>
                </div>
            </div>
        </header>

        <div class="filters">
            <div class="filter-group">
                <label class="filter-label">Search:</label>
                <input type="text" class="search-input" placeholder="Search companies, tools, or technologies..." id="searchInput">
            </div>
            <div class="filter-group">
                <label class="filter-label">Impact:</label>
                <div class="filter-buttons">
                    <button class="filter-btn active" data-impact="all">All</button>
                    <button class="filter-btn" data-impact="proven">${impact_levels.proven.symbol} Proven</button>
                    <button class="filter-btn" data-impact="measured">${impact_levels.measured.symbol} Measured</button>
                    <button class="filter-btn" data-impact="favorite">${impact_levels.favorite.symbol} Community</button>
                </div>
            </div>
        </div>

        <main class="categories" id="categoriesContainer">
            ${categories.map((category, index) => `
                <section class="category" data-category="${category.id}">
                    <header class="category-header">
                        <div class="category-icon">${index + 1}</div>
                        <div>
                            <h2 class="category-title">${category.name}</h2>
                            <p class="category-description">${category.description}</p>
                        </div>
                    </header>
                    
                    <div class="companies-grid">
                        ${category.companies.map(company => `
                            <article class="company-card" 
                                     data-company="${company.name.toLowerCase()}" 
                                     data-impact="${company.impact}"
                                     data-tags="${company.tags.join(' ')}">
                                <div class="company-header">
                                    <img src="${company.logo}" alt="${company.name} logo" class="company-logo" onerror="this.style.display='none'">
                                    <div class="company-info">
                                        <h3><a href="${company.link}" target="_blank" rel="noopener">${company.name}</a></h3>
                                        <div class="impact-badge impact-${company.impact}">
                                            ${impact_levels[company.impact].symbol} ${impact_levels[company.impact].name}
                                        </div>
                                    </div>
                                </div>
                                
                                <p class="company-description">${company.description}</p>
                                
                                <div class="company-features">
                                    <button class="expand-features" onclick="toggleFeatures(this)">
                                        View Key Features →
                                    </button>
                                    <ul class="feature-list">
                                        ${company.key_features.map(feature => `<li>${feature}</li>`).join('')}
                                    </ul>
                                </div>
                                
                                <a href="${company.evidence_link}" target="_blank" rel="noopener" class="evidence-link">
                                    📊 ${company.evidence} →
                                </a>
                            </article>
                        `).join('')}
                    </div>
                </section>
            `).join('')}
        </main>

        <footer class="footer">
            <p><strong>Generated on ${generationDate}</strong></p>
            <p>Data-driven developer experience insights • <a href="https://github.com/nikola/awesome-devex-growth" target="_blank">Contribute on GitHub</a></p>
        </footer>
    </div>

    <script>
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const companyCards = document.querySelectorAll('.company-card');
        const categories = document.querySelectorAll('.category');

        let currentImpactFilter = 'all';

        searchInput.addEventListener('input', filterContent);
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active filter
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentImpactFilter = btn.dataset.impact;
                filterContent();
            });
        });

        function filterContent() {
            const searchTerm = searchInput.value.toLowerCase();
            let visibleCount = 0;

            categories.forEach(category => {
                let categoryVisible = false;
                const categoryCards = category.querySelectorAll('.company-card');
                
                categoryCards.forEach(card => {
                    const companyName = card.dataset.company;
                    const impact = card.dataset.impact;
                    const tags = card.dataset.tags;
                    
                    const matchesSearch = !searchTerm || 
                        companyName.includes(searchTerm) || 
                        tags.includes(searchTerm) ||
                        card.textContent.toLowerCase().includes(searchTerm);
                    
                    const matchesImpact = currentImpactFilter === 'all' || impact === currentImpactFilter;
                    
                    if (matchesSearch && matchesImpact) {
                        card.classList.remove('hidden');
                        categoryVisible = true;
                        visibleCount++;
                    } else {
                        card.classList.add('hidden');
                    }
                });
                
                if (categoryVisible) {
                    category.classList.remove('hidden');
                } else {
                    category.classList.add('hidden');
                }
            });
        }

        function toggleFeatures(button) {
            const featureList = button.nextElementSibling;
            const isExpanded = featureList.classList.contains('expanded');
            
            if (isExpanded) {
                featureList.classList.remove('expanded');
                button.textContent = 'View Key Features →';
            } else {
                featureList.classList.add('expanded');
                button.textContent = 'Hide Key Features ↑';
            }
        }

        // Add smooth scrolling for better UX
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    </script>
</body>
</html>
    `;
};

module.exports = generateHTML;