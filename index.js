const build_mcmeta = require("./src/build_mcmeta")
const build_sounds = require('./src/build_sounds');
const build_textures = require('./src/build_textures');

build_textures("s_test", "orion")

//build_sounds("s_test", "orion", {});

build_mcmeta("s_test", "orion", 7, "A test pack")