const build_mcmeta = require("./src/build_mcmeta")
const build_sounds = require('./src/build_sounds');
const build_item_textures = require('./src/build_item_textures');

build_item_textures("s_test", "orion")

/*build_sounds("s_test", "orion", {}).then(() => {
    console.log("sounds generated")
})

build_mcmeta("s_test", "orion", 7, "A test pack")*/