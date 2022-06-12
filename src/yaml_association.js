const yaml = require('yaml');
let json = {}

function addElement(identifier, key, value) {
    if(!json[identifier]) json[identifier] = {}
    json[identifier][key] = value
}

function get_yaml() {
    return yaml.stringify(json)
}

module.exports = {
    addElement,
    get_yaml
}