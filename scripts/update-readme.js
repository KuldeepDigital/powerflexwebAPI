const fs = require('fs');
const path = require('path');

const packageJson = require('../package.json');
const swaggerFile = path.join(__dirname, '../swagger-output.json');
const readmeFile = path.join(__dirname, '../README.md');

let swaggerData = {};
if (fs.existsSync(swaggerFile)) {
  swaggerData = require(swaggerFile);
}

// 1. Build Dependencies Markdown
let depsMd = '### Dependencies\n';
if (packageJson.dependencies) {
  for (const [dep, version] of Object.entries(packageJson.dependencies)) {
    depsMd += `- \`${dep}\`: ${version}\n`;
  }
}
depsMd += '\n### Dev Dependencies\n';
if (packageJson.devDependencies) {
  for (const [dep, version] of Object.entries(packageJson.devDependencies)) {
    depsMd += `- \`${dep}\`: ${version}\n`;
  }
}

// 2. Build Endpoints Markdown
let apiMd = '';
if (swaggerData.paths) {
  for (const [routePath, methods] of Object.entries(swaggerData.paths)) {
    for (const [method, details] of Object.entries(methods)) {
      const summary = details.summary || '';
      apiMd += `- **${method.toUpperCase()}** \`${routePath}\` ${summary ? '- ' + summary : ''}\n`;
    }
  }
} else {
  apiMd = 'No API endpoints found.\n';
}

// 3. Update README
let readmeContent = fs.readFileSync(readmeFile, 'utf8');

const depsRegex = /<!-- DEPS_START -->[\s\S]*?<!-- DEPS_END -->/;
if (depsRegex.test(readmeContent)) {
  readmeContent = readmeContent.replace(depsRegex, `<!-- DEPS_START -->\n${depsMd}\n<!-- DEPS_END -->`);
} else {
  readmeContent += `\n\n<!-- DEPS_START -->\n${depsMd}\n<!-- DEPS_END -->`;
}

const apiRegex = /<!-- API_START -->[\s\S]*?<!-- API_END -->/;
if (apiRegex.test(readmeContent)) {
  readmeContent = readmeContent.replace(apiRegex, `<!-- API_START -->\n${apiMd}\n<!-- API_END -->`);
} else {
  readmeContent += `\n\n## API Endpoints\n<!-- API_START -->\n${apiMd}\n<!-- API_END -->`;
}

fs.writeFileSync(readmeFile, readmeContent);
console.log('README.md updated successfully.');
