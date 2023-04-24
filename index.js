const async = require("async");
const fs = require("fs");
const inquirer = require('inquirer');

const {multi_bar} = require("./src/utils/progress_bar");

const build_details = require("./src/builds/build_details")
const build_sounds = require('./src/builds/build_sounds');
const build_item_textures = require('./src/builds/build_item_textures');
const build_nsft = require('./src/builds/build_nsft');
const build_fonts = require('./src/builds/build_fonts');
const build_gui = require('./src/builds/build_gui');

inquirer.prompt([
    {
        type: 'checkbox',
        name: 'build_list',
        message: 'Wich properties do you want to build?',
        choices: [
            {name: 'Item Textures', value: 'item_textures'},
            {name: 'Gui Textures', value: 'gui_textures'},
            {name: 'Sounds', value: 'sounds'},
            {name: 'Fonts', value: 'fonts'},
            {name: 'NegativeSpaceFont', value: 'nsft'},
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
        answers.identifier = answers.identifier.replaceAll(" ", "_").toLowerCase();
        //multi_bar.log()
        if(!answers.build_ready)
            return
        async.waterfall([
            (callback) => {
                if(fs.existsSync(`./build/${answers.build_name}`)) {
                    console.log("Build already exists")
                    fs.rm(`./build/${answers.build_name}`, {recursive: true}, (err) => {
                        if(err) console.log(err)
                        callback(null)
                    })
                } else {
                    callback(null)
                }
            },
            (callback) => {
                if(answers.build_list.includes('item_textures'))
                    build_item_textures(answers.build_name, answers.identifier).then(() => {callback(null)})
                else
                    callback(null)
            },
            (callback) => {
                if(answers.build_list.includes('gui_textures'))
                    build_gui(answers.build_name, answers.identifier).then(() => {callback(null)})
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
                if(answers.build_list.includes('fonts'))
                    build_fonts(answers.build_name, answers.identifier).then(() => {callback(null)})
                else
                    callback(null)
            },
            (callback) => {
                if(answers.build_list.includes('nsft'))
                    build_nsft(answers.build_name).then(() => {callback(null)})
                else
                    callback(null)
            },
            (callback) => {
                build_details(answers.build_name, answers.identifier, answers.version, answers.author, answers.description, answers.build_list).then(() => {callback(null)})
            }
        ], (err) => {
            if(err) console.log(err)
            multi_bar.stop()
            console.log("Build finished")
        })
    })