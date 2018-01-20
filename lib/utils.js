const dgram = require('dgram')
const fs = require('fs')
const cp = require('child_process')

function getDomain (msg) {
    let arr = []
    let bufDomain = msg.slice(12, msg.length - 4)
    for (let i = 0; i < bufDomain.length && bufDomain[i];) {
        let len = bufDomain[i]
        arr.push(bufDomain.slice(i + 1, i + len + 1)).toString()
        i = i + len + 1
    }
    return arr.join('.')
}


function recombinationQuestion (msg) {
    let ids = msg.slice(0, 2)
    let flag = new Buffer([0x81, 0x80])
    let qCount = msg.slice(4, 6)
    let aCount = new Buffer([0x00, 0x01])
    let other = msg.slice(8, msg.length)
    return Buffer.concat([ids, flag, qCount, aCount, other])
}

function resolve (msg, upstream, cb) {
    let udp = dgram.createSocket('udp4');
    udp.send(msg, 53, upstream);
    udp.on('timeout', function () {
        udp.close()
    })
    udp.on('error', function (error) {
        console.log('error: ', error)
        udp.close()
    })
    udp.on('message', function (response) {
        cb(response)
        udp.close()
    });
}


function readConfig (path) {
    return JSON.parse(fs.readFileSync(path));
}

function writeConfig (path, json) {
    try {
        fs.writeFileSync(path, JSON.stringify(json))
    } catch (error) {
        exec('dns')
    }
}

function exec (command) {
    cp.exec(command, function (error, stdout) {
        if (error !== null) {
            console.log('exec error: ' + error)
        } else {
            console.log(stdout)
        }
    });
}

module.exports = {
    getDomain: getDomain,
    recombinationQuestion: recombinationQuestion,
    resolve: resolve,
    readConfig: readConfig,
    writeConfig: writeConfig,
    exec: exec
}