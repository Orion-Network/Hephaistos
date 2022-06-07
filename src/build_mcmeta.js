const json = {}

function build_mcmeta(description) {
    json.pack.pack_format = 7
    json.pack.description = params.description
}

module.exports = {
    build_mcmeta
}