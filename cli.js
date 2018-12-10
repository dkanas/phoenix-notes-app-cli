#!/usr/bin/env node

const handlers = require('./handlers')

const command = process.argv[2]
const options = process.argv.slice(3)

const handler = handlers[command]
if (!handler)
  console.log(`Command ${command} not recognized. Commands: ls, create, show, update, delete`)
else handler(options)
