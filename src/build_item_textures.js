/*
Build all models from textures files with default values, and save them in the models folder.
Override basic model file assiciated with associations.json who repertories all models.
*/
const recursive_search = require("./utils/recursive_search.js")
const fs = require("fs")
const fse = require("fs-extra")
const async = require("async")

function generate_path(pack_identifier, path, texture_name) {
    return `${pack_identifier}:${path}/${texture_name.replace(".png","")}`
}

function generate_json(pack_identifier, path, texture_name) {
    return {parent: "item/handheld", textures: {layer0: generate_path(pack_identifier, path, texture_name)}}
    
}


function build_textures(build_name, pack_identifier) {
    const dir = `/assets/textures/item/`;
    const associations = require(process.cwd()+"/assets/config/tm_associations.json")
    return new Promise((resolve, reject) => {
        async.waterfall([
            (callback) => {
                console.log("searching textures...")
                recursive_search(process.cwd()+dir, {}).then((search_result) => {
                    console.log("textures found")
                    callback(null, search_result)
                })
            }, (search_result, callback) => {
                console.log("generating json...")
                async.forEachOf(search_result, (value, key, callback1) => {
                    let key_association = associations[key.replace(dir, '').replaceAll("/", ".")]
                    if(!associations.hasOwnProperty(key.replace(dir, '').replaceAll("/", "."))) {
                        console.log(`${key.replace(dir, '').replaceAll("/", ".")} is not associated to any model`)
                    }
                    let parent_json = {parent: "item/handheld", textures:{layer0: key_association.model}, overrides: []}
                    let i = 1;
                    for(let item in search_result[key]) {
                        let path = search_result[key][item].path.replace(dir, '')
                        let texture_name = search_result[key][item].name
                        parent_json.overrides.push({predicate: {custom_model_data: i++}, model: generate_path(pack_identifier, path, texture_name)})

                        let json = generate_json(pack_identifier, path, texture_name)
                        fs.mkdir(process.cwd()+`/build/${build_name}/assets/${pack_identifier}/models/${key.replace(dir,'')}`, {recursive: true}, (err) => {
                            fs.writeFile(process.cwd()+`/build/${build_name}/assets/${pack_identifier}/models/${key.replace(dir,'')}/${search_result[key][item].name.replace(".png","")}.json`, JSON.stringify(json, null, 4), (err) => {
                                if(err) console.log(err)
                            })
                        })
                    }
                    fs.mkdir(process.cwd()+`/build/${build_name}/assets/minecraft/models/item/`, {recursive: true}, (err) => {
                        if(err) console.log(err)
                        fs.writeFile(process.cwd()+`/build/${build_name}/assets/minecraft/models/item/${key_association.name}.json`, JSON.stringify(parent_json, null, 4), (err) => {
                            if(err) console.log(err)
                            callback1()
                        })
                    })
                }, (err) => {
                    if(err) reject(err)
                    callback(null)
                })
            },
            (callback) => {
                fse.copy(process.cwd()+dir, process.cwd()+`/build/${build_name}/assets/${pack_identifier}/textures/`, (err) => {
                    if(err) console.log(err)
                    console.log("textures copied")
                    callback(null)
                })
            }
        ], (err) => {
            if(err) reject(err)
            console.log("textures built")
            resolve()
        })
    })
}

module.exports = build_textures