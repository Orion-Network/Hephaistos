const {promisify} = require('util');
const async = require('async');
const fs = require("fs")
const fse = require("fs-extra")
const recursive_search = require("./utils/recursive_search");
const {multi_bar} = require('./utils/progress_bar');

//const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

let sound_json;

function generate_json(dir, pack_identifier, search_result) {
    for(let key in search_result) {
        let identifier = key.replace(dir,'').replaceAll("/", ".");
        if(!sound_json.hasOwnProperty(identifier))
            sound_json[identifier] = {replace: true, sounds: []};
        for(let sound in search_result[key]) {
            sound_json[identifier].sounds.push({name:`${pack_identifier}:${search_result[key][sound].path.replace(dir, '')}/${search_result[key][sound].name.replace(".ogg","")}`});
        }
    }   

}

function build_sounds(build_name, pack_identifier) {
    sound_json = {}
    const dir = "/assets/sounds/"
    const sound_bar = multi_bar.create(4, 0, null, {format: "Building Sounds [{bar}] {percentage}% | {value}/{total}"})
    return new Promise((resolve, reject) => {
        async.waterfall([
            (callback) => {
                recursive_search(process.cwd()+dir, {}).then((search_result) => {
                    sound_bar.increment()
                    callback(null, search_result)
                })
            },
            (search_result, callback) => {
                generate_json(process.cwd()+dir, pack_identifier, search_result)
                mkdir(process.cwd()+`/build/${build_name}/assets/${pack_identifier}`, {recursive: true}, (err) => {
                    if(err) reject(err)
                    sound_bar.increment()
                    callback(null)
                })
            },
            (callback) => {
                fs.writeFile(process.cwd()+`/build/${build_name}/assets/${pack_identifier}/sounds.json`, JSON.stringify(sound_json, null, 4), (err) => {
                    if(err) console.log(err)
                    sound_bar.increment()
                    callback(null)
                })
            },
            (callback) => {
                fse.copy(process.cwd()+`/assets/sounds`, process.cwd()+`/build/${build_name}/assets/${pack_identifier}/sounds/`,
                    (err) => {
                        if(err) console.log(err)
                        sound_bar.increment()
                        callback(null)
                    })
            }
        ], (err) => {
            if(err) reject(err)
            sound_bar.stop()
            resolve()
        })
    })
}

module.exports = build_sounds;