const async = require("async");
const inquirer = require('inquirer');

const build_mcmeta = require("./src/build_mcmeta")
const build_sounds = require('./src/build_sounds');
const build_item_textures = require('./src/build_item_textures');


inquirer.prompt([
    {
        type: 'checkbox',
        name: 'build_list',
        message: 'Wich properties do you want to build?',
        choices: [
            {name: 'Item Textures', value: 'item_textures'},
            {name: 'Gui Textures', value: 'gui_textures'},
            {name: 'Sounds', value: 'sounds'},
            {name: 'Langs', value: 'langs'},
        ]
    },
    {
        type: 'input',
        name: 'build_name',
        message: 'What is the name of the build?',
    },
    {
        type: 'input',
        name: 'identifier',
        message: 'Name of the pack',
    },
    {
        type: 'list',
        name: 'version',
        message: 'Which version of the pack do you want to build?',
        choices: [
            {name: '1.17-1.17.1', value: 7},
            {name: '1.18-1.18.2', value: 8},
            {name: '1.19', value: 9},
        ]
    },
    {
        type: 'input',
        name: 'author',
        message: 'Author of the pack',
    },
    {
        type: 'input',
        name: 'description',
        message: 'Description of the pack',
    },
    {
        type: 'confirm',
        name: 'build_ready',
        message: 'Are you ready to build?',
        default: true
    }]).then((answers) => {
        console.log(answers)
        answers.identifier = answers.identifier.replaceAll(" ", "_").toLowerCase();
        if(!answers.build_ready)
            return
        async.waterfall([
            (callback) => {
                if(answers.build_list.includes('item_textures'))
                    build_item_textures(answers.build_name, answers.identifier).then(() => {callback(null)})
                else
                    callback(null)
            },
            (callback) => {
                if(answers.build_list.includes('gui_textures'))
                    callback(null)
                else
                    callback(null)
            },
            (callback) => {
                if(answers.build_list.includes('sounds'))
                    build_sounds(answers.build_name, answers.identifier).then(() => {callback(null)})
                else
                    callback(null)
            },
            (callback) => {
                if(answers.build_list.includes('langs'))
                    callback(null)
                else
                    callback(null)
            },
            (callback) => {
                build_mcmeta(answers.build_name, answers.identifier, answers.version, answers.author, answers.description).then(() => {callback(null)})
            }
        ])
    })

/*

build_sounds("s_test", "orion").then(() => {
    console.log("sounds generated")
})

build_mcmeta("s_test", "orion", 7, "A test pack")*/