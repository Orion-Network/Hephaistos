# Hephaistos

## How to Install
```
git clone https://github.com/Orion-Network/Hephaistos
cd Hephaistos
git submodule init && git submodule update
npm install
```

## How to use
### English

1. Create textures for your pack
In first we will look at the textures folder in assets,
the texture folder will store every texture you want to use in your resource pack, structure of the folder is the same as minecraft default texture folder with only item (for now)
    1. Item folder
        Item folder will store every of your item texture, for example if you want multiple iron sword you will make a folder like that
        ```
            textures/item/swords/iron_sword/
                                iron_sword.png
                                red_iron_sword.png
        ```
        But you can have multiple sub-folder for example for food
        ```
            textures/food/
                        beef/
                            beef_1.png
                            beef_2.png
                        bread/
                            bread_1.png
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
            dog/
                dog_1.ogg
                dog_2.ogg
        ambient/
            river.ogg
            forest.ogg
```

3. Models for your pack
Models will be a little more complicated, we have 2 type, per textures models and per folder models, per texture will be located in the textures folder and will have the same name as your png and per folder will be located in the models folder
    1. Per texture model
        This one is pretty easy it will be the model you want for your textures so if you want a big iron sword your architecture will be like that
        ```
            textures/item/swords/iron_sword/
                                iron_sword.png
                                big_iron_sword.png
                                big_iron_sword.json
        ```
        So only the big_iron_sword will have the custom texture

    2. Per models textures
        Here it's more complicated and will require to read next part to be functionnal, so here your whole will have the custom model example
        ```
            textures/item/swords/dagger/
                            blue_dagger.png
                            red_dagger.png
            models/dagger.json
        ```
        For now it will not work because we need another file, the assiociation.json
4. Texture Model Associations file
In your config folder you need to create an tm_associations.json which will associate your folder with your model or parent and wich item you will override so if you want a big red sword and a big blue sword as iron swords and a small blue sword and small red sword as wooden sword your file will look like that
    ```
        {
            "swords.dagger": {
                "name": "wooden_sword",
                "model": "dagger"
            },
            "swords.iron_sword": {
                "name": "iron_sword",
                "parent": "item/iron_sword"
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
            Note:
                For now model building is a little bit buggy and so texturing may be glitchy if you have bug textures verify textures section in your model json, and if you want to avoid glitch name your texture layer0 in blockbench
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
        It will have some credits, please dont delete them to support us
    2. Associations
        associations.yml is a little trick to maintain your pack if you use custom models in plugin with it you will only need to load the Yml file and instead of setting model data manually in your plugin you use the configuration so you can easily maintain your pack and dont have to change your plugin code if some models are added
1. End
Now grab your pack and enjoy

### Français
1. Créer des textures pour votre pack
Dans un premier temps, nous allons regarder le dossier des textures dans les assets,
le dossier des textures va stocker toutes les textures que vous voulez utiliser dans votre pack de ressources, la structure du dossier est la même que le dossier des textures par défaut de Minecraft avec seulement un item (pour l'instant)
    1. Dossier Item
        Le dossier Item stockera toutes les textures de vos objets, par exemple si vous voulez plusieurs épées en fer, vous ferez un dossier comme celui-ci
        ```
            textures/item/swords/iron_sword/
                                iron_sword.png
                                red_iron_sword.png
        ```
        Mais vous pouvez avoir plusieurs sous-dossiers, par exemple pour la nourriture
        ```
            textures/food/
                        beef/
                            beef_1.png
                            beef_2.png
                        bread/
                            bread_1.png
                            bread_2.png
        ```
2. Créer des sons pour votre pack
Ensuite nous allons regarder le dossier sounds dans assets,
L'architexture du dossier sounds est comme ça
```
sounds/sub_folder/
            sous_dossier/
                random.ogg
                random_2.ogg
            sous_dossier_2/
                random.ogg
```

Donc, par exemple, si nous avons des monstres et des sons d'ambiance, nous pouvons utiliser une architecture comme celle-ci

```
sounds/
        mob/
            zombie/
                zombie_1.ogg
                zombie_2.ogg
            dog/
                dog_1.ogg
                dog_2.ogg
        ambient/
            river.ogg
            forest.ogg
```

3. Modèles pour votre pack
Les modèles seront un peu plus compliqués, nous avons 2 types, les modèles par textures et les modèles par dossier, par texture sera situé dans le dossier textures et aura le même nom que votre png et par dossier sera situé dans le dossier modèles.
    1. Modèle par texture
        Celui-ci est assez facile, il sera le modèle que vous voulez pour vos textures, donc si vous voulez une grande épée en fer, votre architecture sera comme ceci
        ```
            textures/item/swords/iron_sword/
                                iron_sword.png
                                big_iron_sword.png
                                big_iron_sword.json
        ```
        Ainsi, seul le big_iron_sword aura la texture personnalisée.

    2. Textures par modèle
        Ici, c'est plus compliqué et il faudra lire la partie suivante pour être fonctionnel, donc ici tout votre dossier aura un modèle personnalisée exemple
        ```
            textures/item/swords/dagger/
                            blue_dagger.png
                            red_dagger.png
            modèles/dagger.json
        ```
        Pour l'instant cela ne fonctionnera pas car nous avons besoin d'un autre fichier, le assiociation.json
4. Fichier d'associations de modèles de textures
Dans votre dossier de configuration, vous devez créer un fichier tm_associations.json qui associera votre dossier avec votre modèle ou parent et l'item que vous allez remplacer. Ainsi, si vous voulez une grande épée rouge et une grande épée bleue comme épées de fer et une petite épée bleue et une petite épée rouge comme épée en bois, votre fichier ressemblera à ceci
    ```
        {
            "swords.dagger" : {
                "nom" : "wooden_sword",
                "model" : "dagger"
            },
            "swords.iron_sword" : {
                "nom" : "iron_sword",
                "parent" : "item/iron_sword"
            }
        }
    ```
Donc ici, il va créer une grande épée qui va remplacer le modèle de l'épée en fer et ajouter les nouvelles textures et pour les petites épées, il va seulement ajouter les nouvelles textures à l'épée en bois.
4. Dossier des polices
Voici une partie intéressante qui permet d'ajouter des polices personnalisées à votre pack comme pour les emoji ou les gui personnalisés
c'est un peu comme pour les textures mais sans modèles ou associations vous aurez seulement besoin d'ajouter votre image à un sous-dossier de polices
donc cela ressemblera à cela 
```
fonts/
    emojis/
        emoji_1.png
        emoji_2.png
    gui/
        gui.png
```
5. Dossier sample
Ici vous n'avez qu'à mettre le logo de votre pack dans un png nommé icon.png
6. Construction du pack
Ici, nous allons expliquer comment votre pack va se construire
    1. Exécutez npm start
    2. Choisissez l'option que vous voulez construire
        1. Police Negative Space
            Si vous choisissez NegativeSpaceFont, cela ajoutera NegativeSpaceFont de AmberW à votre pack pour que vous ayez des espaces négatifs.
        2. Textures et modèles
            Ici, il va chercher toutes les textures et les modèles et créer des modèles dans le dossier Minecraft de votre pack et dans l'espace de noms de votre pack et mettre les textures dans le dossier des textures de votre espace de noms.
            Note :
                Pour l'instant, la construction de modèles est un peu buggy et donc les textures peuvent être glitchy si vous avez des textures bug vérifier la section textures dans votre modèle json, et si vous voulez éviter les glitch nommer votre texture layer0 dans blockbench.
        3. Sons
            Ici, il va chercher tous les sons et les placer dans le dossier sounds de votre pack namespace et créer votre fichier sounds.json.
        4. Polices
            Ici, il cherchera toutes les polices et les mettra dans le dossier font de l'espace de noms du pack et créera votre fichier sounds.json.
    3. Choisissez le nom de la construction
        Avec cela, vous pouvez avoir différents packs, par exemple si vous voulez des Textures+Fonts mais pas de sons pour un pack plus léger.
    4. Nom du pack
        Ce sera le nom vu dans la sélection du pack de ressources dans mc.
    5. Version du pack
    6. Auteur du pack
    7. Description du pack
    8. Confirmer la construction
1. Informations post-construction
Donc, dans votre dossier build, vous trouverez votre construction avec certains fichier supplémentaire.
    1. Crédits
        Il y aura des crédits, ne le supprimez pas pour nous soutenir.
    2. Associations
        associations.yml est une petite astuce pour maintenir votre pack si vous utilisez des modèles personnalisés dans des plugin avec lui vous aurez seulement besoin de charger le fichier Yml et au lieu de définir les données du modèle manuellement dans votre plugin vous utilisez la configuration ainsi vous pouvez facilement maintenir votre pack et ne pas avoir à changer le code de votre plugin si certains modèles sont ajoutés.
1. Fin
Maintenant, prenez votre pack et profitez-en

## TODO
- Add regex to reject bad characters in filenames and prompts
- Add font to associations
## Credits
Thanks to [AmberW](https://github.com/AmberWat/) for [NegativeSpaceFont](https://github.com/AmberWat/NegativeSpaceFont)
## Licence