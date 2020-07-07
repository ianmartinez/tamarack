/**
 * ::: core.js :::
 *  
 * === TkDocument === 
 * --- Scripts ---
 *  - Get the tamarack/*.js files used in the document as an array
      TkDocument.tamarackScripts { get; }
 *  - Get a script {scriptName}.js by name
 *      TkDocument.getScript("scriptName");
 *  - Add a script to the DOM
 *      TkDocument.addScript(scriptName);
 *  - Remove a script from the DOM
 *      TkDocument.removeScript(scriptName);
 * 
 * --- Styles ---
 *  - Get the tamarack/*.css files used in the document as an array
 *      TkDocument.tamarackStyles { get; }
 *  - Get a style {styleName}.js by name
 *      TkDocument.getStyle("styleName");
 *  - Add a style to the DOM
 *      TkDocument.addStyle(styleName);
 *  - Remove a style from the DOM
 *      TkDocument.removeStyle(styleName);
 */

 /**
  * ::: icons.js :::
  */

  class TkIconSet {
      
      constructor(iconFolder) {

      }

      getIcon(iconName) {

      }

  }


/**
 * ::: views.js :::
 */

class TkSwitch extends TkView {}
class TkInput extends TkView {}
class TkForm extends TkView {}
class TkSlider extends TkView {}
class TkSpinner extends TkView {}
class TkColorPicker extends TkView {}
class TkColorDialog extends TkView {}
class TkColorButton extends TkView {}
class TkFontPicker extends TkView {}
class TkFontDialog extends TkView {}
class TkFontButton extends TkView {}

