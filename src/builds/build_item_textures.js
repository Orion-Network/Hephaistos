/*
Build all models from textures files with default values, and save them in the models folder.
Override basic model file assiciated with associations.json who repertories all models.
*/
const fs = require("fs")
const fse = require("fs-extra")
const {waterfall, forEachOf} = require("async")

const recursive_search = require("../utils/recursive_search.js")
const {multi_bar} = require("../utils/progress_bar.js")
const yeml_association = require("../yaml_association.js")

const Type = {
    MODEL: "model",
    PARENT: "parent"
}

function generate_path(pack_identifier, path, texture_name) {
    return `${pack_identifier}:${path}/${texture_name.replace(".png","")}`
}

function generate_json(pack_identifier, path, texture_name, model) {
    return new Promise((resolve, reject) => {
        if(model.type === Type.MODEL) {
            if(!model.path.startsWith(process.cwd())) {
                fs.readFile(`assets/textures/item/${model.path}`, (err, data) => {
                    if(err) {
                        reject(err)
                    }
                    else {
                        let json = JSON.parse(data)
                        json.textures = {layer0: generate_path(pack_identifier, path, texture_name)}
                        resolve(json)
                    }
                })
            } else {
                fs.readFile(model.path, (err, data) => {
                    if(err) {
                        reject(err)
                    }
                    else {
                        let json = JSON.parse(data)
                        json.textures = {layer0: generate_path(pack_identifier, path, texture_name)}
                        resolve(json)
                    }
                })
            }
        } else if(model.type === Type.PARENT) {
            resolve( {parent: model.model, textures: {layer0: generate_path(pack_identifier, path, texture_name)}})
        } 
    })
}


function build_textures(build_name, pack_identifier) {
    const dir = `/assets/textures/item/`;
    const associations = require(process.cwd()+"/assets/config/tm_associations.json")
    const texture_bar = multi_bar.create(4, 0, null, {format: "Building Textures [{bar}] {percentage}% | {value}/{total}"})
    return new Promise((resolve, reject) => {
        waterfall([
            (callback) => {
                recursive_search(process.cwd()+dir, {}).then((search_result) => {
                    texture_bar.increment()
                    callback(null, search_result)
                })
            }, (search_result, callback) => {
                
                texture_bar.setTotal(search_result.length + 2)
                delete search_result.length
            
                forEachOf(search_result, (value, key, callback1) => {
                    let key_association = associations[key.replace(dir, '').replaceAll("/", ".")]
                    if(!associations.hasOwnProperty(key.replace(dir, '').replaceAll("/", "."))) {
                        console.log(`${key.replace(dir, '').replaceAll("/", ".")} is not associated to any model`)
                    }
                    let parent_json = {parent: "item/handheld", textures:{layer0: key_association.parent}, overrides: []}
                    let i = 0;
                    for(let item in search_result[key]) {
                        let path = search_result[key][item].path.replace(dir, '')
                        let texture_name = search_result[key][item].name
                        if(!texture_name.endsWith(".png"))
                            continue
                        parent_json.overrides.push({predicate: {custom_model_data: ++i}, model: generate_path(pack_identifier, path, texture_name)})
                        yeml_association.addElement('item',`${path}/${texture_name.replace(".png","")}`, i)
                        let model_path = undefined
                        if(key_association.hasOwnProperty("model"))
                            model_path = process.cwd()+`/assets/models/${key_association.model}.json`
                        if(fs.existsSync(process.cwd()+`/assets/textures/item/${path}/${texture_name.replace('.png','.json')}`))
                            model_path = `${path}/${texture_name.replace('.png','.json')}`
                        generate_json(pack_identifier, path, texture_name, (model_path != undefined ? {type: Type.MODEL, path:model_path} : {type: Type.PARENT, model:key_association.parent})).then((json) => {
                            fs.mkdir(process.cwd()+`/build/${build_name}/assets/${pack_identifier}/models/${key.replace(dir,'')}`, {recursive: true}, (err) => {
                                fs.writeFile(process.cwd()+`/build/${build_name}/assets/${pack_identifier}/models/${key.replace(dir,'')}/${search_result[key][item].name.replace(".png","")}.json`, JSON.stringify(json, null, 4), (err) => {
                                    if(err) console.log(err)
                                    texture_bar.increment()
                                })
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
                    texture_bar.increment()
                    callback(null)
                })
            },
            (callback) => {
                fse.copy(process.cwd()+dir, process.cwd()+`/build/${build_name}/assets/${pack_identifier}/textures/`, {overwrite: false}, (err) => {
                    if(err) console.log(err)
                    texture_bar.increment()
                    callback(null)
                })
            }
        ], (err) => {
            if(err) reject(err)
            texture_bar.stop()
            resolve()
        })
    })
}

module.exports = build_textures