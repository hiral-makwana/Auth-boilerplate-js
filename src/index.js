#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const { execSync } = require('child_process');
const { createReadme } = require('./bin/readme')

// The first argument will be the project name.
const projectName = process.argv[2];

// Create a project directory with the project name.
const currentDir = process.cwd();

const projectDir = path.resolve(currentDir, projectName);
fs.mkdirSync(projectDir, { recursive: true });

// Prompts
const questions = [
    {
        type: "input",
        name: "name",
        message: "Name of the project",
        validate: (name) => typeof name === "string",
    },
    {
        type: "input",
        name: "author",
        message: "Name of the author",
        validate: (name) => typeof name === "string",
    },
    {
        type: "input",
        name: "description",
        message: "Description",
        validate: (name) => typeof name === "string",
    }
];

async function packagePrompts() {
    return await inquirer.prompt(questions);
}

async function run() {
    const answers = await packagePrompts();

    const templateDir = path.resolve(__dirname, "../");
    fs.cpSync(templateDir, projectDir, { recursive: true });
    process.chdir(projectDir);
    
    console.log('Installing dependencies...');
    execSync('npm install');
    
    const filesToDelete = ['src/index.js', '.npmignore', 'src/bin/readme.js'];
    console.log('Removing useless files');

    // Delete individual files
    filesToDelete.forEach((file) => {
        const filePath = path.join(projectDir, file);

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Error deleting ${filePath}: ${err.message}`);
            }
        });
    });

    // Remove the 'src/bin' directory
    const binDirPath = path.join(projectDir, 'src/bin');
    fs.rmSync(binDirPath, { recursive: true });

    // Remove the '.git' directory
    execSync('npx rimraf ./.git');
    // Read the existing package.json file
    const packageJsonPath = path.join(projectDir, "package.json");
    const existingPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    // Update the properties with answers
    existingPackageJson.name = answers.name;
    existingPackageJson.author = answers.author;
    existingPackageJson.description = answers.description;
    existingPackageJson.version = "1.0.0";
    // Write the updated package.json file
    fs.writeFileSync(packageJsonPath, JSON.stringify(existingPackageJson, null, 2));

    await createReadme(answers, projectDir)
    console.log("Success! Your new project is ready.");
}

// Make sure to call the asynchronous run function
run();
