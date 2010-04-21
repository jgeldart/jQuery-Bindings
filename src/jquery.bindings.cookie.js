/**
 ** Exposes jQuery.Cookie as behaviours and events
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
  
  /**
   ** A behaviour containing the value of the given cookie.
   **
   ** Optionally takes an event stream, whose events are used as triggers
   ** for sampling, and if this isn't provided defaults to using a timer
   ** which fires every updateFreq miliseconds.
   **/
  $.bindings.cookieB = function(cookieName, options) {
    return this.cookieE(cookieName, options).startsWith($.cookie(cookieName));
    
  };
  
  /**
   ** An event containing the value of the given cookie.
   **
   ** Optionally takes an event stream, whose events are used as triggers
   ** for sampling, and if this isn't provided defaults to using a timer
   ** which fires every updateFreq miliseconds.
   **/
  $.bindings.cookieE = function(cookieName, options) {
    
    var defaults = {
      eventStream : null,
      updateFreq : 1000,
      cookieOptions : {}
    };
    
    var config = $.extend({}, defaults, options);
    
    if(config.eventStream == null)
      config.eventStream = timerE(config.updateFreq);
      
    return config.eventStream.mapE(function(t) {
       var cookieval = $.cookie(cookieName);
       return cookieval; 
    });
    
  };
  
  /**
   ** Sink the given event stream's events into the named cookie
   **/
  $.bindCookieE = function(cookieName, eventStream, options) {
    
    eventStream.mapE(function(val) { 
      $.cookie(cookieName, val, options); 
    });
    
  };
  
  /**
   ** Bind this cookie name to the value of this event stream.
   **/
  EventStream.prototype.bindCookie = function(cookieName, options) {
    $.bindCookieE(cookieName, this, options);
    return this;
  };
  
})(jQuery);
