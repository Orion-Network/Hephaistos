const async = require('async')
const fse = require("fs-extra")
const fs = require("fs")

const json = {}

function build_mcmeta(build_name, pack_identifier, version, author, description) {
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
                fs.copyFile(process.cwd()+`/assets/sample/icon.png`, process.cwd()+`/build/${build_name}/pack.png`, (err) => {
                    if(err) console.log(err)
                    callback(null)
                })
            }
        ], (err) => {
            if(err) reject(err)
            console.log(`${pack_identifier} pack generated`)
            resolve()
        })
    })
}

module.exports = build_mcmeta
