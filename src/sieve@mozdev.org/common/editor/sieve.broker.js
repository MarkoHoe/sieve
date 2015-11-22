/*
 * The contents of this file are licenced. You may obtain a copy of 
 * the license at https://github.com/thsmi/sieve/ or request it via 
 * email from the author.
 *
 * Do not remove or change this comment.
 * 
 * The initial author of the code is:
 *   Thomas Schmid <schmid-thomas@gmx.net>
 *      
 */
 
/* global document */
/* global window */
 
"use strict";
  
/**
 * Interacts alike a broke between two iframes. Virtually glues the two frame via html5 
 * post message to gether. So that bidirectional messaging is possible
 **/
  
(function(exports) {
	
  function SieveBroker(target) {
    this.target = target;
  }
  
  SieveBroker.prototype = {
  	
    target : null,
    listener : null,

    getTarget : function() {    	
    	  
      if (!this.target)
        return parent;
            		
      var elm = document.getElementById(this.target);  	 
      
  	  if (elm && elm.contentWindow)
  	    return elm.contentWindow;
          	
  	  throw "No Target Element found";  	  
    },  
    
    sendMessage : function(event, data) {
    	
  	  var msg = {};
  	  msg.event = event;
  	  msg.data = data;
  	
  	  var target = this.getTarget();
  	  target.postMessage(JSON.stringify(msg),'*');
    },
	  
    setListener : function(listener) {
  	
  	  var that = this;
  	  
  	  if (!this.listener)
  	    window.addEventListener("message", function(event) { that.onMessage(event); }, false);
    	   	 
  	  this.listener = listener;
    },
    
    getListener : function() {
    	return this.listener;
    },
  
    onMessage : function(event) {
       // Do we trust the sender of this message?
      //if (event.origin !== "http://example.com:8080")
      //  return;
    
      if (!this.listener)
        return;
              
      var msg = JSON.parse(event.data);      
      this.listener(msg.event, msg.data);
    }
  } ;
    
  if (!exports.net)
    exports.net = {};
  
  if (!exports.net.tschmid)
    exports.net.tschmid = {};
  
  if (!exports.net.tschmid.sieve)
    exports.net.tschmid.sieve = {};

  if (!exports.net.tschmid.sieve.broker)
    exports.net.tschmid.sieve.broker = {};
  
  // Export the constructor...
  exports.net.tschmid.sieve.Broker = SieveBroker;
  
}(window));
  