const fse = require("fs-extra")
const fs = require("fs")

const json = {}

function build_mcmeta(build_name, pack_identifier, version, description) {
    json.pack = {
        pack_format: version,
        description: description,
    }

    fs.mkdir(process.cwd()+`/build/${build_name}/assets/${pack_identifier}`, {recursive: true}, (err) => {
        if(err) console.log(err)
        fs.writeFile(process.cwd()+`/build/${build_name}/pack.mcmeta`, JSON.stringify(json, null, 4), (err) => {
            if(err) console.log(err)
        })
        fs.copyFile(process.cwd()+`/assets/sample/icon.png`, process.cwd()+`/build/${build_name}/pack.png`, (err) => {
            if(err) console.log(err)
        })
    })

    console.log(`${pack_identifier} pack generated`)
}

module.exports = build_mcmeta
