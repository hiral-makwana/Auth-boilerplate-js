#!/usr/bin/env node

const util = require('util');
const path = require('path');
const fs = require('fs');
const inquirer = require("inquirer");
const { createReadme } = require('./readme');
const { execSync } = require('child_process');
// Utility functions
const exec = util.promisify(require('child_process').exec);

async function runCmd(command) {
    try {
        const { stdout, stderr } = await exec(command);
        //console.log(stdout);
        console.log(stderr);
    } catch {
        (error) => {
            console.log(error);
        };
    }
}
async function hasYarn() {
    try {
        await execSync('yarnpkg --version', { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

// Validate arguments
if (process.argv.length < 3) {
    console.log('Please specify the target project directory.');
    console.log('For example:');
    console.log('    npx create-node-auth-base-js my-app');
    console.log('    OR');
    console.log('    npm init node-auth-base-js my-app');
    process.exit(1);
}

// Define constants
const ownPath = process.cwd();
const folderName = process.argv[2];
const appPath = path.join(ownPath, folderName);
const repo = 'https://github.com/hiral-makwana/NodeAuthBase-JS.git';

console.log(appPath)
// Check if directory already exists
try {
    fs.mkdirSync(appPath);
} catch (err) {
    if (err.code === 'EEXIST') {
        console.log('Directory already exists. Please choose another name for the project.');
    } else {
        console.log(error);
    }
    process.exit(1);
}

// Prompts
const questions = [
    {
        type: "input",
        name: "name",
        message: "Project Name:",
        validate: (name) => typeof name === "string",
    },
    {
        type: "input",
        name: "author",
        message: "Author Name:",
        validate: (name) => typeof name === "string",
    },
    {
        type: "input",
        name: "description",
        message: "Description:",
        validate: (name) => typeof name === "string",
    }
];

async function packagePrompts() {
    return await inquirer.prompt(questions);
}

async function setup() {
    try {
        const answers = await packagePrompts();
        // Clone repo
        // const templateDir = path.resolve(__dirname, "../../");
        // fs.cpSync(templateDir, appPath, { recursive: true });
        // console.log(`Downloading files from repo ${repo}`);
        await runCmd(`git clone --depth 1 ${repo} ${folderName}`);
        console.log('Cloned successfully.');
        console.log('');

        process.chdir(appPath);

        // Install dependencies
        const useYarn = await hasYarn();
        console.log('Installing dependencies...');
        if (useYarn) {
            await runCmd('yarn install');
        } else {
            await runCmd('npm install');
        }
        console.log('Dependencies installed successfully.');
        console.log();

        // Read the existing package.json file
        const packageJsonPath = path.join(appPath, "package.json");
        const existingPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        // Update the properties with answers
        existingPackageJson.name = answers.name;
        existingPackageJson.author = answers.author;
        existingPackageJson.description = answers.description;
        existingPackageJson.version = "1.0.0";

        delete existingPackageJson.repository
        // Write the updated package.json file
        fs.writeFileSync(packageJsonPath, JSON.stringify(existingPackageJson, null, 2));

        await createReadme(answers, appPath);
        const binDirPath = path.join(appPath, 'src/bin');
        fs.rmSync(binDirPath, { recursive: true });

        // Remove the '.git' directory
        execSync('npx rimraf ./.git');
        console.log('Installation is now complete!');
        console.log();

        console.log('We suggest that you start by typing:');
        console.log(`    cd ${folderName}`);
        console.log(useYarn ? '    yarn dev' : '    npm run dev');
    } catch (error) {
        console.log(error);
    }
}

setup();