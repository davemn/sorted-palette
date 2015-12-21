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
    
    this.calendar = {
      dayPadding: 8,
      daySize: 20,
      origin: { x: function(){ return 8.5; }, y: function(){ return 8.5; } },
      month: [
        {
          x: function(){ return 0; },
          y: function(){ return 0; },
          days: 30
        },
        {
          x: function(){ return (this.calendar.daySize*7+this.calendar.dayPadding*6)+(this.calendar.dayPadding*2); },
          y: function(){ return 0; },
          days: 31
        }
      ]
    };
    
    // - Size & setup drawing environment ---
        
    this.canvas = $canvas.get(0);
    this.ctx = this.canvas.getContext('2d');
    
    // $canvas.height($canvas.width() * 0.75);
    // Don't set canvas size using CSS properties! Will result in pixel scaling instead of viewport scaling.
    this.canvas.width = $canvas.parent('.canvas-container').width();
    this.canvas.height = this.canvas.width * 0.75;
    
    $canvas.mousemove({outerThis:this, canvas:this.canvas, ctx:this.ctx}, this.updateMousePos);
        
    // - Draw dynamic elements ---
    // requestAnimationFrame(updateCanvas);
  };
  
  exports.instance.prototype.drawColorGrid = function(days, x, y){
    // ctx.fillStyle = 'green';
    // ctx.strokeStyle = 'green';
    // ctx.lineWidth

    // ctx.lineWidth = 1;
    // ctx.strokeRect(8.5, 8.5, 20,20);
    
    this.ctx.save();
    this.ctx.lineWidth = 1;
    
    var curPos = {x: x, y: y};
    
    for(var dayI=0; dayI < days; dayI++){
      if(dayI !== 0 && (dayI%7) === 0){ // start new row
        curPos.x = x;
        curPos.y += this.calendar.daySize + this.calendar.dayPadding;
      }
    
      this.ctx.strokeRect(curPos.x, curPos.y, this.calendar.daySize, this.calendar.daySize);
      
      curPos.x += this.calendar.daySize + this.calendar.dayPadding;
    }
    this.ctx.restore();
  };
  
  // Ala http://stackoverflow.com/a/17130415
  exports.instance.prototype.updateMousePos = function(evt){
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
  
  // $(window).load(function(){
  //   
  // });
  // 
  // $(document).ready(function(evt){
  // 
  // });
  
})(jQuery, window.PaletteCanvas = {});

// ---

// - Size canvas ---

// var $inputCanvas = $('#canvas-input');
// $.Velocity.hook($inputCanvas, 'scaleX', '0.8');
// $.Velocity.hook($inputCanvas, 'scaleY', '0.8');
// 
// var $relative = $('.relative');
// $relative.height($relative.width() * 0.75);

// $inputCanvas.delay(500)
//   /* Use Velocity to animate the element's top property over a duration of 2000ms. */
//   // .velocity({ top: "0%", opacity: "100%" }, 1500);
//   /* Use a standard jQuery method to fade the element out once Velocity is done animating top. */
//   // .fadeOut(1000);
//   .velocity({ scaleX: 1, scaleY: 1 }, { duration: 2500 });