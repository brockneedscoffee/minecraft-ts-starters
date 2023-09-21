#!/usr/bin/env node
const { execSync } = require("child_process");
const fs = require("fs");

const runCommand = (command) => {
  try {
    execSync(`${command}`, { stdio: "inherit" });
  } catch (e) {
    console.error("Failed to execute ${command}", e);
    return false;
  }
  return true;
};

const repoName = process.argv[2];
const gitCheckoutCommand = `git clone --depth 1 https://github.com/brockneedscoffee/minecraft-ts-starters.git ${repoName}`;
const installDepsCommand = `cd ${repoName} && npm install`;

const manifest = `{
  "format_version": 2,
  "header": {
    "name": "${repoName}",
    "description": "My TypeScript Project",
    "uuid": "14e467b4-e3aa-49d3-8352-f8439fd7b2ee",
    "version": [0, 0, 1],
    "min_engine_version": [1, 20, 30]
  },
  "modules": [
    {
      "description": "Script resources",
      "language": "javascript",
      "type": "script",
      "uuid": "7c7e693f-99f4-41a9-95e0-1f57b37e1e12",
      "version": [0, 0, 1],
      "entry": "scripts/main.js"
    }
  ],
  "dependencies": [
    {
      "module_name": "@minecraft/server",
      "version": "1.5.0"
    }
  ]
}`;

const manifestDir = `${repoName}/behavior_packs/${repoName}`;
const createManifestDirCommand = () => {
  if (!fs.existsSync(manifestDir)) {
    fs.mkdirSync(manifestDir, { recursive: true });
  }
  try {
    fs.writeFileSync(`${manifestDir}/manifest.json`, manifest);
  } catch (err) {
    console.error(err);
  }
};

console.log(`Cloning the repository with name ${repoName}`);
const checkedOut = runCommand(gitCheckoutCommand);
if (!checkedOut) process.exit(-1);

console.log(`Installing dependencies for ${repoName}`);
const installedDeps = runCommand(installDepsCommand);
if (!installedDeps) process.exit(-1);

console.log(`Creating Behavior Pack manifest...`);
const createBehaviorPack = createManifestDirCommand();
if (!createBehaviorPack) process.exit(-1);

console.log("Congratulations! You are ready. Follow the following commands to start");
console.log(`cd ${repoName} && npm start`);
