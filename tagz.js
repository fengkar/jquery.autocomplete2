;(function($) {
  
  // String splice from http://stackoverflow.com/questions/4313841/javascript-how-can-i-insert-a-string-at-a-specific-index#answer-4314050
  String.prototype.splice = function( idx, rem, s ) {
    return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
  };
  
  $.tagz = function($el, options) {
    // Default settings
    var defaults = {
      anywhere: false, // search anywhere in tag
      tags: null,  // tags that will ge searched for
      max_suggestions: 4, // max suggestions
      on_add_tag: function() {} // Tag added callback
    };
    
    // Use the plugin var to access the modalw object everywhere
    var plugin = this;
    
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
      
      // has suggestions defaults to false
      plugin.has_suggestions = false;
      
      // default possible suggestions to all tags
      plugin.possible_suggestions = plugin.settings.tags;
      
      // default typed
      plugin.typed_val = plugin.$el.val();
      
      // reset list pos
      reset_list_pos();
      
      // create modal window
      wrap_el();
      
      // setup event listners
      event_listners();
      
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
            update_possible_suggestions(val);
            show_list(val);
            
            // if we are back at zero
            if (val.length == 0) {
              hide_suggestions();
              clear_helper();
            }
            break;
          case 13: // enter
            if (val.length)
              add_tag();
            break;
          case 27: // escape
            // reset
            plugin.reset_possible_suggestions();

            // hide suggestions
            hide_suggestions();

            // clear helper
            clear_helper();
            break;
          case 37: // arrow left
            // console.log('left');
            break;
          case 38: // arrow up
            // increment list pos
            plugin.list_pos--;
            if (plugin.list_pos >= 0) {
              move_in_list();
            } else {
              // if we are hitting -2
              if (plugin.has_suggestions) {
                if (plugin.list_pos == -2) {
                  // set list pos to last item in list
                  plugin.list_pos = plugin.$suggestion_list_items.length - 1;
                  
                  // move in list
                  move_in_list();
                } else {
                  set_typed_val();
                  deselect_list();
                }
              }
            }
            break;
          case 39: // arrow right
            if (val.length)
              complete_helper();
            break;
          case 40: // arrow down
            if (plugin.has_suggestions) {
              // decrement list pos
              plugin.list_pos++;
              if (plugin.list_pos <= plugin.$suggestion_list_items.length) {
                move_in_list();
              } else {
                plugin.list_pos = 0;
                move_in_list();
              }
            }
            break;
          default:
            
            // update typed val
            plugin.typed_val = val;
            
            // if we have something
            if (val.length) {
            
              // if there are possible suggestions
              if (plugin.possible_suggestions.length) {
                update_possible_suggestions(val);
                show_list(val);
              } else {
                hide_suggestions();
              }
              
            }
            break;
        }
        
      });
      
      plugin.$suggestion_list.on('click', 'li', function(e) {
        plugin.$el.val($(this).text());
        add_tag();
      }).on('hover', 'li', function() {
        plugin.list_pos = $(this).index();
        $(this).addClass('active').siblings().removeClass('active');
      });
      
    };
    
    // Private
    // Wrap input with elements
    var wrap_el = function() {
      
      // wrap el and create tag list el
      plugin.$el.wrap('<div class="tagz-wrapper" />').after('<ul class="suggestions"></ul>').before('<div class="helper" />');
      
      // store list el
      plugin.$suggestion_list = plugin.$el.siblings('.suggestions');
      
      // store helper
      plugin.$helper = plugin.$el.siblings('.helper');
      
    };
    
    // Private
    // Loop possible suggestions and refine it
    var update_possible_suggestions = function(string) {
      
      // has suggestions
      plugin.has_suggestions = true;
      
      // array to hold new possible suggestions
      var new_possible_suggestions = [],
      // string length
      strlen = string.length,
      // lowercase string
      string = string.toLowerCase(),
      // suggestion_count index
      suggestion_count = 0;
      
      // loop possible suggestions
      for (var i = plugin.possible_suggestions.length - 1; i >= 0; i--) {
        
        if (plugin.settings.anywhere) {
          // check if its a possible suggestions
          if (plugin.possible_suggestions[i].toLowerCase().indexOf(string) >= 0) {
            // unshift string
            new_possible_suggestions.unshift(plugin.possible_suggestions[i]);
          }
        } else {
          
          // check if its a possible suggestions
          if (plugin.possible_suggestions[i].toLowerCase().substr(0, strlen) == string) {
            // unshift string
            new_possible_suggestions.unshift(plugin.possible_suggestions[i]);
          }
        }
      }
      
      // replace possible suggestions with new ones
      plugin.possible_suggestions = new_possible_suggestions;
      
    };
    
    // Private
    // Show suggestion list
    var show_list = function(input_val) {
      // suggestions
      var suggestions = [];
      
      // loop possible suggestions
      for (var i = plugin.possible_suggestions.length - 1; i >= 0; i--) {
        
        // add list item to beginning of suggestions
        suggestions.unshift(list_item(plugin.possible_suggestions[i], input_val));
      }
      
      // remove items we dont need
      suggestions.splice(plugin.settings.max_suggestions, suggestions.length-plugin.settings.max_suggestions);
      
      // update list with new suggestions and remove commas
      plugin.$suggestion_list.html(suggestions.toString().replace(/,/g,''));
      
      // hold list elements
      plugin.$suggestion_list_items = plugin.$suggestion_list.find('li');
      
      // if there suggestions
      if (plugin.possible_suggestions.length) {
        
        // display list
        show_suggestions();
        
        // populate helper with first suggestion
        populate_helper(input_val, plugin.possible_suggestions[0]);
      } else {
        
        // hide suggestions
        hide_suggestions();
        
        // clear helper
        clear_helper();
      }
    };
    
    // Private
    // A list item
    var list_item = function(tag, input_val) {
      if (plugin.settings.anywhere)
        // return list el with highlighted matched input value in tag
        return '<li>'+tag.splice(tag.indexOf(input_val), input_val.length, '<span>'+input_val+'</span>')+'</li>';
      else
        // return list el with highlighted matched input value in tag
        return '<li><span>'+input_val+'</span>'+tag.substr(input_val.length)+'</li>';
      
    };
    
    // Private
    // Move up and down in list
    var move_in_list = function() {
      
      // clear helper
      clear_helper();
      
      // hold active item
      var $active_item = plugin.$suggestion_list_items.eq(plugin.list_pos);
      
      // remove active on all list items
      plugin.$suggestion_list_items.removeClass('active');
      
      // if we have an item
      if ($active_item.length) {
        // set active on current list item
        $active_item.addClass('active');

        // set suggestion with active items text
        set_suggestion($active_item.text());
      } else {
        // set input to last typed value
        set_typed_val();
      }
      
    };
    
    // Private
    // Deselect all list items
    var deselect_list = function() {
      plugin.$suggestion_list_items.removeClass('active');
    };
    
    // Private
    // Set suggestion in input
    var set_suggestion = function(text) {
      plugin.$el.val(text);
    };
    
    // Private
    // Add tag to tag list
    var add_tag = function() {
      var tag = plugin.$el.val();
      
      // clear list
      plugin.$el.val('');
      
      // reset
      plugin.reset_possible_suggestions();
      
      // hide suggestions
      hide_suggestions();
      
      // clear helper
      clear_helper();
      
      // focus on input
      plugin.$el.focus();
      
      // callback
      if (plugin.settings.on_add_tag && typeof plugin.settings.on_add_tag == 'function')
          // execute the callback function
          plugin.settings.on_add_tag(tag);
    };
    
    // Private
    // Hide suggestion list
    var show_suggestions = function() {
      plugin.$suggestion_list.show();
    };
    
    // Private
    // Hide suggestion list
    var hide_suggestions = function() {
      plugin.$suggestion_list.hide();
    };
    
    // Private
    // Reset list position
    var reset_list_pos = function() {
      // default list pos to -1 (nothing selected)
      plugin.list_pos = -1;
    };
    
    // Private
    // Populate helper with helper text
    var populate_helper = function(input_val, text) {
      plugin.$helper.html('<span>'+input_val+'</span>'+text.substr(input_val.length));
    };
    
    // Private
    // Clear helper
    var clear_helper = function() {
      plugin.$helper.html('');
    };
    
    // Private
    // Complete helper
    var complete_helper = function() {
      // set value
      plugin.$el.val(plugin.possible_suggestions[0]);
      
      
      // deselect
      deselect_list();
      
      // reset list pos
      reset_list_pos();
      
      // update last value
      plugin.typed_val = plugin.$el.val();
      
    };
    
    // Private
    // Set input to the last typed value
    var set_typed_val = function() {
      plugin.$el.val(plugin.typed_val);
    };
    
    // Public
    // Reset possible suggestions
    plugin.reset_possible_suggestions = function() {
      
      // reset possible suggestions to all tags
      plugin.possible_suggestions = plugin.settings.tags;
      
      // reset has_suggestions
      plugin.has_suggestions = false;
      
      // deselect
      deselect_list();
      
      // reset list pos
      reset_list_pos();
    };
    
    // Call the "constructor"
    init();
    
  };
  
})(jQuery);