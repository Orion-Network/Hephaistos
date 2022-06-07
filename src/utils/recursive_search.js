const fs = require('fs').promises;
const path = require('path');

const files = {}
async function recursive_search(dir) {
    const dirs = await fs.readdir(dir, {withFileTypes: true});
    return new Promise((resolve, reject) => {
        for(const file of dirs) {
            if(file.isDirectory())
                resolve(recursive_search(path.join(dir, file.name)))
            else {
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