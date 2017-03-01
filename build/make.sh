#! /bin/bash
../node_modules/hogan.js/bin/hulk ../src/themes/bootstrap/*.mustache ../src/themes/bootstrap/advanced/berry_tabs_fieldset.mustache ../src/themes/bootstrap/render/berry_tabs.mustache ../src/themes/bootstrap/advanced/modal.mustache > ../bin/bootstrap.berry.js
../node_modules/hogan.js/bin/hulk ../src/themes/bootstrap/*.mustache ../src/themes/bootstrap/render/*.mustache ../src/themes/bootstrap/advanced/*.mustache > ../bin/bootstrap.full.berry.js
../node_modules/minify/bin/minify.js ../src/core.berry.js ../src/field.berry.js ../src/events.berry.js ../src/init.berry.js ../src/duplicate.berry.js ../src/conditions.berry.js  ../src/validations.berry.js ../src/fields/*.js > ../bin/berry.min.js
../node_modules/minify/bin/minify.js ../src/render/tabs.berry.js ../src/enhance/modal.berry.js ../bin/bootstrap.berry.js > ../bin/bootstrap.berry.min.js
../node_modules/minify/bin/minify.js ../src/core.berry.js ../src/field.berry.js ../src/events.berry.js ../src/init.berry.js ../src/duplicate.berry.js ../src/conditions.berry.js  ../src/validations.berry.js ../src/fields/*.js ../src/enhance/*.js ../src/advanced/*.js ../src/render/*.js > ../bin/full.berry.min.js
cat ../src/core.berry.js ../src/field.berry.js ../src/events.berry.js ../src/init.berry.js ../src/duplicate.berry.js ../src/conditions.berry.js  ../src/validations.berry.js ../src/fields/*.js ../src/enhance/*.js ../src/advanced/*.js ../src/render/*.js > ../bin/full.berry.js
cp ../bin/full.berry.js ../docs/assets/js/full.berry.js

# cp ./bin/berry.min.js ./examples/assets/
# cp ./bin/bootstrap.berry.js ./examples/assets/
# cp ./bin/berry.min.js ./assets/js/
# cp ./bin/bootstrap.berry.js ./assets/js/
