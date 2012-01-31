;(function($, win, doc) {
  
  // String splice from http://stackoverflow.com/questions/4313841/javascript-how-can-i-insert-a-string-at-a-specific-index#answer-4314050
  String.prototype.splice = function( idx, rem, s ) {
    return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
  };
  
  $.tagz = function($el, options) {
    // Default settings
    var defaults = {
      anywhere: false, // search anywhere in tag
      tags: null  // Content that will be loaded into modal
    };
    
    var plugin = this,  // Use the plugin var to access the modalw object everywhere
        $doc = $(doc),  // Keep document in a var
        $win = $(win);  // Keep window in a var
    
    // Object to hold the merged default and user-provided options
    plugin.settings = {};
    
    // Private
    // The "constructor" that gets called when object is created
    var init = function() {
      
      // merge default and user-provided options
      plugin.settings = $.extend({}, defaults, options);
      
      // make the collection of target elements available throughout the plugin
      // by making it a public property
      plugin.$el = $el;
      
      
      // default possible suggestions to all tags
      plugin.possible_suggestions = plugin.settings.tags;
      
      // setup event listners
      event_listners();
      
      // create modal window
      wrap_el();
      
    };
    
    // Private
    // Setup event listners
    var event_listners = function() {
      
      // Listen on keyup
      plugin.$el.keyup(function(e) {
        
        // input value
        var val = $(this).val();
        
        switch(e.keyCode){
          case 8: // backspace
            plugin.reset_possible_suggestions(); // reset possible suggestions
          case 37: // arrow left
            // do something
          case 38: // arrow up
            // do something
          case 39: // arrow right
            // do something
          case 40: // arrow down
            // do something
          default:
            // do something
        }
         
        update_possible_suggestions(val);
        show_list(val);
      });
      
    };
    
    // Private
    // Wrap input with elements
    var wrap_el = function() {
      
      // wrap el and create tag list el
      plugin.$el.wrap('<div class="tagz-wrapper" />').after('<ul></ul>');
      
      // store list el
      plugin.$list = plugin.$el.siblings('ul');
      
    };
    
    
    // Private
    // Loop possible suggestions and refine it
    var update_possible_suggestions = function(string) {
      
      // array to hold new possible suggestions
      var new_possible_suggestions = [],
      // string length
      strlen = string.length,
      // lowercase string
      string = string.toLowerCase();
        
      // loop possible suggestions
      for (var i = plugin.possible_suggestions.length - 1; i >= 0; i--) {
        
        if (plugin.settings.anywhere) {
          // check if its a possible suggestions
          if (plugin.possible_suggestions[i].toLowerCase().indexOf(string) >= 0)
            // push string
            new_possible_suggestions.push(plugin.possible_suggestions[i]);
        } else {
          
          // check if its a possible suggestions
          if (plugin.possible_suggestions[i].toLowerCase().substr(0, strlen) == string)
            // push string
            new_possible_suggestions.push(plugin.possible_suggestions[i]);
        }
      }
      
      // replace possible suggestions with new ones
      plugin.possible_suggestions = new_possible_suggestions;
      
    };
    
    var show_list = function(input_val) {
      // suggestions
      var suggestions = '';
      
      // loop possible suggestions
      for (var i = plugin.possible_suggestions.length - 1; i >= 0; i--) {
        suggestions += list_item(plugin.possible_suggestions[i], input_val);
      }
      
      // update list with new suggestions
      plugin.$list.html(suggestions);
    };
    
    var list_item = function(tag, input_val) {
      if (plugin.settings.anywhere)
        // return list el with highlighted matched input value in tag
        return '<li>'+tag.splice(tag.indexOf(input_val), input_val.length, '<span>'+input_val+'</span>')+'</li>';
      else
        // return list el with highlighted matched input value in tag
        return '<li><span>'+input_val+'</span>'+tag.substr(input_val.length)+'</li>';
      
      
    };
    
    // Public
    // Reset possible suggestions
    plugin.reset_possible_suggestions = function() {
      
      // reset possible suggestions to all tags
      plugin.possible_suggestions = plugin.settings.tags;
    };
    
    // Call the "constructor"
    init();
    
  };
  
})(jQuery, window, document);