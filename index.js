'use strict'

const fs = require('fs')
const chokidar = require('chokidar')
const exec = require('child_process').execSync

function usage () {
    console.log('Usage: ')
    console.log('  node index.js CALL_FOR_HEAT_FILE')
    console.log('  npm start -- CALL_FOR_HEAT_FILE')
    process.exit()
}

function parseArgs () {
    function readArgValue () {
        return process.argv[++argi] || usage()
    }

    let argi = 1

    return {
        callingForHeatFile: readArgValue()
    }
}

let timer = {}

function sendStatePeriodically(path) {
    
    console.log(`${new Date().toISOString()} Switch state changed`)

    function sendState() {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                console.error(err)
                return
            }
            if (data.startsWith('1')) {
                console.log(`${new Date().toISOString()} Calling for heat ON`)
                exec('callforheat 1')
            } else {
                console.log(`${new Date().toISOString()} Calling for heat OFF`)
                exec('callforheat 0')
            }
        })
    }
    
    function sendStateOnInterval() {
        console.log(`${new Date().toISOString()} Periodic timer...`)
        sendState()
    }
    
    clearInterval(timer)
    sendState()
    timer = setInterval(sendStateOnInterval, 1000 * 60)
}

function run(args) {
    const watcher = chokidar.watch(args.callingForHeatFile)
    watcher
        .on('add', sendStatePeriodically)
        .on('change', sendStatePeriodically)
        .on('ready', path => console.log(`ready`))
}

console.log(run(parseArgs()))
