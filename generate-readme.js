const fs = require('fs');

function generateReadme(data) {
  const { title, metadata, impact_levels, categories, research_links, case_studies, frameworks, reports } = data;
  
  // Calculate total companies across all categories
  const totalCompanies = categories.reduce((total, category) => total + category.companies.length, 0);
  
  let readme = `# ${title.heading} [![Awesome](https://awesome.re/badge.svg)](https://awesome.re) [![Total Examples](https://img.shields.io/badge/examples-${totalCompanies}-brightgreen.svg)](#contents) [![Last Updated](https://img.shields.io/github/last-commit/nikola/awesome-devex-growth.svg)](#contents)

> ${title.subtitle}

${metadata.description}

📖 **See [DEFINITIONS.md](DEFINITIONS.md) for impact levels, evidence requirements, and submission guidelines.**

## Quick Search Tips
💡 Use GitHub's search or Ctrl+F to find companies quickly  
🏢 **Popular companies:** ${categories.map(c => c.companies.slice(0, 2).map(comp => comp.name).join(', ')).join(', ')}  
🏷️ **By impact:** ${impact_levels.proven.symbol} (proven) · ${impact_levels.measured.symbol} (measured) · ${impact_levels.favorite.symbol} (community favorite)

## Contents

`;

  // Generate table of contents
  categories.forEach(category => {
    readme += `- [${category.name}](#${category.id})\n`;
  });
  
  readme += `- [Growth Evidence & Case Studies](#growth-evidence--case-studies)\n`;
  readme += `- [Research & Metrics](#research--metrics)\n`;

  readme += `\n## Legend

- ${impact_levels.proven.symbol} **${impact_levels.proven.name}** - ${impact_levels.proven.description}
- ${impact_levels.measured.symbol} **${impact_levels.measured.name}** - ${impact_levels.measured.description}  
- ${impact_levels.favorite.symbol} **${impact_levels.favorite.name}** - ${impact_levels.favorite.description}

[↑ Back to top](#contents)

---

`;

  // Generate category sections
  categories.forEach(category => {
    readme += `## ${category.name}\n\n[↑ Back to top](#contents)\n\n`;
    
    category.companies.forEach(company => {
      const impactSymbol = impact_levels[company.impact]?.symbol || '';
      
      readme += `### [${company.name}](${company.link})\n`;
      readme += `**Impact:** ${impactSymbol} **Evidence:** [${company.evidence}](${company.evidence_link})\n`;
      readme += `**Key Features:**\n`;
      
      company.key_features.forEach(feature => {
        readme += `- ${feature}\n`;
      });
      
      readme += `**Why it's awesome:** ${company.why_awesome}\n\n`;
    });
  });

  // Growth Evidence & Case Studies
  readme += `## Growth Evidence & Case Studies\n\n[↑ Back to top](#contents)\n\n`;
  
  readme += `### Business Impact Research\n`;
  research_links.forEach(link => {
    readme += `- [${link.title}](${link.url})\n`;
  });
  
  readme += `\n### Developer Productivity Studies\n`;
  case_studies.forEach(study => {
    readme += `- [${study.title}](${study.url})\n`;
  });

  // Research & Metrics
  readme += `\n## Research & Metrics\n\n[↑ Back to top](#contents)\n\n`;
  
  readme += `### DevEx Frameworks\n`;
  frameworks.forEach(framework => {
    readme += `- [${framework.name} (${framework.source})](${framework.url})\n`;
  });
  
  readme += `\n### Industry Reports\n`;
  reports.forEach(report => {
    readme += `- [${report.name}](${report.url})\n`;
  });

  // Contributing section
  readme += `\n---

## Contributing

[↑ Back to top](#contents)

See our [contributing guidelines](CONTRIBUTING.md) and [definitions](DEFINITIONS.md) for information on how to add examples.

We especially welcome:
- 📊 Quantified growth metrics
- 🔗 Case studies with business impact
- 🏢 Company submissions showcasing their DevEx
- 📱 Social proof (tweets, blog posts, testimonials)

## Company Index

`;

  // Generate company index
  const companyNames = categories.flatMap(cat => cat.companies.map(c => c.name)).sort();
  const groupedCompanies = {};
  
  companyNames.forEach(name => {
    const firstLetter = name.charAt(0).toUpperCase();
    if (!groupedCompanies[firstLetter]) {
      groupedCompanies[firstLetter] = [];
    }
    groupedCompanies[firstLetter].push(name);
  });
  
  Object.keys(groupedCompanies).sort().forEach(letter => {
    const nextLetters = Object.keys(groupedCompanies).filter(l => l > letter).slice(0, 2);
    const range = nextLetters.length > 0 ? `${letter}-${nextLetters[nextLetters.length - 1]}` : letter;
    readme += `**${range}:** ${groupedCompanies[letter].join(', ')}  \n`;
  });

  readme += `\n[↑ Back to top](#contents)

## Maintainers

This repository is maintained by the community. For questions or suggestions, please [open an issue](https://github.com/nikola/awesome-devex-growth/issues).

## License

[![CC0](http://mirrors.creativecommons.org/presskit/buttons/88x31/svg/cc-zero.svg)](https://creativecommons.org/publicdomain/zero/1.0/)

To the extent possible under law, the contributors have waived all copyright and related rights to this work.
`;

  return readme;
}

// Main execution
try {
  // Read and parse the JSON file
  const data = JSON.parse(fs.readFileSync('./devex-growth.json', 'utf8'));
  
  // Generate README content
  const readmeContent = generateReadme(data);
  
  // Save the README file
  fs.writeFileSync('README.md', readmeContent);
  
  console.log('✅ README.md generated successfully!');
  console.log(`📊 Total companies: ${data.categories.reduce((total, cat) => total + cat.companies.length, 0)}`);
  console.log(`📝 Categories: ${data.categories.length}`);
  
} catch (error) {
  console.error('❌ Error generating README:', error);
  process.exit(1);
}