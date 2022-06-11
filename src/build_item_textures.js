/*
Build all models from textures files with default values, and save them in the models folder.
Override basic model file assiciated with associations.json who repertories all models.
*/
const recursive_search = require("./utils/recursive_search.js")
const fs = require("fs")
const fse = require("fs-extra")

function generate_path(pack_identifier, path, texture_name) {
    return `${pack_identifier}:${path}/${texture_name.replace(".png","")}`
}

async function generate_json(pack_identifier, path, texture_name) {
    return {parent: "item/handheld", textures: {layer0: generate_path(pack_identifier, path, texture_name)}}
    
}


async function build_textures(build_name, pack_identifier) {
    const dir = `/assets/textures/item/`;
    const associations = require(process.cwd()+"/assets/config/tm_associations.json")
    let search_result = await recursive_search(process.cwd()+dir)

    for(let key in search_result) {
        let key_association = associations[key.replace(dir, '').replaceAll("/", ".")]
        if(!associations.hasOwnProperty(key.replace(dir, '').replaceAll("/", "."))) {
            console.log(`${key.replace(dir, '').replaceAll("/", ".")} is not associated to any model`)
            continue
        }
        let parent_json = {parent: "item/handheld", textures:{layer0: key_association.model}, overrides: []}
        let i = 1;
        for(let item in search_result[key]) {
            let path = search_result[key][item].path.replace(dir, '')
            let texture_name = search_result[key][item].name
            parent_json.overrides.push({predicate: {custom_model_data: i++}, model: generate_path(pack_identifier, path, texture_name)})

            let json = await generate_json(pack_identifier, path, texture_name)
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
            })
        })
    }
    fse.copySync(process.cwd()+dir, process.cwd()+`/build/${build_name}/assets/${pack_identifier}/textures/`)
}

module.exports = build_textures