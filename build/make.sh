#! /bin/bash
hulk ../src/js/themes/bootstrap/*.mustache > ../bin/bootstrap.berry.js
hulk ../src/js/themes/bootstrap/*.mustache ../src/js/themes/bootstrap/render/*.mustache ../src/js/themes/bootstrap/advanced/*.mustache > ../bin/bootstrap.full.berry.js
minify ../src/js/*.js ../src/js/enhance/validations.berry.js> ../bin/berry.min.js
minify ../src/js/*.js ../src/js/enhance/*.js ../src/js/advanced/*.js ../src/js/render/*.js > ../bin/full.berry.min.js

cp ../bin/berry.min.js ../examples/assets/
cp ../bin/bootstrap.berry.js ../examples/assets/