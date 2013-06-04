#
# For the jsdoc and jshint targets, the following binaries need to be installed
# and available in your PATH:
#
#   * jsdoc (https://github.com/jsdoc3/jsdoc)
#   * jshint (https://github.com/jshint/jshint/)
#
# Both can be installed via NPM.
#

WORKSPACE=${CURDIR}

CLOSURE=java -jar lib/closure/compiler.jar

#
# make targets:
#

default: build

mkjsdoc:
	mkdir -p ${WORKSPACE}/jsdoc

doc: jsdoc
jsdoc: mkjsdoc
	jsdoc  -d ${WORKSPACE}/jsdoc/ ${WORKSPACE}/src/farbs.js

jshint:
	jshint ${WORKSPACE}/src/farbs.js

minify:
	${CLOSURE} --js src/farbs.js --js_output_file src/farbs.min.js

build: jshint minify
