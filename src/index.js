#!/usr/bin/env node

//Usage: npx my-template my-app

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');


if (process.argv.length < 3) {
    console.log('You have to provide a name to your app.');
    console.log('For example :');
    console.log('    npx create-my-boilerplate my-app');
    process.exit(1);
}


//The first argument will be the project name.
const projectName = process.argv[2];

// Create a project directory with the project name.
const currentDir = process.cwd();

const projectDir = path.resolve(currentDir, projectName);
try {
    fs.mkdirSync(projectDir);
} catch (err) {
    if (err.code === 'EEXIST') {
        console.log(`The file ${projectName} already exist in the current directory, please give it another name.`);
    } else {
        console.log(err);
    }
    process.exit(1);
}

async function main() {
    try {
        console.log('Downloading files...');
        const templateDir = path.resolve(__dirname, "../");
        fs.cpSync(templateDir, projectDir, { recursive: true });

        process.chdir(projectDir);

        console.log('Installing dependencies...');
        execSync('npm install');

        console.log('Removing useless files');
        execSync('npx rimraf ./.git');
        const indexPath = path.join(projectDir, 'src/index.js')
        fs.unlink(indexPath, (err) => {
            if (err) throw err;
        });
        console.log('The installation is done, this is ready to use !');

    } catch (error) {
        console.log(error);
    }
}
main();
