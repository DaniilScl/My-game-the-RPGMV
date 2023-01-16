/*
Title: Title Backgrounds
Author: DKPlugins
Site: https://dk-plugins.ru
E-mail: kuznetsovdenis96@gmail.com
Version: 1.0.0
Release: 28.09.2020
First release: 28.09.2020
*/

/*ru
Название: Фоны Титульного Экрана
Автор: DKPlugins
Сайт: https://dk-plugins.ru
E-mail: kuznetsovdenis96@gmail.com
Версия: 1.0.0
Релиз: 28.09.2020
Первый релиз: 28.09.2020
*/

/*:
 * @plugindesc v.1.0.0 Allows you to change the background of the title screen during the game.
 * @author DKPlugins
 * @url https://dk-plugins.ru
 * @target MZ
 * @orderAfter DK_Globals
 * @help

 ### Info about plugin ###
 Title: DK_Title_Backgrounds
 Author: DKPlugins
 Site: https://dk-plugins.ru
 Version: 1.0.0
 Release: 28.09.2020
 First release: 28.09.2020

 ###=========================================================================
 ## Compatibility
 ###=========================================================================
 RPG Maker MV: 1.5+
 RPG Maker MZ: 1.0+

 ###===========================================================================
 ## Requirements and dependencies
 ###===========================================================================
 Availability of working plugin Globals version 2.0.0 or above

 ###=========================================================================
 ## Instructions
 ###=========================================================================
 1. Install the Globals plugin ABOVE the Title Backgrounds plugin
 2. Configure the Title Backgrounds plugin, specify the required variables
 3. Add the same variables to the Globals plugin settings

 ###===========================================================================
 ## License and terms of use
 ###===========================================================================
 You can:
 -To use the plugin for your non-commercial projects
 -Change code of the plugin

 You cannot:
 -Delete or change any information about the plugin
 -Distribute the plugin and its modifications

 ## Commercial license ##
 To use the plugin in commercial projects, you must be my subscriber on patreon
 https://www.patreon.com/dkplugins

 ###=========================================================================
 ## Support
 ###=========================================================================
 Donate: https://dk-plugins.ru/donate
 Become a patron: https://www.patreon.com/dkplugins

 * @param title1Variable
 * @text Title 1 variable
 * @desc Title 1 variable for background from "img/titles1".
 * @type variable
 * @default 0

 * @param title1Filename
 * @text Title 1 filename
 * @desc Title 1 filename from "img/titles1". %1 replaced with variable value.
 * @default Title_%1

 * @param title2Variable
 * @text Title 2 variable
 * @desc Title 2 variable for background from "img/titles2".
 * @type variable
 * @default 0

 * @param title2Filename
 * @text Title 2 filename
 * @desc Title 2 filename from "img/titles2". %1 replaced with variable value.
 * @default Title_%1

*/

/*:ru
 * @plugindesc v.1.0.0 Позволяет менять фоны титульного экрана по ходу игры.
 * @author DKPlugins
 * @url https://dk-plugins.ru
 * @target MZ
 * @orderAfter DK_Globals
 * @help

 ### Информация о плагине ###
 Название: DK_Title_Backgrounds
 Автор: DKPlugins
 Сайт: https://dk-plugins.ru
 Версия: 1.0.0
 Релиз: 28.09.2020
 Первый релиз: 28.09.2020

 ###=========================================================================
 ## Совместимость
 ###=========================================================================
 RPG Maker MV: 1.5+
 RPG Maker MZ: 1.0+

 ###===========================================================================
 ## Требования и зависимости
 ###===========================================================================
 Наличие включенного плагина Globals версии 2.0.0 или выше

 ###=========================================================================
 ## Инструкции
 ###=========================================================================
 1. Установить плагин Globals ВЫШЕ плагина Title Backgrounds
 2. Настроить плагин Title Backgrounds, указать необходимые переменные
 3. Эти же переменные добавить в настройки плагина Globals

 ###===========================================================================
 ## Лицензия и правила использования плагина
 ###===========================================================================
 Вы можете:
 -Использовать плагин в некоммерческих проектах
 -Изменять код плагина

 Вы не можете:
 -Удалять или изменять любую информацию о плагине
 -Распространять плагин и его модификации

 ## Коммерческая лицензия ##
 Для использования плагина в коммерческих проектах необходимо быть моим подписчиком на патреоне
 https://www.patreon.com/dkplugins

 ###=========================================================================
 ## Поддержка
 ###=========================================================================
 Поддержать: https://dk-plugins.ru/donate
 Стать патроном: https://www.patreon.com/dkplugins

 * @param title1Variable
 * @text Переменная фона 1
 * @desc Переменная фона 1 для фона из "img/titles1"
 * @type variable
 * @default 0

 * @param title1Filename
 * @text Название файла фона 1
 * @desc Название файла фона 1 из "img/titles1". %1 заменено на значение переменной.
 * @default Title_%1

 * @param title2Variable
 * @text Переменная фона 2
 * @desc Переменная фона 2 для фона из "img/titles2"
 * @type variable
 * @default 0

 * @param title2Filename
 * @text Название файла фона 2
 * @desc Название файла фона 2 из "img/titles2". %1 заменено на значение переменной.
 * @default Title_%1

*/

'use strict';

var Imported = Imported || {};
Imported['DK_Title_Backgrounds'] = '1.0.0';

if (!Imported['DK_Globals']) {
    throw new Error('No plugin "DK_Globals"! Plugin "DK_Title_Backgrounds" will not work!');
}

(function() {

    const parameters = PluginManager.parameters('DK_Title_Backgrounds');

    //===========================================================================
    // Scene_Title
    //===========================================================================

    const Game_Modes_Scene_Title_createBackground = Scene_Title.prototype.createBackground;
    Scene_Title.prototype.createBackground = function() {
        Game_Modes_Scene_Title_createBackground.apply(this, arguments);

        const variable1 = parseInt(parameters.title1Variable);
        const variable2 = parseInt(parameters.title2Variable);
        const filename1 = parameters.title1Filename;
        const filename2 = parameters.title2Filename;

        if (variable1 > 0 && filename1 && this._backSprite1) {
            this._backSprite1.bitmap = ImageManager.loadTitle1(
                filename1.format($gameVariables.value(variable1)));
        }

        if (variable2 > 0 && filename2 && this._backSprite2) {
            this._backSprite2.bitmap = ImageManager.loadTitle2(
                filename2.format($gameVariables.value(variable2)));
        }
    };

}());
