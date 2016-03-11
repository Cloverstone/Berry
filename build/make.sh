#! /bin/bash
hulk ./src/themes/bootstrap/*.mustache ./src/themes/bootstrap/advanced/berry_tabs_fieldset.mustache ./src/themes/bootstrap/render/berry_tabs.mustache ./src/themes/bootstrap/advanced/modal.mustache > ./bin/bootstrap.berry.js
hulk ./src/themes/bootstrap/*.mustache ./src/themes/bootstrap/render/*.mustache ./src/themes/bootstrap/advanced/*.mustache > ./bin/bootstrap.full.berry.js
minify ./src/core.berry.js ./src/field.berry.js  ./src/events.berry.js ./src/init.berry.js  ./src/duplicate.berry.js ./src/conditions.berry.js  ./src/validations.berry.js ./src/fields/*.js > ./bin/berry.min.js
minify ./src/render/tabs.berry.js ./src/enhance/modal.berry.js ./bin/bootstrap.berry.js > ./bin/bootstrap.berry.min.js
minify ./src/core.berry.js ./src/field.berry.js  ./src/events.berry.js ./src/init.berry.js ./src/duplicate.berry.js ./src/conditions.berry.js  ./src/validations.berry.js ./src/fields/*.js ./src/enhance/*.js ./src/advanced/*.js ./src/render/*.js > ./bin/full.berry.min.js

# cp ./bin/berry.min.js ./examples/assets/
# cp ./bin/bootstrap.berry.js ./examples/assets/
# cp ./bin/berry.min.js ./assets/js/
# cp ./bin/bootstrap.berry.js ./assets/js/
