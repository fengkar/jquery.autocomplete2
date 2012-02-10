#!/bin/bash

# this script path 
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# minify with compiler
java -jar /usr/local/bin/compiler.jar --js \
$SCRIPT_DIR/jquery.autocomplete2.js \
--js_output_file $SCRIPT_DIR/jquery.autocomplete2.min.js

echo "Build complete"