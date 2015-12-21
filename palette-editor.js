(function($, CodeMirror, exports){

  var InputError = function(lineNumber, msg){
    this.lineNo = lineNumber;
    this.message = msg;
  }
  InputError.prototype.toString = function(){
    return 'LINE <'+this.lineNo+'> '+this.message;
  };

  function parseInput(src){
    var palette = {};
    var err = [];
  
    var lines = src.split('\n');
    var line, clean, paletteEntry, colorName, colorHex, colorTriplet;
    
    for(var i=0; i < lines.length; i++){
      line = lines[i];
      clean = line.replace(/[^A-Za-z0-9@:]/g, ''); // TODO only supports RGB values given as hex!
      clean = clean.trim();
      
      if(clean.length === 0) // ignore blank lines
        continue;
      
      paletteEntry = clean.split(':');
      if(paletteEntry.length !== 2){
        err.push(new InputError(i+1, 'Unrecognized color declaration: "'+line+'".'));
        continue;
      }
      
      colorName = paletteEntry[0];
      if(colorName[0] !== '@'){
        err.push(new InputError(i+1, 'Missing "@" sign in color declaration.'));
        continue;
      }
      
      colorHex = paletteEntry[1];
      
      if(colorHex.search(/^[A-Fa-f0-9]{3}(?:[A-Fa-f0-9]{3})?$/) === -1){
        err.push(new InputError(i+1, 'Color must be given as 3 or 6-digit hexadecimal.'));
        continue;
      }
      
      colorTriplet = [];
      if(colorHex.length === 3){
        colorTriplet.push(parseInt(colorHex.charAt(0) + colorHex.charAt(0), 16));
        colorTriplet.push(parseInt(colorHex.charAt(1) + colorHex.charAt(1), 16));
        colorTriplet.push(parseInt(colorHex.charAt(2) + colorHex.charAt(2), 16));
      }
      else if(colorHex.length === 6){
        colorTriplet.push(parseInt(colorHex.substring(0,2), 16));
        colorTriplet.push(parseInt(colorHex.substring(2,4), 16));
        colorTriplet.push(parseInt(colorHex.substring(4,6), 16));
      }
      
      palette[colorName] = colorTriplet;
    }
    if(err.length !== 0)
      throw err;
      
    return palette;
  }
  
  // ---
  
  exports.instance = function(opts){
    this.$editor     = opts.$editor;
    this.$errorTable = opts.$errorTable;
    this.$sortButton = opts.$sortButton;
    
    // - Size canvas ---
    
    // var $inputCanvas = $('#canvas-input');
    // $.Velocity.hook($inputCanvas, 'scaleX', '0.8');
    // $.Velocity.hook($inputCanvas, 'scaleY', '0.8');
    // 
    // var $relative = $('.relative');
    // $relative.height($relative.width() * 0.75);
  
    // - Initialize editor ---
    
    this.editor = CodeMirror(this.$editor.get(0), {
      lineNumbers: true
      // lineNumberFormatter: function(lineNo){
      //   var hex = lineNo.toString(16).toUpperCase();
      //   return ('0000'+hex).substring(hex.length);
      // }
    });
    
    // - Setup user-input callbacks ---
    
    this.curError = -1;
    
    this.$errorTable.children('tbody').on('mouseenter', 'tr', {outerThis: this}, this.onErrorTableRowMouseEnter);
    this.$errorTable.children('tbody').on('mouseleave', 'tr', {outerThis: this}, this.onErrorTableRowMouseLeave);
    
    this.$sortButton.click({outerThis: this}, this.onSortButtonClick);
  };
  
  exports.instance.prototype.onErrorTableRowMouseEnter = function(evt){
    var outerThis = evt.data.outerThis;
    
    var lineNo = parseInt($(this).children('th').text(), 10);
    var msg = $(this).children('td').text();
    
    outerThis.curError = lineNo-1;
    
    outerThis.editor.addLineClass(outerThis.curError, 'background', 'sort-error');
  };
  
  exports.instance.prototype.onErrorTableRowMouseLeave = function(evt){
    var outerThis = evt.data.outerThis;
    
    outerThis.editor.removeLineClass(outerThis.curError, 'background');
    outerThis.curError = -1;
  };
  
  exports.instance.prototype.onSortButtonClick = function(evt){
    var outerThis = evt.data.outerThis;
    evt.preventDefault();
    
    outerThis.$errorTable.children('tbody').empty(); // clear our table of errors from previous run
    
    var src = outerThis.editor.getValue();
    
    try {
      var paletteUser = parseInput(src); // unsorted map from LESS variable name, to RGB triplet
      console.log(paletteUser);
      
      // $inputCanvas.delay(500)
      //   /* Use Velocity to animate the element's top property over a duration of 2000ms. */
      //   // .velocity({ top: "0%", opacity: "100%" }, 1500);
      //   /* Use a standard jQuery method to fade the element out once Velocity is done animating top. */
      //   // .fadeOut(1000);
      //   .velocity({ scaleX: 1, scaleY: 1 }, { duration: 2500 });
    }
    catch(e){
      // console.log(e);
    
      for(var i=0; i < e.length; i++){
        var row = $('<tr></tr>');
        row.append('<th scope="row">'+e[i].lineNo+'</th>');
        row.append('<td>'+e[i].message+'</td>');
        
        outerThis.$errorTable.children('tbody').append(row);
      }
    }
  };
  
})(jQuery, CodeMirror, window.PaletteEditor = {});