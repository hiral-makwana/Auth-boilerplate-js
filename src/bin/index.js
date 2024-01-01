#!/usr/bin/env node

// const fs = require("fs");
// const path = require("path");
// const inquirer = require("inquirer");
// const { execSync } = require('child_process');
// const { createReadme } = require('./readme')

// // The first argument will be the project name.
// const projectName = process.argv[2];

// // Create a project directory with the project name.
// const currentDir = process.cwd();

// const projectDir = path.resolve(currentDir, projectName);
// fs.mkdirSync(projectDir, { recursive: true });

// // Prompts
// const questions = [
//     {
//         type: "input",
//         name: "name",
//         message: "Name of the project",
//         validate: (name) => typeof name === "string",
//     },
//     {
//         type: "input",
//         name: "author",
//         message: "Name of the author",
//         validate: (name) => typeof name === "string",
//     },
//     {
//         type: "input",
//         name: "description",
//         message: "Description",
//         validate: (name) => typeof name === "string",
//     }
// ];

// async function packagePrompts() {
//     return await inquirer.prompt(questions);
// }

// async function run() {
//     const answers = await packagePrompts();

//     const templateDir = path.resolve(__dirname, "../../");
//     fs.cpSync(templateDir, projectDir, { recursive: true });
//     process.chdir(projectDir);

//     console.log('Installing dependencies...');
//     execSync('npm install');

//     const filesToDelete = ['src/bin/index.js', '.npmignore', 'src/bin/readme.js'];
//     console.log('Removing useless files');

//     // Delete individual files
//     filesToDelete.forEach((file) => {
//         const filePath = path.join(projectDir, file);

//         fs.unlink(filePath, (err) => {
//             if (err) {
//                 console.error(`Error deleting ${filePath}: ${err.message}`);
//             }
//         });
//     });

//     // Remove the 'src/bin' directory
//     const binDirPath = path.join(projectDir, 'src/bin');
//     fs.rmSync(binDirPath, { recursive: true });

//     // Remove the '.git' directory
//     execSync('npx rimraf ./.git');
//     // Read the existing package.json file
//     const packageJsonPath = path.join(projectDir, "package.json");
//     const existingPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
//     // Update the properties with answers
//     existingPackageJson.name = answers.name;
//     existingPackageJson.author = answers.author;
//     existingPackageJson.description = answers.description;
//     existingPackageJson.version = "1.0.0";
//     // Write the updated package.json file
//     fs.writeFileSync(packageJsonPath, JSON.stringify(existingPackageJson, null, 2));

//     await createReadme(answers, projectDir)
//     console.log("Success! Your new project is ready.");
// }

// // Make sure to call the asynchronous run function
// run();

const util = require('util');
const path = require('path');
const fs = require('fs');
const inquirer = require("inquirer");
const { createReadme } = require('./readme');

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
    console.log('    npx create-nodejs-app my-app');
    console.log('    OR');
    console.log('    npm init nodejs-app my-app');
    process.exit(1);
}

// Define constants
const ownPath = process.cwd();
const folderName = process.argv[2];
const appPath = path.join(ownPath, folderName);
const repo = 'https://github.com/hiral-makwana/NodeAuthBase-JS.git';

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

async function setup() {
    try {
        const answers = await packagePrompts();
        // Clone repo
        console.log(`Downloading files from repo ${repo}`);
        await runCmd(`git clone --depth 1 ${repo} ${folderName}`);
        console.log('Cloned successfully.');
        console.log('');

        // Change directory
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

        // Write the updated package.json file
        fs.writeFileSync(packageJsonPath, JSON.stringify(existingPackageJson, null, 2));

        await createReadme(answers, appPath);

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