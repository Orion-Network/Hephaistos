const async = require("async");
const {promisify} = require('util');
const readdir = promisify(require("fs").readdir)
const path = require('path');

const files = {}
async function recursive_search(dir) {
    const dirs = await readdir(dir, {withFileTypes: true});

    return new Promise((resolve, reject) => {
        async.forEachOf(dirs, (file, key, callback) => {
            if(file.isDirectory()) {
                recursive_search(path.join(dir, file.name)).then(() => {
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
            if(err) reject(err)
            resolve(files)
        })
    })

    return new Promise((resolve, reject) => {
        console.log(dirs)
        for(const file of dirs) {
            if(file.isDirectory()) {
                resolve(recursive_search(path.join(dir, file.name)))
            } else {
                const file_path = dir.replace(process.cwd(), "").replace(/\\/g, "/");
                if(!files.hasOwnProperty(file_path)) {
                    files[`${file_path}`] = []
                }
                files[`${file_path}`].push({name: file.name, path: file_path});
            }
        }
        resolve(files)
    })
    
}

module.exports = recursive_search;