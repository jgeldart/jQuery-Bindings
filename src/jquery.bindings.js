/**
 ** jQuery plugin for handling data-flow programming and bindings
 **
 ** Allows you to get access to behaviours and events using jQuery
 ** methods.
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
  
  // Constants
  
  var updateFreq = 1;
  
  // Utility functions
  
  var isEventStream = function(eventStream) {
    if(typeof(eventStream.mapE) != 'undefined')
      return true;
    else
      return false;
  };
  
  var isBehaviour = function(behaviour) {
    if(typeof(behaviour.liftB) != 'undefined')
      return true;
    else
      return false;
  };
  
  var wrapjQueryFunctionInBehaviour = function(ctx, func) {
    if(ctx.length > 0) {
      return liftB(function(e, t) {
                      return e[func]();
                    }, ctx, timerB(updateFreq));
    }
    else
      return null;
  };
  
  var wrapjQueryFunctionWithParamBehaviour = function(ctx, func, param) {
    if(ctx.length > 0) {
      return liftB(function(e, t) {
                      return e[func](param);
                    }, ctx, timerB(updateFreq));
    }
    else
      return null;
  };
  
  /*****************************************************
   * Top level jQuery set functions
   *****************************************************/
  
  
  // Bind parts of the DOM to the values of behaviours and events
  
  /**
   ** Binds the DOM of the element to the value of the behaviour
   **/
  $.fn.bindNodeB = function(behaviour) {
    
    this.each(function() {
      insertDomB(behaviour, this);
    });
    
    return this;
    
  };
  
  /**
   ** Binds the DOM of the element to the value of the last event
   **/
  $.fn.bindNodeE = function(eventstream) {
    
    this.each(function() {
      insertDomE(eventstream, this);
    });
    
    return this;
    
  };
  
  /**
   ** Binds the value of a behaviour to a specific field of an element
   **/
  $.fn.bindFieldB = function(field, behaviour) {
    
    this.each(function() {
      insertValueB(behaviour, this, field)
    });
    
    return this;
    
  };
  
  /**
   ** Binds the value of each event to a specific field of an element
   **/
  $.fn.bindFieldE = function(field, eventstream) {
    
    this.each(function() {
      insertValueE(eventstream, this, field);
    });
    
    return this;
  };
  
  /**
   ** Binds the value of a field to that of an event stream or behaviour.
   **/
  $.fn.bindField = function(field, x) {
    
    if(isBehaviour(x))
      return this.bindFieldB(field, x);
    else if(isEventStream(x))
      return this.bindFieldE(field, x);
    else
      return this;
    
  };
  
  /**
   ** Bind the inner HTML of the context to the value of the behaviour.
   **/
  $.fn.bindContentB = function(behaviour) {
    return this.bindFieldB("innerHTML", behaviour);
  };
  
  /**
   ** Bind the inner HTML of the context to the value of the event.
   **/
  $.fn.bindContentE = function(eventStream) {
    return this.bindFieldE("innerHTML", eventStream);
  };
  
  /**
   ** Bind the inner HTML of the context to the value.
   **/
  $.fn.bindContent = function(x) {
    return this.bindField("innerHTML", x);
  };
  
  /**
   ** Bind the jQuery data of the context with the given key to the behaviour.
   **/
  $.fn.bindDataB = function(key, behaviour) {
    this.each(function() {
      liftB(function(val, obj) { obj.data(key, val)}, behaviour, $(this));
    });
    return this;
  };
  
  /**
   ** Bind the jQuery data of the context with the given key to each event.
   **/
  $.fn.bindDataE = function(key, eventStream) {
    this.each(function() {
      var ctx = $(this);
      eventStream.mapE(function(val) { this.data(key, val); });
    });
    return this;
  };
  
  /**
   ** Bind the jQuery data of the context with the given key to the value.
   **/
  $.fn.bindData = function(key, x) {
    if(isBehaviour(x))
      return this.bindDataB(key, x);
    else if(isEventStream(x))
      return this.bindDataE(key, x);
    else
      return this;
  };
  
  // Event streams from DOM events
  
  /**
   ** Catch the given DOM event and place it on an event stream that is
   ** returned to the caller.
   **/
  $.fn.eventStream = function(eventName) {
    
    var evtStream = receiverE();
    
    this.bind(eventName, function(e) {
      evtStream.sendEvent(e);
    });
    
    return evtStream;
    
  };
  
  $.fn.blurE = function() {
    return this.eventStream("blur");
  };
  
  $.fn.focusE = function() {
    return this.eventStream("focus");
  };
  
  $.fn.submitE = function() {
    return this.eventStream("submit");
  };
  
  $.fn.changeE = function() {
    return this.eventStream("change");
  };
  
  $.fn.clickE = function() {
    return this.eventStream("click");
  };
  
  $.fn.hoverE = function() {
    return this.eventStream("hover");
  };
  
  $.fn.mouseoverE = function() {
    return this.eventStream("mouseover");
  };
  
  $.fn.mousemoveE = function() {
    return this.eventStream("mousemove");
  };
  
  $.fn.mousedownE = function() {
    return this.eventStream("mousedown");
  };
  
  $.fn.mouseoutE = function() {
    return this.eventStream("mouseout");
  };
  
  $.fn.mouseupE = function() {
    return this.eventStream("mouseup");
  };
  
  $.fn.keydownE = function() {
    return this.eventStream("keydown");
  };
  
  $.fn.keyupE = function() {
    return this.eventStream("keyup");
  };
  
  
  
  // Bind CSS concepts to behaviours and events
  
  /**
   ** Binds the given CSS property to the value of the behaviour
   **/
  $.fn.bindPropertyB = function(cssProp, behaviour) {
    
    var ctx = this;
    
    liftB(function(val) { ctx.css(cssProp, val); }, behaviour);
    
    return this;
    
  };
  
  /**
   ** Binds the given CSS property to the value of the last event on the
   ** given event stream
   **/
  $.fn.bindPropertyE = function(cssProp, eventStream) {
    
    var ctx = this;
    
    eventStream.mapE(function(val) { ctx.css(cssProp, val); });
    
    return this;
    
  };
  
  /**
   ** Bind the given CSS property to the event stream or behaviour
   **/
  $.fn.bindProperty = function(cssProp, x) {
    
    if(isBehaviour(x))
      return this.bindPropertyB(cssProp, x);
    else if(isEventStream(x))
      return this.bindPropertyE(cssProp, x);
    else
      return this;
    
  };
  
  /**
   ** Binds the given CSS to the value of the behaviour
   **/
  $.fn.bindStyleB = function(behaviour) {
    
    var ctx = this;
    
    liftB(function(val) { ctx.css(val); }, behaviour);
    
    return this;
    
  };
  
  /**
   ** Binds the given CSS to the value of the last event on the
   ** given event stream
   **/
  $.fn.bindStyleE = function(eventStream) {
    
    var ctx = this;
    
    eventStream.mapE(function(val) { ctx.css(val); });
    
    return this;
    
  };
  
  /**
   ** Bind the given CSS to the event stream or behaviour
   **/
  $.fn.bindStyle = function(x) {
    
    if(isBehaviour(x))
      return this.bindStyleB(x);
    else if(isEventStream(x))
      return this.bindStyleE(x);
    else
      return this;
    
  };
  
  /**
   ** On receiving an event containing a CSS class, add that class to the
   ** matched elements.
   **/
  $.fn.bindAddClassE = function(cssClassE) {
    
    var ctx = this;
    
    cssClassE.mapE(function(cssClass) { ctx.addClass(cssClass); });
    
    return this;
    
  };
  
  /**
   ** On receiving an event containing a CSS class, remove that class from
   ** the matched elements.
   **/
  $.fn.bindRemoveClassE = function(cssClassE) {

    var ctx = this;
    
    cssClassE.mapE(function(cssClass) { ctx.addClass(cssClass); });
    
    return this;
    
  };
  
  /**
   ** On receiving an event containing a CSS class, add that class to the
   ** matched elements if they do not already have it, or remove it if
   ** they do.
   **/
  $.fn.bindToggleClassE = function(cssClassE) {
    
    var ctx = this;
    
    cssClassE.mapE(function(cssClass) { ctx.toggleClass(cssClass); });
    
    return this;
    
  };
  
  // Useful behaviours based on the properties of DOM objects and the UI
  
  /**
   ** Returns a behaviour containing the data key of the first
   ** matching value.
   **/
  $.fn.dataB = function(key) {
    return wrapjQueryFunctionWithParamBehaviour(this, "data", key);
  };
  
  /**
   ** Returns a behaviour containing the given attribute of the first
   ** matching value.
   **/
  $.fn.attrB = function(attr) {
    return wrapjQueryFunctionWithParamBehaviour(this, "attr", attr);
  };
  
  /**
   ** Returns a behaviour containing the recursive text of the first
   ** matching value.
   **/
  $.fn.textB = function() {
    return wrapjQueryFunctionInBehaviour(this, "text");
  };
  
  /**
   ** Returns a behaviour containing the value of the given css property 
   ** of the first matching value.
   **/
  $.fn.cssPropertyB = function(prop) {
    return wrapjQueryFunctionWithParamBehaviour(this, "css", key);
  };
  
  /**
   ** Returns a behaviour representing the value of the first matching
   ** element.
   **/
  $.fn.valueB = function() {
    
    if(this.length > 0)
      return extractValueB(this[0]);
    else
      return null;
    
  };
  
  /**
   ** Returns an event stream which contains an event
   ** when the first matching element changes.
   **/
  $.fn.valueE = function() {
    
    if(this.length > 0)
      return extractValueE(this[0]);
    else
      return null;
    
  };
  
  /**
   ** Returns an event stream which contains a value whenever
   ** the given event stream has an event.
   **/
  $.fn.valueOnEventE = function(eventStream) {
    
    if(this.length > 0)
      return extractValueOnEventE(eventStream, this[0]);
    else
      return null;
    
  };
  
  /**
   ** Returns a behaviour containing the x-coord of the mouse relative
   ** to the first matching element.
   **/
  $.fn.mouseLeftB = function() {
    if(this.length > 0)
      return mouseLeftB(this[0]);
    else
      return null;
  };
  
  /**
   ** Returns a behaviour containing the y-coord of the mouse relative
   ** to the first matching element.
   **/
  $.fn.mouseTopB = function() {
    if(this.length > 0)
      return mouseTopB(this[0]);
    else
      return null;
  };
  
  /**
   ** Returns a behaviour containing the position of the mouse relative
   ** to the first matching element.
   **/
  $.fn.mouseB = function() {
    if(this.length > 0)
      return mouseB(this[0]);
    else
      return null;
  };
  
  /**
   ** Returns a behaviour containing the inner height of the first
   ** matching value.
   **/
  $.fn.innerHeightB = function() {
    return wrapjQueryFunctionInBehaviour(this, "innerHeight");
  };
  
  /**
   ** Returns a behaviour containing the inner width of the first
   ** matching value.
   **/
  $.fn.innerWidthB = function() {
    return wrapjQueryFunctionInBehaviour(this, "innerWidth");
  };
  
  /**
   ** Returns a behaviour containing the outer height of the first
   ** matching value.
   **/
  $.fn.outerHeightB = function() {
    return wrapjQueryFunctionInBehaviour(this, "outerHeight");
  };
  
  /**
   ** Returns a behaviour containing the outer width of the first
   ** matching value.
   **/
  $.fn.outerWidthB = function() {
    return wrapjQueryFunctionInBehaviour(this, "outerWidth");
  };
  
  /**
   ** Returns a behaviour containing the height of the first
   ** matching value.
   **/
  $.fn.heightB = function() {
    return wrapjQueryFunctionInBehaviour(this, "height");
  };
  
  /**
   ** Returns a behaviour containing the width of the first
   ** matching value.
   **/
  $.fn.widthB = function() {
    return wrapjQueryFunctionInBehaviour(this, "width");
  };
  
  /**
   ** Returns a behaviour containing the offset of the first
   ** matching value.
   **/
  $.fn.offsetB = function() {
    return wrapjQueryFunctionInBehaviour(this, "offset");
  };
  
  /**
   ** Returns a behaviour containing the position of the first
   ** matching value.
   **/
  $.fn.positionB = function() {
    return wrapjQueryFunctionInBehaviour(this, "position");
  };
  
  /**
   ** Returns a behaviour containing the left scroll of the first
   ** matching value.
   **/
  $.fn.scrollLeftB = function() {
    return wrapjQueryFunctionInBehaviour(this, "scrollLeft");
  };
  
  /**
   ** Returns a behaviour containing the top scroll of the first
   ** matching value.
   **/
  $.fn.scrollTopB = function() {
    return wrapjQueryFunctionInBehaviour(this, "scrollTop");
  };
  
  // jQuery Animations and Effects
  
  /**
   ** Perform a show animation on the elements when an event arrives.
   ** If the event's value isn't null, it is treated as a duration for
   ** the animation.
   **/
  $.fn.bindShowE = function(eventStream) {
    
    var ctx = this;
    
    eventStream.mapE(function(e) { ctx.show(e); });
    
    return this;
    
  };
  
  /**
   ** Perform a hide animation on the elements when an event arrives.
   ** If the event's value isn't null, it is treated as a duration for
   ** the animation.
   **/
  $.fn.bindHideE = function(eventStream) {
    
    var ctx = this;
    
    eventStream.mapE(function(e) { ctx.hide(e); });
    
    return this;
    
  };
  
  /**
   ** Perform a fade-in animation on the elements when an event arrives.
   ** If the event's value isn't null, it is treated as a duration for
   ** the animation.
   **/
  $.fn.bindFadeInE = function(eventStream) {
    
    var ctx = this;
    
    eventStream.mapE(function(e) { ctx.fadeIn(e); });
    
    return this;
    
  };
  
  /**
   ** Perform a fade-out animation on the elements when an event arrives.
   ** If the event's value isn't null, it is treated as a duration for
   ** the animation.
   **/
  $.fn.bindFadeOutE = function(eventStream) {
    
    var ctx = this;
    
    eventStream.mapE(function(e) { ctx.fadeOut(e); });
    
    return this;
    
  };
  
  /**
   ** Perform a slide-down animation on the elements when an event arrives.
   ** If the event's value isn't null, it is treated as a duration for
   ** the animation.
   **/
  $.fn.bindSlideDownE = function(eventStream) {
    
    var ctx = this;
    
    eventStream.mapE(function(e) { ctx.slideDown(e); });
    
    return this;
    
  };
  
  /**
   ** Perform a slide-up animation on the elements when an event arrives.
   ** If the event's value isn't null, it is treated as a duration for
   ** the animation.
   **/
  $.fn.bindSlideUpE = function(eventStream) {
    
    var ctx = this;
    
    eventStream.mapE(function(e) { ctx.slideUp(e); });
    
    return this;
    
  };
  
  /**
   ** Perform a slide toggle animation on the elements when an event arrives.
   ** If the event's value isn't null, it is treated as a duration for
   ** the animation.
   **/
  $.fn.bindSlideToggleE = function(eventStream) {
    
    var ctx = this;
    
    eventStream.mapE(function(e) { ctx.slideToggle(e); });
    
    return this;
    
  };
  
  /**
   ** Triggers an animation, using $.fn.animate, whenever an
   ** event is received on triggerE. The values to animate towards
   ** are the current values of propertiesB, with extra options in optionsB
   **/
  $.fn.bindAnimateE = function(triggerE, propertiesB, optionsB) {
    
    var ctx = this;
    
    triggerE.mapE(function(trig) {
      liftB(function(props, opts) {
        ctx.animate(props, opts);
      }, propertiesB, optionsB);
    });
    
    return this;
    
  };
  
  /*****************************************************
   * Top level jQuery functions
   *****************************************************/
  $.bindings = {
    
    /**
     ** Given a map of behaviours, return a behaviour that gives
     ** an object with fields whose values are the values of the
     ** corresponding behaviours at that time.
     **
     ** For example:
     **
     ** $.bindings.objectB({ top : $("body").mouseTopB(), 
     **                 left : $("body").mouseLeftB() })
     **
     ** is a behaviour with values like {top: 20, left: 400}
     **/
    objectB : function(behaviourMap) {
      
      // First find out the structure we're meant to be producing
      var behaviourArray = [];
      var behaviourKeys = [];
      for(var k in behaviourMap) {
        behaviourArray.push(behaviourMap[k]);
        behaviourKeys.push(k);
      };
      
      // This helper will do the actual lifting of concrete values for us
      // but it relies on the args being in the same order as the keys.
      var staticHelper = function(args, timer) {
        
        var result = {};
        
        for(var i in args) {
          var val = isBehaviour(args[i]) ? valueNow(args[i]) : args[i];
          
          if(isEventStream(val))
            throw("Is Event Stream: " + args[i]);
            
          result[behaviourKeys[i]] = val;
        };
        
        return result;
        
      };
      
      // We need to pass in a top level behaviour here, even though we 
      // ignore it, to force liftB to update the value we return.
      return liftB(staticHelper, behaviourArray, timerB(1));
      
    }
    
  };
  
  /*****************************************************
   * Top level Behaviour functions
   *****************************************************/
  
  /**
   ** Transform the behaviour with the given function.
   **
   ** Equivalent to liftB(func, this)
   **/
  Behavior.prototype.transform = function(func) {
    return liftB(func, this);
  };
  
  /**
   ** Binds the given nodes to the values of the behaviour.
   **
   ** Equivalent to $(selector).bindNodeB(behaviour).
   **/
  Behavior.prototype.bindNode = function(selector) {  
    $(selector).bindNodeB(this);
    return this;
  };
  
  /**
   ** Binds the data key for the given elements to the values of the behaviour.
   **
   ** Equivalent to $(selector).bindDataB(key, behaviour).
   **/
  Behavior.prototype.bindData = function(selector, key) {  
    $(selector).bindDataB(key, this);
    return this;
  };
  
  /**
   ** Binds the given fields of a DOM object to the value of the behaviour.
   **
   ** Equivalent to $(selector).bindFieldB(field, behaviour).
   **/
  Behavior.prototype.bindField = function(selector, field) {
    $(selector).bindFieldB(field, this);
    return this;
  };
  
  /**
   ** Binds the inner HTML of a DOM object to the value of the behaviour.
   **
   ** Equivalent to $(selector).bindContentB(behaviour)
   **/
  Behavior.prototype.bind = function(selector) {
    $(selector).bindContentB(this);
    return this;
  };
  
  /**
   ** Binds the given CSS property of the DOM node to the values of the 
   ** behaviour.
   **
   ** Equivalent to $(selector).bindPropertyB(cssProp, behaviour).
   **/
  Behavior.prototype.bindProperty = function(selector, cssProp) {
    $(selector).bindPropertyB(cssProp, this);
    return this;
  };
  
  /**
   ** Binds the CSS of the DOM node to the values of the behaviour.
   **
   ** Equivalent to $(selector).bindStyleB(behaviour).
   **/
  Behavior.prototype.bindStyle = function(selector) {
    $(selector).bindStyleB(this);
    return this;
  };
  
  /**
   ** Extracts the given field from the objects carried by the behaviour.
   ** The field may be time varying as well.
   **/
  Behavior.prototype.select = function(field) {
    return liftB(function(val, field) { return val[field]; }, this, field);
  };
  
  /**
   ** Execute the given method on the object. The method is a string which
   ** may be time varying as well.
   **/
  Behavior.prototype.execute = function(method) {
    return liftB(function(val, method) { return val[method](); }, this, method);
  };
  
  /**
   ** Convert an object value to a JSON string value.
   **/
  Behavior.prototype.stringify = function() {
    return liftB(function(o){return JSON.stringify(o);}, this);
  };
  
  /**
   ** Convert a JSON string value to an object value
   **/
  Behavior.prototype.fromJSON = function() {
    return liftB(function(o){return JSON.parse(o);}, this);
  };
  
  Behavior.prototype.log = function() {
    liftB(function(x) { window.console.log(x); }, this);
    return this;
  };
  
  
  /*****************************************************
   * Top level EventStream functions
   *****************************************************/
  
  /**
   ** Transform the events with a given function.
   **
   ** Equivalent to this.mapE(func)
   **/
  EventStream.prototype.transform = function(func) {
    return this.mapE(func);
  };
  
  /**
   ** Binds the given nodes to the values of the event stream.
   **
   ** Equivalent to $(selector).bindNodeE(eventStream).
   **/
  EventStream.prototype.bindNode = function(selector) {  
    $(selector).bindNodeE(this);
    return this;
  };
  
  /**
   ** Binds the given data key for the element to the values of the event stream.
   **
   ** Equivalent to $(selector).bindDataE(key, eventStream).
   **/
  EventStream.prototype.bindData = function(selector, key) {  
    $(selector).bindDataE(key, this);
    return this;
  };
  
  /**
   ** Binds the given fields of a DOM object to the value of the 
   ** event stream.
   **
   ** Equivalent to $(selector).bindFieldE(field, eventStream).
   **/
  EventStream.prototype.bindField = function(selector, field) {
    $(selector).bindFieldE(field, this);
    return this;
  };
  
  /**
   ** Binds the inner HTML of a DOM object to the value of the event
   ** stream.
   **
   ** Equivalent to $(selector).bindContentE(eventStream)
   **/
  EventStream.prototype.bind = function(selector) {
    $(selector).bindContentE(this);
    return this;
  }
  
  /**
   ** Binds the given CSS property of the DOM node to the values of the 
   ** event stream.
   **
   ** Equivalent to $(selector).bindPropertyE(cssProp, eventStream).
   **/
  EventStream.prototype.bindProperty = function(selector, cssProp) {
    $(selector).bindPropertyE(cssProp, this);
    return this;
  };
  
  /**
   ** Binds the CSS of the DOM node to the values of the event stream.
   **
   ** Equivalent to $(selector).bindStyleE(eventStream).
   **/
  EventStream.prototype.bindStyle = function(selector) {
    $(selector).bindStyleE(this);
    return this;
  };
  
  /**
   ** Returns an event stream that contains the value of the first
   ** matched element when the input event stream contains an event.
   **
   ** Equivalent to $(selector).valueOnEventE(eventStream).
   **/
  EventStream.prototype.withValueFrom = function(selector) {
    return $(selector).valueOnEventE(this);
  };
  
  /**
   ** Extracts the given field from the objects carried by the event stream.
   ** The field must be constant. Note, the object can be an array.
   **/
  EventStream.prototype.select = function(field) {
    return this.mapE(function(val) { return val[field]; });
  };
  
  /**
   ** Execute the method given on the objects in the events. The method must
   ** be constant.
   **/
  EventStream.prototype.execute = function(method) {
    return this.mapE(function(val) { return val[method](); });
  };
  
  /**
   ** Convert an object value to a JSON string value.
   **/
  EventStream.prototype.stringify = function() {
    return this.mapE(function(o){return JSON.stringify(o);});
  };
  
  /**
   ** Convert a JSON string value to an object value
   **/
  EventStream.prototype.fromJSON = function() {
    return this.mapE(function(o){return JSON.parse(o);});
  };
  
  // Animation events
  
  EventStream.prototype.bindShow = function(selector) {
    $(selector).bindShowE(this);
    return this;
  };
  
  EventStream.prototype.bindHide = function(selector) {
    $(selector).bindHideE(this);
    return this;
  };
  
  EventStream.prototype.bindFadeIn = function(selector) {
    $(selector).bindFadeInE(this);
    return this;
  };
  
  EventStream.prototype.bindFadeOut = function(selector) {
    $(selector).bindFadeOutE(this);
    return this;
  };
  
  EventStream.prototype.bindSlideUp = function(selector) {
    $(selector).bindSlideUpE(this);
    return this;
  };
  
  EventStream.prototype.bindSlideDown = function(selector) {
    $(selector).bindSlideDownE(this);
    return this;
  };
  
  EventStream.prototype.bindSlideToggle = function(selector) {
    $(selector).bindSlideToggleE(this);
    return this;
  };
  
  EventStream.prototype.bindAnimate = function(selector, props, opts) {
    $(selector).bindAnimateE(this, props, opts);
    return this;
  };
  
  EventStream.prototype.log = function() {
    this.mapE(function(x) { window.console.log(x); });
    return this;
  };
  
})(jQuery);
