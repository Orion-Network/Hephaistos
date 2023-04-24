const async = require('async');
const fs = require('fs')
const fse = require('fs-extra')
const sharp = require('sharp')
const {createCanvas, loadImage} = require('canvas')
const recursive_search = require('../utils/recursive_search.js')

var armors = {}

function build_fancyPants(build_name) {
    return new Promise((resolve, reject) => {
        async.waterfall([
            (callback) => {
                if(fs.existsSync(process.cwd()+`/fancyPants/README.md`))
                    callback(null)
                else
                    reject("fancyPants not found, please build submodules first")
            }, (callback) => {
                fse.copy(process.cwd()+`/fancyPants/assets/minecraft/shaders`, process.cwd()+`/build/${build_name}/assets/minecraft/shaders`, {overwrite: false}, (err) => {
                    if(err) console.log(err)
                    callback(null)
                })
            }, (callback) => {
                if(!fs.existsSync(process.cwd()+`/build/${build_name}/assets/minecraft/textures/models/armor`)) {
                    fs.mkdirSync(process.cwd()+`/build/${build_name}/assets/minecraft/textures/models/armor`, {recursive: true}, (err) => {
                        if(err) console.log(err)
                    })
                }

                fse.copyFile(process.cwd()+`/fancyPants/assets/minecraft/textures/models/armor/leather_layer_1_overlay.png`, process.cwd()+`/build/${build_name}/assets/minecraft/textures/models/armor/leather_layer_1_overlay.png`, (err) => {
                    if(err) console.log(err)
                    fse.copyFile(process.cwd()+`/fancyPants/assets/minecraft/textures/models/armor/leather_layer_2_overlay.png`, process.cwd()+`/build/${build_name}/assets/minecraft/textures/models/armor/leather_layer_2_overlay.png`, (err) => {
                        if(err) console.log(err)
                        callback(null)
                    })
                })
            }, (callback) => {
                recursive_search(process.cwd()+`/assets/textures/armor`).then((files) => {
                    callback(null, files)
                })
            }, (files, callback) => {
                delete files.length
                let max = 1
                async.forEachOf(files, (file, index, callback1) => {
                    let json;
                    if(file[file.length-1].name == "config.json") {
                        json = require(process.cwd() + "" + file[file.length-1].path+"/config.json")
                        if(json.animation.frames > max)
                            max = json.animation.frames
                    }
                    callback1(null)
                }, (err) => {
                    if(err) console.log(err)
                    callback(null, files, max)
                })

            }, (files, max, callback) => {
                let height = (max)
                let width = (1 + Object.keys(files).length)
                let image = sharp({
                    create: {
                        width: 64*width,
                        height: 32*height,
                        channels: 4,
                        background: {r: 0, g: 0, b: 0, alpha: 0}
                    }})

                let layer_1 = [{input: process.cwd()+`/fancyPants/assets/minecraft/textures/models/armor/template/leather_layer_1.png`, top: 0, left: 0}]
                let layer_2 = [{input: process.cwd()+`/fancyPants/assets/minecraft/textures/models/armor/template/leather_layer_2.png`, top: 0, left: 0}]
                let configs = []
                let i = 1;
                async.forEachOf(files, (file, index, callback1) => {
                    let json = require(process.cwd() + "" + file[file.length-1].path+"/config.json");
                    configs.push(json)
                    async.forEachOf(file, (item, index1, callback2) => {
                        if(item.name.endsWith(".png")) {
                            let position = parseInt(item.name.split("_")[0])
                            if(item.name.split("_")[1] == "1.png") {
                                layer_1.push({input: process.cwd() + "" + item.path + "/" + item.name, top: 32*(position-1), left: 64*(i)})
                            } else if(item.name.split("_")[1] == "2.png") {
                                layer_2.push({input: process.cwd() + "" + item.path + "/" + item.name, top: 32*(position-1), left: 64*(i)})
                            }
                        }
                        callback2(null)
                    }, (err) => {
                        if(err) console.log(err)
                    });
                    i++;
                    callback1(null);
                }, (err) => {
                    if(err) console.log(err)
                    callback(null, image, layer_1, layer_2, configs)
                })
            }, (image, layer_1, layer_2, configs, callback) => {
                drawFromLayer(build_name, image, layer_1, 1, configs, (err) => {
                    if(err) console.log(err)
                    drawFromLayer(build_name, image, layer_2, 2, configs, (err) => {
                        if(err) console.log(err)
                        callback(null)
                    })
                })
            }
        ], (err) => {
            if(err) reject(err)
            else resolve()
        })
    }).catch(
        (err) => {
            console.log(err)
        }
    )
}

function drawFromLayer(build_name, image, layer,layer_id , configs, callback) {
    image.composite(layer).toFile(process.cwd()+`/build/${build_name}/assets/minecraft/textures/models/armor/leather_layer_${layer_id}.png`, (err) => {
        if(err) console.log(err)
        loadImage(process.cwd()+`/build/${build_name}/assets/minecraft/textures/models/armor/leather_layer_${layer_id}.png`).then((image) => {
            //Draw pixel on loaded image
            const canvas = createCanvas(image.width, image.height)
            const ctx = canvas.getContext('2d')

            ctx.drawImage(image, 0, 0, image.width, image.height)
            
            async.forEachOf(configs, (config, index, callback1) => {
                let x = (index+1) * 64
                let y = 0
            
                ctx.fillStyle = `rgba(${config.color.red}, ${config.color.green}, ${config.color.blue}, 1)`
                ctx.fillRect(x, y, 1,1)

                ctx.fillStyle = `rgba(${config.animation.frames}, ${config.animation.speed}, ${config.animation.interpolation}, 1)`
                ctx.fillRect(x+1, y, 1, 1)

                ctx.fillStyle = `rgba(${config.extra.emisivity}, ${config.extra.tint}, 0, 1)`
                ctx.fillRect(x+2, y, 1, 1)

                callback1(null)
            })

            fs.writeFileSync(process.cwd()+`/build/${build_name}/assets/minecraft/textures/models/armor/leather_layer_${layer_id}.png`, canvas.toBuffer('image/png'))

        })
        callback(null)
    })
}

module.exports = build_fancyPants