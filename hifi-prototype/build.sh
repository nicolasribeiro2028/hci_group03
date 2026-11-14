#!/bin/sh
# Rebuilds index.html from the parts in src/. Edit src/*, then run ./build.sh
cd "$(dirname "$0")" && cat src/head.html src/orig.css src/hifi.css src/hifi2.css src/body.html src/js1.js src/parser.js src/js2.js src/js3.js src/js5.js src/js6-stub.js src/js7.js src/js8.js src/js4.js src/dev.html > index.html && echo '</html>' >> index.html && echo built index.html
