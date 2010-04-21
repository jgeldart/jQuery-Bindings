/**
 ** jQuery Bindings Plugin
 **
 ** Provides some utilities to make it easier to handle CSS.
 **
 ** Copyright (c) 2010 Joe Geldart, http://www.joegeldart.com/
 ** 
 ** Permission is hereby granted, free of charge, to any person obtaining
 ** a copy of this software and associated documentation files (the
 ** "Software"), to deal in the Software without restriction, including
 ** without limitation the rights to use, copy, modify, merge, publish,
 ** distribute, sublicense, and/or sell copies of the Software, and to
 ** permit persons to whom the Software is furnished to do so, subject to
 ** the following conditions:
 ** 
 ** The above copyright notice and this permission notice shall be
 ** included in all copies or substantial portions of the Software.
 ** 
 ** THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 ** EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 ** MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 ** NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 ** LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 ** OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 ** WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **
 **/
 
(function($) {
  
  var units = function(unit) {
    return function(x) {
      return "" + x + unit;
    };
  };
  
  var functionalValue = function(func) {
    return function(x) {
      return func + "(" + x + ")"
    };
  };
  
  $.bindings.css = {
    
    /**
     ** Append a unit to a number
     **/
    unit: function(unit) {
      return units(unit);
    },
    
    em: function(x) {
      return units("em")(x);
    },
    
    ex: function(x) {
      return units("ex")(x);
    },
    
    rem: function(x) {
      return units("rem")(x);
    },
    
    ch: function(x) {
      return units("ch")(x);
    },
    
    gd: function(x) {
      return units("gd")(x);
    },
    
    px: function(x) {
      return units("px")(x);
    },
    
    percent: function(x) {
      return units("%")(x);
    },
    
    inches: function(x) {
      return units("in")(x);
    },
    
    cm: function(x) {
      return units("cm")(x);
    },
    
    mm: function(x) {
      return units("mm")(x);
    },
    
    pt: function(x) {
      return units("pt")(x);
    },
    
    pc: function(x) {
      return units("pc")(x);
    },
    
    vh: function(x) {
      return units("vh")(x);
    },
    
    vw:function(x) {
      return units("vw")(x);
    },
    
    vm: function(x) {
      return units("vm")(x);
    },
    
    deg: function(x) {
      return units("deg")(x);
    },
    
    rad: function(x) {
      return units("rad")(x);
    },
    
    grad: function(x) {
      return units("grad")(x);
    },
    
    turn: function(x) {
      return units("turn")(x);
    },
    
    s: function(x) {
      return units("s")(x);
    },
    
    ms: function(x) {
      return units("ms")(x);
    },
    
    hz: function(x) {
      return units("Hz")(x);
    },
    
    khz: function(x) {
      return units("kHz")(x);
    },
    
    cssFunction: function(func) {
      return functionalValue(func);
    },
    
    rotate: function(x) {
      return functionalValue("rotate")(x);
    },
    
    scale: function(x) {
      return functionalValue("scale")(x);
    },
    
    scaleX: function(x) {
      return functionalValue("scaleX")(x);
    },
    
    scaleY: function(x) {
      return functionalValue("scaleY")(x);
    },
    
    translateX: function(x) {
      return functionalValue("translateX")(x);
    },
    
    translateY: function(x) {
      return functionalValue("translateY")(x);
    },
    
    url : function(x) {
      return functionalValue("url")(x);
    },
    
    content : function(x) {
      return functionalValue("content")(x);
    },
    
    rgb : function(x) {
      return "rgb(" + x.r + "," + x.g + "," + x.b + ")";
    },
    
    rgba : function(x) {
      return "rgba(" + x.r + "," + x.g + "," + x.b + "," + x.a + ")";
    },
    
    hsl : function(x) {
      return "hsl(" + x.h + "," + x.s + "," + x.l + ")";
    },
    
    hsla : function(x) {
      return "hsla(" + x.h + "," + x.s + "," + x.l + "," + x.a + ")";
    }
    
  }
  
})(jQuery);
