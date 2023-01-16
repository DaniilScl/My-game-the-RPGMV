

var Imported = Imported || {};
Imported.RS_MirrorArea = true;

var RS = RS || {};
RS.MirrorArea = RS.MirrorArea || {};
RS.MirrorArea.Params = RS.MirrorArea.Params || {};

function Sprite_Mirror() {
  this.initialize.apply(this, arguments);
}

(function ($) {

  "use strict";

  var parameters = $plugins.filter(function (i) {
    return i.description.contains('<RS_MirrorArea>');
  });

  parameters = (parameters.length > 0) && parameters[0].parameters;

  $.allMirrors = JSON.parse(parameters['Mirrors']);


  $.fBlur = parseFloat(parameters['Blur'] || 0.0);
  $.allImagesVisible = true;
  $.allScale = new PIXI.Point(0.8, 0.8);

  ======================================================================

  Game_Map.prototype.findEventInMap = function (eventId) {
      var events = [];
      if(eventId === 0) return $gamePlayer;
      events = this._events.filter(function (e, i, a) {
        if(e && e.eventId() === eventId) return true;
        return false;
      });
      return events[0];
  };


  Game_Map.prototype.getRealEvents = function () {
      var events = this._events;
      var last = events.slice(-1);
      var maxId = (last[0] || 0) && last[0].eventId();
      var result = [];
      for (var i = 0; i <= maxId; i++) {
        if(events[i]) {
          result.push(events[i]);
        } else {
          result.push(null);
        }
      }
      return result;
  };


  Sprite_Mirror.prototype = Object.create(Sprite_Character.prototype);
  Sprite_Mirror.prototype.constructor = Sprite_Mirror;

  Sprite_Mirror.prototype.initialize = function (character) {
      Sprite_Character.prototype.initialize.call(this, character);
      this._offset = {};
      this.scale = $.allScale;
  };

  Sprite_Mirror.prototype.setCharacterBitmap = function() {
      var smooth = true;
      this.bitmap = ImageManager.loadBitmap('img/characters/', this._characterName, null, smooth);
      this._isBigCharacter = ImageManager.isBigCharacter(this._characterName);
  };

  Sprite_Mirror.prototype.updateVisibility = function () {
      Sprite_Character.prototype.updateVisibility.call(this);
      this.visible = this.mask && $.allImagesVisible;
  };

  Sprite_Mirror.prototype.updatePosition = function() {
      var maskY = parseInt(this._offset['h']);
      this.x = this._character.screenX();
      this.y = this._character.screenY() - maskY - parseInt(this._offset['char_oy'] / 2);
      this.z = this._character.screenZ() + 4;
      this.updateMask();
  };

  var alias_Sprite_Mirror_characterPatternY = Sprite_Mirror.prototype.characterPatternY;
  Sprite_Mirror.prototype.characterPatternY = function() {
      var idx = alias_Sprite_Mirror_characterPatternY.call(this);
      return (3 ^ idx) === 1 ? 2 : (3 ^ idx) === 2 ? 1 : (3 ^ idx);
  };

  var alias_Sprite_Mirror_destroy = Sprite_Mirror.prototype.destroy;
  Sprite_Mirror.prototype.destroy = function () {
      alias_Sprite_Mirror_destroy.call(this);
      this._targetEvent = null;
      SceneManager._scene.getMirrorSprite().removeChild(this._maskSprite);
      this.mask = null;
  };

  Sprite_Mirror.prototype.setProperties = function (mask, targetEvent, offset) {

      this._targetEvent = targetEvent;
      this._offset = offset;

      this._maskSprite = new Sprite();
      this._maskSprite.texture = Graphics._renderer.generateTexture(mask);

      SceneManager._scene.getMirrorSprite().addChild(this._maskSprite);

      this.mask = this._maskSprite;
  };

  Sprite_Mirror.prototype.updateMask = function () {
      if(this._targetEvent && this._maskSprite) {
        var x = this._targetEvent.screenX() - $gameMap.tileWidth() / 2 + parseInt(this._offset['mask_ox']);
        var y = this._targetEvent.screenY() - $gameMap.tileHeight() - parseInt(this._offset['mask_oy']);
        this._maskSprite.x = x;
        this._maskSprite.y = y;
      }
  };



  var alias_Scene_Map_create = Scene_Map.prototype.create;
  Scene_Map.prototype.create = function () {
      alias_Scene_Map_create.call(this);
      this.createMirrorSprite();
  };

  Scene_Map.prototype.createMirrorSprite = function () {
      this._mirrorSprite = new Sprite();
      this.addChild(this._mirrorSprite);
  };

  Scene_Map.prototype.getMirrorSprite = function () {
      return this._mirrorSprite;
  };

  var alias_Scene_Map_terminate = Scene_Map.prototype.terminate;
  Scene_Map.prototype.terminate = function () {
      alias_Scene_Map_terminate.call(this);
      this.removeChild(this._mirrorSprite);
  };



  var alias_Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer
  Spriteset_Map.prototype.createLowerLayer = function() {
      alias_Spriteset_Map_createLowerLayer.call(this);
      this.initMirrorMembers();
      this.findAllTypeMirrors();
  };

  Spriteset_Map.prototype.destroyMirrorTexture = function () {
      this._mirrorRenderTexture.destroy(true);
  };

  Spriteset_Map.prototype.initMirrorMembers = function () {
      this._mirrorCharacters = [];
      this._mirrorInitialized = false;
  };


  var alias_Spriteset_Map_hideCharacters = Spriteset_Map.prototype.hideCharacters;
  Spriteset_Map.prototype.hideCharacters = function() {
      alias_Spriteset_Map_hideCharacters.call(this);
      for (var i = 0; i < this._mirrorCharacters.length; i++) {
          var sprite = this._mirrorCharacters[i];
          if (!sprite.isTile()) {
              sprite.hide();
          }
      }
  };


  RS.MirrorArea.makeRoundedRect = function (x, y, w, h) {
    var graphics = new PIXI.Graphics();
    graphics.beginFill(0xffffff, 0.9 );
    graphics.x = x;
    graphics.y = y;
    graphics.drawRoundedRect( 0, 0, w, h, 1 );
    graphics.endFill();

    return graphics;
  };

  Spriteset_Map.prototype.addChildMirrorImage = function(target, graphics, event, offset) {
    if(!this._mirrorCharacters) return false;
    if(!this._tilemap) return false;


    var child = new Sprite_Mirror( target );
    child.setProperties( graphics, event, offset );


    this._mirrorCharacters.push( child );
    this._tilemap.addChild( child );

    return child;

  };

  Spriteset_Map.prototype.createMirrorImage = function (event, type, id) {

      var offset = type;
      var target = $gameMap.findEventInMap(id); // 이벤트를 찾는다.

      var x = event.screenX() - parseInt(offset['mask_ox']);
      var y = event.screenY() - parseInt(offset['mask_oy']);
      var w = parseInt(offset['w']);
      var h = parseInt(offset['h']);


      var graphics = RS.MirrorArea.makeRoundedRect(x, y, w, h);

      this.addChildMirrorImage( target, graphics, event, offset);


      if(target instanceof Game_Player) {
        $gamePlayer._followers.forEach(function (e, i, a) {
            this.addChildMirrorImage( e, graphics, event, offset);
        }, this);
      }

  };

  Spriteset_Map.prototype.findAllTypeMirrors = function() {
      var self = this;
      var id = -1;

      $gameMap.getRealEvents().forEach(function (event) {

        if(event === null || event === undefined) return false;
        if(event._erased) return false;
        if(event.findProperPageIndex() < 0) return false;
        if(!event.page()) return false;
        var eventlist = event.list();
        if(!eventlist) return false;


        eventlist.forEach(function (list, i ,a) {
          if(list.code === 108 || list.code === 408) {
            $.allMirrors.forEach(function (mirror) {
              var data = JSON.parse(mirror);

              if(typeof data === 'object' && data.hasOwnProperty('note')) {
                if(list.parameters[0].match(new RegExp(`<(?:${data.note}).W*\:.\W*(.+?)>`, 'gi'))) {
                  id = parseInt(RegExp.$1);

                  if(id >= 0) self.createMirrorImage(event, data, id);
                }
              }

            }, this);
          }

        });

      }, this);

  };


  var alias_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
      alias_Game_Interpreter_pluginCommand.call(this, command, args);
      if(command === "Mirror") {
        switch(args[0]) {
          case 'Show':
            $.allImagesVisible = true;
          break;
          case 'Hide':
            $.allImagesVisible = false;
          break;
        }
      }
  };

})(RS.MirrorArea.Params);
