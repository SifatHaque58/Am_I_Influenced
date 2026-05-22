const fs = require('fs');

let content = fs.readFileSync('src/data/questions.ts', 'utf8');
content = content.replace(/type:\s*['"][^'"]+['"],/g, match => `${match}\n    genderRelevance: 'neutral',`);
fs.writeFileSync('src/data/questions.ts', content);
