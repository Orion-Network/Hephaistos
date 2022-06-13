const fs = require("fs")
const fse = require("fs-extra")
const {waterfall, forEachOf} = require("async")

const recursive_search = require("../utils/recursive_search.js")
const {multi_bar} = require("../utils/progress_bar.js")

function generate_path(pack_identifier, path, texture_name) {
    return `${pack_identifier}:${path}/${texture_name}`
}

function generate_json(type, path, ascent, height, char) {
    return {type:type, file:path, ascent:ascent, height:height, chars:[char]}
}

function build_fonts(build_name, pack_identifier) {
    const dir = `/assets/fonts/`;
    //const associations = require(process.cwd()+"/assets/config/tm_associations.json")
    //const font_bar = multi_bar.create(4, 0, null, {format: "Building Fonts [{bar}] {percentage}% | {value}/{total}"})
    return new Promise((resolve, reject) => {
        waterfall([
            (callback) => {
                recursive_search(process.cwd()+dir, {}).then((search_result) => {
                    //font_bar.increment()
                    callback(null, search_result)
                })
            },
            (search_result, callback) => {
                const result = {}
                forEachOf(search_result, (file, key, callback) => {
                    let i = 0;
                    const parent_json = {providers:[]}
                    forEachOf(file, (value, key1, callback) => {
                        let hex = i.toString(16)
                        //if(hex.length > 4) callback(null, null)
                        const path = generate_path(pack_identifier,'font_texture/' + key.replace(dir, ''), value.name)
                        const unicode = "0".repeat(parseInt(4 - hex.length)) + hex
                        const json = generate_json("bitmap", path, 5, 8, String.raw`(@)${unicode}`)
                        parent_json.providers.push(json)
                        callback(null, json)
                        i++
                    }, (err) => {
                        if(err) reject(err)
                        else callback()
                    })
                    result[key] = parent_json
                }, (err) => {
                    if(err) reject(err)
                    else callback(null, result)
                })
            }, (result, callback) => {
                forEachOf(result, (value, key, callback) => {
                    fs.mkdir(process.cwd()+`/build/${build_name}/assets/${pack_identifier}/font/`, {recursive: true}, (err) => {
                        if(err) reject(err)
                        let a = String.raw`\u`
                        fs.writeFile(process.cwd()+`/build/${build_name}/assets/${pack_identifier}/font/${key.replace(dir, '')}.json`, JSON.stringify(value, null, 4).replaceAll('(@)', a), (err) => {
                            if(err) reject(err)
                            else callback()
                        })
                    })
                }, (err) => {
                    if(err) reject(err)
                    callback(null)
                })
            },
            (callback) => {
                fs.mkdir(process.cwd()+`/build/${build_name}/assets/${pack_identifier}/textures/font_texture/`, {recursive: true}, (err) => {
                    fse.copy(process.cwd()+dir, process.cwd()+`/build/${build_name}/assets/${pack_identifier}/textures/font_texture/`, (err) => {
                        if(err) reject(err)
                        callback()
                    })
                })
            }
        ], (err, result) => {
            if(err) {
                reject(err)
            }
            console.log("Fonts Built")
            //font_bar.stop()
            resolve(result)
        })
    })
}

module.exports = build_fonts