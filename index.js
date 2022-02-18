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

function sendState (data) {
    if (data.startsWith('1')) {
        console.log(`${new Date().toISOString()} Calling for heat ON`)
        exec('callforheat 1')
    } else {
        console.log(`${new Date().toISOString()} Calling for heat OFF`)
        exec('callforheat 0')
    }
}

// let timer = {}
// function sendStatePeriodically (path) {
//     function sendStateOnInterval() {
//         console.log(`${new Date().toISOString()} Periodic timer...`)
//         sendState()
//     }

//     clearInterval(timer)
//     sendState(path)
//     timer = setInterval(sendStateOnInterval, 1000 * 60)
// }

function onSwitchStateChanged (path) {
    console.log(`${new Date().toISOString()} Switch state changed`)

    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return
        }

        setImmediate(() => {
            sendState(data)
        })
    })
}

function run (args) {
    const watcher = chokidar.watch(args.callingForHeatFile)
    watcher
        .on('add', onSwitchStateChanged)
        .on('change', onSwitchStateChanged)
        .on('ready', path => console.log('ready'))
}

console.log(run(parseArgs()))
