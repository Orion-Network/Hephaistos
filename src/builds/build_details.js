const async = require('async')
const fse = require("fs-extra")
const fs = require("fs")

const yaml_association = require('../yaml_association')

const json = {}

function build_details(build_name, pack_identifier, version, author, description, build_list) {
    json.pack = {
        pack_format: version,
        description: description,
        author: author,
    }
    return new Promise((resolve, reject) => {
        async.waterfall([
            (callback) => {
                fs.mkdir(process.cwd()+`/build/${build_name}/assets/${pack_identifier}`, {recursive: true}, (err) => {
                    if(err) console.log(err)
                    callback(null)
                })
            },
            (callback) => {
                fs.writeFile(process.cwd()+`/build/${build_name}/pack.mcmeta`, JSON.stringify(json, null, 4), (err) => {
                    if(err) console.log(err)
                    callback(null)
                })
            },
            (callback) => {
                let credits = `Pack generated with Hephaistos made by NEXOmega https://github.com/Orion-Network/Hephaistos\n`
                if(build_list.includes('nsft'))
                    credits += `Pack contains NegativeSpaceFont from AmberW https://github.com/AmberWat/NegativeSpaceFont\n`
                fs.writeFile(process.cwd()+`/build/${build_name}/credits.txt`, credits, (err) => {
                    if(err) console.log(err)
                    callback(null)
                })
            },
            (callback) => {
                fs.copyFile(process.cwd()+`/assets/sample/icon.png`, process.cwd()+`/build/${build_name}/pack.png`, (err) => {
                    if(err) console.log(err)
                    callback(null)
                })
            },
            (callback) => {
                fs.writeFile(process.cwd()+`/build/${build_name}/association.yaml`, yaml_association.get_yaml(), (err) => {
                    if(err) console.log(err)
                    callback(null)
                })
            }
        ], (err) => {
            if(err) reject(err)
            resolve()
        })
    })
}

module.exports = build_details
