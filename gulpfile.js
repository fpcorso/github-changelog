// Our main Gulp plugins
const { src, dest, parallel, series } = require('gulp');
const htmlclean  = require( 'gulp-htmlclean' );
const concat     = require( 'gulp-concat' );
const deporder   = require( 'gulp-deporder' );
const stripdebug = require( 'gulp-strip-debug' );
const uglify     = require( 'gulp-uglify' );
const minifyCSS  = require( 'gulp-csso' );
const del        = require( 'del' );

// Relevant folders
const folder = {
	src: 'src/',
	build: 'build/'
};

// HTML Task: Cleans HTML
function html() {
	return src( folder.src + '*.html' )
		.pipe( htmlclean() )
		.pipe( dest( folder.build ) )
}

// JS Task: Concats all JS and uglifies
function js() {
	return src( folder.src + 'js/*.js' )
		.pipe( deporder() )
		.pipe( concat( 'app.js' ) )
		//.pipe( uglify() )
		.pipe( dest( folder.build + 'js' ) )
}

// CSS Task: Concats all CSS and minifies
function css() {
	return src( folder.src + 'css/*.css' )
		.pipe( minifyCSS() )
		.pipe( dest( folder.build + 'css' ) )
}

// Deletes all build files
function reset(cb) {
	del( 'build/**/*' ).then( function( paths ) {
		console.log( 'Deleted files and folders:\n', paths.join( '\n' ) );
	});
	cb();
}

exports.default = series(reset, parallel(html, js, css));