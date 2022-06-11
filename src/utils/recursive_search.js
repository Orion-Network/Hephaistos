const async = require("async");
const {promisify} = require('util');
const readdir = promisify(require("fs").readdir)
const path = require('path');
const { resolve } = require("path");

function recursive_search(dir, files) {
    return new Promise((resolve, reject) => {
        async.waterfall([
            (callback) => {
                readdir(dir, {withFileTypes: true}).then((dirs) => {
                    callback(null, dirs)
                })
            }, (dirs, callback1) => {
                async.forEachOf(dirs, (file, key, callback) => {
                    if(file.isDirectory()) {
                        recursive_search(path.join(dir, file.name), files).then(() => {
                            callback();
                        })
                    } else {
                        const file_path = dir.replace(process.cwd(), "").replace(/\\/g, "/");
                        if(!files.hasOwnProperty(file_path)) {
                            files[`${file_path}`] = []
                        }
                        files[`${file_path}`].push({name: file.name, path: file_path});
                        callback();
                    }
                }, (err) => {
                    if(err) console.log(err)
                    callback1(files)
                })
            }
        ], (files) => {
            resolve(files)
        })
    })
}

module.exports = recursive_search;