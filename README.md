# autocomplete2
A autocomplete jQuery plugin, similar, but more lightweight than http://jqueryui.com/demos/autocomplete/.

## Usage
Include autocomplete2 like this
    
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
    <script src="jquery.autocomplete2.js"></script>

```javascript

// array with possible suggestions
var towns = 'seoul', 'são paulo', 'bombay', 'jakarta', 'karachi', 'moskva', 'istanbul', 'mexico city', 'shanghai', 'tokyo', 'new york', 'bangkok', 'beijing', 'delhi', 'london', 'hongkong', 'cairo', 'tehran', 'bogota', 'bandung', 'tianjin', 'lima', 'roma', 'taipei', 'osaka', 'kiev', 'yangon', 'toronto', 'zibo', 'dalian', 'taegu', 'addis ababa', 'jinan', 'salvador', 'inchon', 'semarang', 'giza', 'changchun', 'havanna', 'nagoya', 'belo horizonte', 'paris', 'tashkent', 'fortaleza', 'sukabumi', 'cali', 'guayaquil', 'qingdao', 'izmir', 'cirebon', 'taiyuan', 'brasilia', 'bucuresti', 'faisalabad', 'quezon city', 'medan', 'houston', 'mashhad', 'medellín', 'kanpur', 'budapest', 'caracas';

var autocomplete = new $.autocomplete2($('#example1'), {
  suggestions: towns,
  on_complete: function(value) {
    // do something on on complete
    $('body').append(value+' ');
  },
  on_focus: function() {
    // console.log('focus');
  },
  on_blur: function() {
    // console.log('blur');
  }
});

```

## Size
≈ 3.8kb minified

## Depedencies
jQuery (developed with v. 1.7.1)

## Browser support
Tested and works perfect in IE7, IE8, IE9, Chrome (17), FireFox (10), Opera (11)