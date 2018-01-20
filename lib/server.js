
    const dgram = require('dgram')
    const response = require('./response')
    const utils = require('./utils')
    const path = require('path')
    const server = dgram.createSocket('udp4')
    const configPath =  path.join(__dirname, '../lib/config.json')

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
        console.log(config)
        if (ip) {
            console.log('local resolve , domain: %s, ip: %s', domain , ip)
            let answer = response(msg, ip)
            let result = Buffer.concat([question, answer]);
            server.send(result, info.port, info.address)
        } else {
            console.log('upstream (%s) resolve , domain: %s', upstream, domain)
            utils.resolve(msg,upstream, function (data) {
                server.send(data, info.port, info.address)
            })
        }
    })

    server.bind(53)




