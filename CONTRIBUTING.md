# Contributing to Awesome DevEx Growth

Thank you for your interest in contributing! This guide will help you add high-quality DevEx examples that demonstrate growth impact.

📖 **See [DEFINITIONS.md](DEFINITIONS.md) for detailed impact levels, evidence requirements, and quality standards.**

## What Makes a Great Contribution

We're specifically looking for DevEx examples that:

1. **Have measurable business impact** - Growth metrics, adoption numbers, revenue impact
2. **Include credible evidence** - Case studies, blog posts, research papers, or social proof
3. **Focus on developer experience** - Tools, practices, or initiatives that improve how developers work
4. **Are publicly accessible** - Links should be available to everyone

## 🏗️ Project Architecture (NEW!)

This project uses a **JSON-first architecture** inspired by the [ai-enablement-stack](https://github.com/daytonaio/ai-enablement-stack). All content is stored in `devex-growth.json` and automatically generates multiple outputs:

- **README.md** - Auto-generated from JSON data
- **Interactive HTML** - Searchable web version with logos
- **Social Images** - Auto-generated preview images
- **Statistics** - Real-time analytics and insights

## Quick Start

1. **Read [DEFINITIONS.md](DEFINITIONS.md)** - Understand impact levels and format requirements
2. **Choose your method:**
   - 🔥 **Recommended:** [Submit via GitHub Issue](../../issues/new) (uses our template)
   - 🛠️ **JSON Expert:** Edit `devex-growth.json` directly (see below)
   - 🛠️ **Traditional:** Submit via Pull Request to README
3. **Include evidence** - Links to case studies, metrics, or social proof
4. **Wait for review** - Community and maintainers will provide feedback

## 📋 Submission Format

### JSON Entry Format (Recommended)
Add your entry to the appropriate category in `devex-growth.json`:

```json
{
  "name": "Your Company",
  "description": "Brief description of the tool/practice",
  "link": "https://company.com/docs",
  "impact": "proven",
  "evidence": "40% faster deployment reported by users",
  "evidence_link": "https://company.com/case-study",
  "logo": "./public/images/company.svg",
  "key_features": [
    "Feature that drives developer productivity",
    "Another key differentiator",
    "Specific capability that reduces friction"
  ],
  "why_awesome": "Explain the specific developer experience benefit and business impact",
  "tags": ["relevant", "searchable", "keywords"]
}
```

### Logo Requirements
- **Size:** 100x100px recommended (SVG preferred, PNG acceptable)
- **Format:** SVG > PNG > JPG
- **Background:** Should work on light backgrounds
- **File path:** `./public/images/company-name.svg`
- **Naming:** Use lowercase, hyphenated filenames

## How to Contribute

### Option 1: Submit via GitHub Issue (🔥 Recommended)
1. [Create a new issue](../../issues/new) and select "DevEx Example Submission"
2. Fill in the template with your example details
3. Wait for community review and maintainer approval
4. Once approved, we'll add it to the main JSON file

### Option 2: Edit JSON Directly (⚡ Fastest for Contributors)
1. Fork this repository
2. Add your company logo to `public/images/` (follow naming convention)
3. Edit `devex-growth.json` and add your entry to the appropriate category
4. Test locally: `npm install && npm run generate`
5. Create a pull request with title: "Add [Company Name] to [Category]"
6. Verify all outputs look correct in the PR preview

### Option 3: Traditional README Edit (🛠️ Advanced)
1. Fork this repository
2. Read [DEFINITIONS.md](DEFINITIONS.md) to understand format requirements
3. Add your example to the appropriate section in README.md
4. Create a pull request with title: "Add [Company Name] [Category]"
5. Explain why this example demonstrates DevEx-driven growth

## 🧪 Testing Your Contribution

### Local Development Setup
```bash
# Clone your fork
git clone https://github.com/your-username/awesome-devex-growth
cd awesome-devex-growth

# Install dependencies
npm install

# Install Playwright for image generation
npx playwright install chromium

# Generate all outputs
npm run generate

# Start development server with hot reload
npm run dev
```

### Available Commands
- `npm run generate` - Generate all outputs (README, HTML, images)
- `npm run generate:readme` - Generate README only
- `npm run generate:html` - Generate interactive HTML only
- `npm run generate:image` - Generate social preview images
- `npm run dev` - Start development server at http://localhost:3000

### Verification Checklist
- [ ] JSON is valid (use `npm run generate` to test)
- [ ] Logo displays correctly in HTML version
- [ ] All links work and are accessible
- [ ] Company appears in generated README
- [ ] Search and filtering work in interactive version
- [ ] Social preview images generate without errors

## 📁 File Structure

```
awesome-devex-growth/
├── devex-growth.json          # 📊 Single source of truth
├── README.md                  # 📖 Auto-generated (don't edit directly!)
├── CONTRIBUTING.md            # 📋 This file
├── DEFINITIONS.md             # 📚 Standards and definitions
├── generate-readme.js         # 🔧 README generator
├── generate-html.js           # 🔧 HTML generator  
├── generate-image.js          # 🔧 Social image generator
├── template.js                # 🎨 HTML template
├── server.js                  # 🌐 Development server
├── package.json               # 📦 Dependencies
├── public/
│   ├── images/               # 🖼️ Company logos
│   └── bg.png               # 🎨 Background image
└── dist/                     # 📁 Generated outputs (ignored in git)
    ├── index.html           # 🌐 Interactive web version
    ├── devex-growth-social.png # 📱 Social preview
    └── stats.json           # 📊 Analytics data
```

## 🎨 Logo Guidelines

### Adding a Company Logo
1. **Create the logo file:**
   ```bash
   # SVG preferred (100x100px viewBox)
   public/images/company-name.svg
   
   # Or PNG as fallback
   public/images/company-name.png
   ```

2. **Update JSON entry:**
   ```json
   {
     "logo": "./public/images/company-name.svg"
   }
   ```

3. **Test the logo:**
   ```bash
   npm run generate:html
   # Check http://localhost:3000 after running npm run dev
   ```

### Logo Best Practices
- **Scalable:** Should look good at different sizes
- **Clear:** Readable company name or recognizable symbol
- **Consistent:** Similar style to existing logos in the collection
- **Optimized:** Keep file size reasonable (<50KB)

### Logo Creation Template (SVG)
```svg
<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" rx="20" fill="#brand-color"/>
  <text x="50" y="55" text-anchor="middle" fill="white" 
        font-family="Arial, sans-serif" font-size="12" font-weight="bold">
    COMPANY
  </text>
</svg>
```

## 🔄 Automated Workflow

### How the JSON-First Architecture Works
1. **Edit JSON** - All data lives in `devex-growth.json`
2. **Auto-Generation** - Scripts generate README, HTML, and images
3. **Hot Reload** - Development server updates in real-time
4. **Multi-Output** - One source creates multiple formats

### When You Edit `devex-growth.json`:
- README.md is automatically regenerated
- Interactive HTML version is updated
- Social preview images are recreated
- Statistics are recalculated
- Search index is rebuilt

### File Watching (Development)
The development server (`npm run dev`) watches for changes and automatically:
- Regenerates all outputs when JSON changes
- Reloads the browser with WebSocket
- Updates the interactive version instantly
- Validates JSON format and links

## Review Process

All contributions go through a review process:

1. **Automated checks** - JSON validation, link verification, and format checking
2. **Generator testing** - Ensure all outputs generate correctly
3. **Community feedback** - Other contributors can provide feedback
4. **Maintainer review** - Final approval based on quality and evidence
5. **Auto-publication** - Outputs are automatically regenerated from JSON

### Automated Validation
Before merging, we verify:
- [ ] JSON syntax is valid
- [ ] All required fields are present
- [ ] Links are accessible (200 status)
- [ ] Logo files exist and load correctly
- [ ] Generated outputs look correct
- [ ] No duplicate entries

## Quality Standards

See [DEFINITIONS.md](DEFINITIONS.md#quality-standards) for detailed quality requirements and examples of what we accept or reject.

## 🌐 Interactive Features

The new architecture enables powerful interactive features:

### Web Version Features
- **🔍 Real-time search** - Find companies, tools, or technologies instantly
- **🏷️ Smart filtering** - Filter by impact level (Proven/Measured/Community)
- **📊 Live statistics** - See real-time metrics and category breakdowns
- **🖼️ Visual logos** - Company branding for better recognition
- **📱 Mobile responsive** - Works perfectly on all devices
- **⚡ Fast performance** - Sub-200ms interactions like Linear

### Social Media Integration
- **📸 Auto-generated previews** - Social cards for Twitter, LinkedIn
- **🎨 Branded imagery** - Consistent visual identity
- **📊 Visual statistics** - Engaging graphics with key metrics
- **🔗 Perfect sharing** - Optimized for social platforms

## Self-Nominations Welcome! 🚀

Companies are encouraged to submit their own DevEx examples! We especially value:

- 📊 **Internal metrics** - Share your productivity gains
- 📈 **Growth stories** - How DevEx drove business results  
- ⭐ **Industry recognition** - Awards or survey rankings
- 📱 **Social proof** - Developer testimonials and community feedback

### Company Submission Benefits
- **🌐 Interactive presence** - Beautiful company cards with logos
- **🔍 Discoverability** - Searchable by name, category, and technology
- **📊 Analytics inclusion** - Part of comprehensive DevEx research
- **📱 Social amplification** - Auto-generated social media assets

## 🚀 Deployment & Distribution

### Multiple Output Formats
Your contribution will appear in:
- **📖 GitHub README** - The main repository page
- **🌐 Interactive Website** - Searchable web version (deployed to GitHub Pages)
- **📱 Social Media** - Auto-generated preview cards
- **📊 Analytics Dashboard** - Included in growth metrics analysis

### Future Deployments
We're planning deployments to:
- **GitHub Pages** - Free hosting for the interactive version
- **Cloudflare Workers** - Global CDN distribution
- **API Endpoints** - Programmatic access to DevEx data
- **Newsletter** - Featured companies in monthly updates

## 💡 Pro Tips for Contributors

### JSON Editing Tips
```bash
# Validate JSON before committing
npm run generate:readme

# Check interactive version
npm run dev
# Visit http://localhost:3000

# Test all outputs
npm run generate
```

### Common Mistakes to Avoid
- ❌ **Editing README.md directly** - It's auto-generated!
- ❌ **Missing logo files** - Add logos to `public/images/`
- ❌ **Invalid JSON syntax** - Use a JSON validator
- ❌ **Broken links** - Test all URLs before submitting
- ❌ **Weak evidence** - Include measurable impact data

### Best Practices
- ✅ **Test locally first** - Always run `npm run generate`
- ✅ **Use descriptive commit messages** - Help reviewers understand changes
- ✅ **Include compelling evidence** - Growth metrics, case studies, testimonials
- ✅ **Optimize logos** - Keep file sizes reasonable
- ✅ **Follow naming conventions** - Use lowercase, hyphenated filenames

## 🔧 Troubleshooting

### Common Issues

**"npm run generate fails"**
```bash
# Check JSON syntax
cat devex-growth.json | json_pp

# Install missing dependencies
npm install
npx playwright install chromium
```

**"Logo doesn't appear"**
```bash
# Check file path in JSON matches actual file
ls public/images/your-company.svg

# Verify logo in browser
npm run dev
# Visit http://localhost:3000
```

**"Generated README looks wrong"**
```bash
# Check for JSON syntax errors
npm run generate:readme

# Compare with original
git diff README.md
```

## Maintenance

- **Links** - Automatically checked monthly via CI
- **Content** - Reviewed quarterly for relevance and accuracy
- **Dependencies** - Updated regularly for security
- **Outputs** - Regenerated automatically on JSON changes
- **Outdated entries** - May be removed if links break permanently
- **Updates** - Existing entries can be updated anytime

## Questions?

- 📋 Check our [existing issues](../../issues) for similar questions
- ❓ [Create a new issue](../../issues/new) for specific questions  
- 💬 Tag maintainers (@nibzard) in discussions for clarification
- 🐛 Report bugs with the generation system
- 💡 Suggest new features for the interactive version

## Code of Conduct

By contributing, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please be respectful and constructive in all interactions.

---

Thank you for helping build the most comprehensive resource for DevEx practices that drive growth! 🚀