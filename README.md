# Hephaistos
## How to use
1. Create textures for your pack
In first we will look at the textures folder in assets,
the texture folder will store every texture you want to use in your resource pack, structure of the folder is the same as minecraft default texture folder with only item (for now)
    1. Item folder
        Item folder will store every of your item texture, for example if you want multiple iron sword you will make a folder like that
        ```
            textures/item/iron_sword/
                                iron_sword_1.png
                                red_iron_sword_2.png
        ```
        But you can have multiple sub-folder for example for food
        ```
            textures/food/
                        beef/
                            beef_1.png
                            beef_2.png
                        bread/
                            blue_bread_1.png
                            bread_2.png
        ```
2. Create sounds for your pack
Next we will look at the sounds folder in assets,
sounds folder architexture is like that
```
sounds/sub_folder/
            sub_folder/
                random.ogg
                random_2.ogg
            sub_folder_2/
                random.ogg
```

so for example if we have some mobs and ambient sounds we can use an architeture like

```
sounds/
        mob/
            zombie/
                zombie_1.ogg
                zombie_2.ogg
            skeleton/
                skeleton_1.ogg
                skeleton_2.ogg
        ambient/
            ambient_1.ogg
            ambient_2.ogg
```

3. Models for your pack
Models will be a little more complicated, we have 2 type, per textures models and per folder models, per texture will be located in the textures folder and will have the same name as your png and per folder will be located in the models folder
    1. Per texture model
        This one is pretty easy it will be the model you want for your textures so if you want a big iron sword your architecture will be like that
        ```
            textures/item/iron_sword/
                                iron_sword.png
                                big_iron_sword.png
                                big_iron_sword.json
        ```
        So only the big_iron_sword will have the custom texture

    2. Per models textures
        Here it's more complicated and will require to read next part to be functionnal, so here your wole will have the custom texture example
        ```
            textures/item/swords/
                            big_swords/
                                    big_blue_sword.png
                                    big_red_sword.png
                            small_swords/
                                    small_blue_sword.png
                                    small_red_sword.png
            models/big_iron_sword.json
        ```
        For now it will not work because we need another file, the assiociation.json
4. Texture Model Associations file
In your config folder you need to create an tm_associations.json which will associate your folder with your model or parent and wich item you will override so if you want a big red sword and a big blue sword as iron swords and a small blue sword and small red sword as wooden sword your file will look like that
    ```
        {
            "swords.big_swords": {
                "name": "iron_sword",
                "model": "big_iron_sword"
            },
            "swords.small_swords": {
                "name": "wooden_sword",
                "parent": "item/wooden_sword"
            }
        }
    ```
So here it will create a big sword who will override the model of iron sword and will add the new textures and for small swords it will only add the new textures to the wooden sword.
4. Fonts folder
Here is an interesting part it stand to add custom font to your pack as for emoji or custom gui
it's a bit like for textures but without models or associations you will only need to add your image to a subfolder of fonts
so it will look like that 
```
fonts/
    emojis/
        emoji_1.png
        emoji_2.png
    gui/
        gui.png
```
5. Sample folder
Here you only need to put the logo of your pack in a png named icon.png
6. Building The Pack
Here we will explain how you pack will build
    1. Run npm start
    2. Choose wich option you want to build
        1. Negative Space Font
            If tou choose NegativeSpaceFont it will add NegativeSpaceFont from AmberW to your pack so you will have negative spaces
        2. Textures and models
            Here it will look for every textures and models and create models in the minecraft folder of your pack and in your pack namespace and put textures in your namespace textures folder
        3. Sounds
            Here it will look for every sounds and put sounds in your pack namespace sounds folder and create your sounds.json file
        4. Fonts
            Here it will look for every fonts and put them in your pack namespace font folder and create your fonts.json file
    3. Choose build name
        With that you can have different pack for example if you want Textures+Fonts but no sounds for lighter pack
    4. Name of the pack
        It will be the name saw in the resource pack selection in mc
    5. Version of the pack
    6. Author of the pack
    7. Description of the pack
    8. Confirm build
1. Post-Build Info
So in your build folder will be your build with fex extra file
    1. Credits
        It will have some credits, please dont delete theme to support us
    2. Associations
        associations.yml is a little trick to maintain your pack if you use custom models in plugin with it you will only need to load the Yml file and instead of setting model data manually in your plugin you use the configuration so you can easily maintain your pack and dont have to change your plugin code if some models are added
1. End
Now grab your pack and enjoy

## TODO

## Credits
Thanks to [AmberW](https://github.com/AmberWat/) for [NegativeSpaceFont](https://github.com/AmberWat/NegativeSpaceFont)
## Licence