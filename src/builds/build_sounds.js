const {promisify} = require('util');
const async = require('async');
const fs = require("fs")
const fse = require("fs-extra")
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const recursive_search = require("../utils/recursive_search");
const {multi_bar} = require('../utils/progress_bar');
const { conflictResolvers } = require('merge-dirs');

//const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
ffmpeg.setFfmpegPath(ffmpegPath);

let sound_json;

function generate_json(dir, pack_identifier, search_result) {
    for(let key in search_result) {
        let identifier = key.replace(dir,'').replaceAll("/", ".").replace(".assets.sounds.", '');
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
                    callback(null, search_result)
                })
            },
            (search_result, callback) => {
                fs.writeFile(process.cwd()+`/build/${build_name}/assets/${pack_identifier}/sounds.json`, JSON.stringify(sound_json, null, 4), (err) => {
                    if(err) console.log(err)
                    sound_bar.increment()
                    callback(null, search_result)
                })
            },
            (search_result, callback) => {
                async.forEachOf(search_result, (value, key, callback) => {
                    async.forEachOf(value, (sound, sound_key, callback) => {
                        if(sound.name.endsWith(".ogg")) {
                            console.log(`Copying ${sound.name}`)
                            fs.mkdir(process.cwd()+`/build/${build_name}/assets/${pack_identifier}/${sound.path.replace("/assets/","")}/`, {recursive: true}, (err) => {
                            if(err) reject(err)
                                fse.copyFile(process.cwd()+sound.path+"/"+sound.name, process.cwd()+`/build/${build_name}/assets/${pack_identifier}/${sound.path.replace("/assets/","")}/${sound.name}`, (err) => {
                                    if(err) console.log(err)
                                    sound_bar.increment()
                                    callback(null)
                                })
                            })
                        } else {
                            console.log(`Converting ${sound.name} to an ogg file`)
                            fs.mkdir(process.cwd()+`/build/${build_name}/assets/${pack_identifier}/${sound.path.replace("/assets/","")}/`, {recursive: true}, (err) => {
                                if(err) reject(err)
                                ffmpeg()
                                .input(process.cwd()+sound.path+"/"+sound.name)
                                .format("ogg")
                                .output(process.cwd()+`/build/${build_name}/assets/${pack_identifier}/${sound.path.replace("/assets/","")}/${sound.name.replace(/\.[^/.]+$/, ".ogg")}`)
                                .on('end', () => {
                                    callback(null)
                                }).on('error', (err) => {
                                    reject(err)
                                })
                                .run()
                            })
                        }
                        
                    }, (err) => {
                        if(err) console.log(err)
                        callback(null)
                    })
                }, (err) => {
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