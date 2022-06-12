const async = require('async');
const fs = require('fs')
const fse = require('fs-extra')


function build_nsft(build_name) {
    return new Promise((resolve, reject) => {
        async.waterfall([
            (callback) => {
                if(fs.existsSync(process.cwd()+`/NegativeSpaceFont/README.md`))
                    callback(null)
                else
                    reject("NegativeFontSpace not found, please build submodules first")
            }, (callback) => {
                fse.copy(process.cwd()+`/NegativeSpaceFont/assets/`, process.cwd()+`/build/${build_name}/assets`, {overwrite: false}, (err) => {
                    if(err) console.log(err)
                    callback(null)
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

module.exports = build_nsft