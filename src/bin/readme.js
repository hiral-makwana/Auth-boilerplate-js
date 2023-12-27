const fs = require("fs");
const path = require("path");

async function createReadme(answers, projectDir) {
    const readmeContent = `# ${answers.name}
    ## Project Description
    ${answers.description}`;

    const readmePath = path.join(projectDir, "README.md");
    fs.writeFileSync(readmePath, readmeContent, 'utf-8');
}
module.exports = { createReadme }