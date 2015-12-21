(function($, exports){
  // new PaletteCanvas.instance({
  //   $canvas: $('#canvas-input')
  // });
  // palette.drawColorGrid(
  //   palette.calendar.month[0].days, 
  //   palette.calendar.origin.x() + palette.calendar.month[0].x(), 
  //   palette.calendar.origin.y() + palette.calendar.month[0].y());
  
  exports.instance = function(opts){
    var $canvas = opts.$canvas;
    
    this.relMousePos = {x:0, y:0};
    
    this.swatchSize = 20;
    this.swatchPadding = 8;
    
    // - Size & setup drawing environment ---
        
    this.canvas = $canvas.get(0);
    this.ctx = this.canvas.getContext('2d');
    
    // $canvas.height($canvas.width() * 0.75);
    // Don't set canvas size using CSS properties! Will result in pixel scaling instead of viewport scaling.
    // http://stackoverflow.com/a/331462
    this.canvas.width = $canvas.parent('.canvas-container').width();
    this.canvas.height = this.canvas.width * 0.75;
    
    $canvas.mousemove({outerThis:this, canvas:this.canvas, ctx:this.ctx}, this._updateMousePos);
        
    // - Draw dynamic elements ---
    // requestAnimationFrame(updateCanvas);
  };
  
  exports.instance.prototype.drawSwatchGrid = function(swatches, x, y){
    // ctx.fillStyle = 'green';
    // ctx.strokeStyle = 'green';
    // ctx.lineWidth

    // ctx.lineWidth = 1;
    // ctx.strokeRect(8.5, 8.5, 20,20);
    
    this.ctx.clearRect(0,0, this.canvas.width,this.canvas.height);
    
    this.ctx.save();
    this.ctx.lineWidth = 1;
    
    var curPos = {x: x, y: y};
    
    var swatchI=0;
    for(var swatch in swatches){
      if(swatchI !== 0 && (swatchI%7) === 0){ // start new row
        curPos.x = x;
        curPos.y += this.swatchSize + this.swatchPadding;
      }
    
      this.ctx.fillStyle = 'rgb('+swatches[swatch][0]+','+swatches[swatch][1]+','+swatches[swatch][2]+')';
      this.ctx.fillRect(curPos.x, curPos.y, this.swatchSize, this.swatchSize);
      
      this.ctx.strokeRect(curPos.x, curPos.y, this.swatchSize, this.swatchSize);
      
      curPos.x += this.swatchSize + this.swatchPadding;
     
      swatchI++;
    }
    
    this.ctx.restore();
  };
  
  // Ala http://stackoverflow.com/a/17130415
  exports.instance.prototype._updateMousePos = function(evt){
    // evt.pageX, evt.pageY // use instead of client[X|Y] or offset[X|Y]!
    // jQuery normalizes page[X|Y], but we need viewport-relative 
    var outerThis = evt.data.outerThis;
    var canvas = evt.data.canvas;
    var ctx = evt.data.ctx;
    
    var rect = canvas.getBoundingClientRect();
    
    // mouse position relative to the top-left of the canvas
    outerThis.relMousePos.x = evt.clientX - rect.left;
    outerThis.relMousePos.y = evt.clientY - rect.top;
  };
})(jQuery, window.PaletteCanvas = {});