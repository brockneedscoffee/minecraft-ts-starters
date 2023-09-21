#!/usr/bin/env node
const { execSync } = require("child_process");
import { v4 as uuidv4 } from "uuid";

const manifestUUID = uuidv4();

const manifest = `{
  "format_version": 2,
  "header": {
    "name": "${repoName}",
    "description": "My TypeScript Project",
    "uuid": "${uuidv4()}",
    "version": [0, 0, 1],
    "min_engine_version": [1, 20, 30]
  },
  "modules": [
    {
      "description": "Script resources",
      "language": "javascript",
      "type": "script",
      "uuid": "${uuidv4()}",
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
const createBehaviorPackCommand = `cd ${repoName} && mkdir behavior_packs/${repoName} && cd behavior_packs/${repoName} && echo ${manifest} >> manifest.json`;

console.log(`Cloning the repository with name ${repoName}`);
const checkedOut = runCommand(gitCheckoutCommand);
if (!checkedOut) process.exit(-1);

console.log(`Installing dependencies for ${repoName}`);
const installedDeps = runCommand(installDepsCommand);
if (!installedDeps) process.exit(-1);

console.log(`Creating Behavior Pack manifest...`);
const createBehaviorPack = runCommand(createBehaviorPackCommand);
if (!createBehaviorPack) process.exit(-1);

console.log("Congratulations! You are ready. Follow the following commands to start");
console.log(`cd ${repoName} && npm start`);
