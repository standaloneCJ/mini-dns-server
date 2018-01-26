const dgram = require('dgram')
const response = require('./response')
const utils = require('./utils')
const path = require('path')
const server = dgram.createSocket('udp4')
const configPath = path.join(__dirname, '../lib/config.json')

let config = utils.readConfig(configPath)
console.log(config)
let upstream = config.upstream

server.on('listening', function () {
    console.log('listening on port 53')
})

server.on('error', function (error) {
    console.log('error: ', error)
})

server.on('message', function (msg, info) {
    let question = utils.recombinationQuestion(msg)
    let domain = utils.getDomain(msg)
    let ip = config.router[domain]
    if (ip) {
        console.log('\x1B[36m%s\x1B[0m', 'local resolve , domain: ' +  domain  + ' , ip: ' + ip )
        let answer = response(msg, ip)
        let result = Buffer.concat([question, answer]);
        server.send(result, info.port, info.address)
    } else {
        console.log('\x1B[33m%s\x1b[0m:', upstream + ' resolve , domain: ' + domain)
        utils.resolve(msg, upstream, function (data) {
            server.send(data, info.port, info.address)
        })
    }
})

server.bind(53)




