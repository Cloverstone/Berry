#! /bin/bash
hulk ./src/js/themes/bootstrap/*.mustache ./src/js/themes/bootstrap/advanced/berry_tabs_fieldset.mustache ./src/js/themes/bootstrap/render/berry_tabs.mustache ./src/js/themes/bootstrap/advanced/modal.mustache > ./bin/bootstrap.berry.js
hulk ./src/js/themes/bootstrap/*.mustache ./src/js/themes/bootstrap/render/*.mustache ./src/js/themes/bootstrap/advanced/*.mustache > ./bin/bootstrap.full.berry.js
minify ./src/js/*.js ./src/js/fields/*.js > ./bin/berry.min.js
minify ./src/js/render/tabs.berry.js ./src/js/enhance/modal.berry.js ./bin/bootstrap.berry.js > ./bin/bootstrap.berry.min.js
minify ./src/js/core.berry.js ./src/js/field.berry.js  ./src/js/events.berry.js ./src/js/init.berry.js ./src/js/duplicate.berry.js ./src/js/conditions.berry.js  ./src/js/validations.berry.js ./src/js/fields/*.js ./src/js/enhance/*.js ./src/js/advanced/*.js ./src/js/render/*.js > ./bin/full.berry.min.js

cp ./bin/berry.min.js ./examples/assets/
cp ./bin/bootstrap.berry.js ./examples/assets/
cp ./bin/berry.min.js ./assets/js/
cp ./bin/bootstrap.berry.js ./assets/js/
