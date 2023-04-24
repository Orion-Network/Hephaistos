const fs = require('fs')
const fse = require('fs-extra')

const {waterfall, forEachOf} = require('async')

const recursive_search = require('../utils/recursive_search.js')

const {multi_bar} = require('../utils/progress_bar.js')

function build_gui(build_name, pack_identifier) {
    return new Promise((resolve, reject) => {
        waterfall([
            (callback) => {
                recursive_search(process.cwd() + '/assets/gui/').then((search_result) => {
                    callback(null, search_result)
                })
            },
            (search_result, callback) => {
                //Create subdir then copy files
                const gui_bar = multi_bar.create(search_result.length + 1, 0, null, {format: "Building GUI [{bar}] {percentage}% | {value}/{total}"})
                delete search_result.length
                forEachOf(search_result, (value, key, callback1) => {
                    fs.mkdir(process.cwd() + `/build/${build_name}/assets/minecraft/gui/${key.replace('/assets/gui/', '')}`, {recursive: true}, (err) => {
                        if(err) reject(err)
                        gui_bar.increment()
                        callback1()
                    })
                }, (err) => {
                    if(err) reject(err)
                    gui_bar.increment()
                    callback(null, search_result)
                })
            },
            (search_result, callback) => {
                //Copy files
                const gui_bar = multi_bar.create(search_result.length + 1, 0, null, {format: "Building GUI [{bar}] {percentage}% | {value}/{total}"})
                delete search_result.length
                forEachOf(search_result, (value, key, callback1) => {
                    forEachOf(value, (value1, key1, callback2) => {
                        fse.copy(process.cwd() + `${value1.path}/${value1.name}`, process.cwd() + `/build/${build_name}/assets/minecraft/textures/gui/${value1.path.replace('/assets/gui/', '')}/${value1.name}`,
                        {overwrite: true},
                         (err) => {
                            if(err) reject(err)
                            gui_bar.increment()
                            callback2()
                         })
                    })
                    callback1()
                }, (err) => {
                    if(err) reject(err)
                    gui_bar.increment()
                    callback()
                })
            }
        ], (err) => {
            if(err) reject(err)
            resolve()
        })
    })
}

module.exports = build_gui