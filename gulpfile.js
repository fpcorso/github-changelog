// Our main Gulp plugins
var gulp       = require( 'gulp' );
var htmlclean  = require( 'gulp-htmlclean' );
var concat     = require( 'gulp-concat' );
var deporder   = require( 'gulp-deporder' );
var stripdebug = require( 'gulp-strip-debug' );
var uglify     = require( 'gulp-uglify' );
var minifyCSS  = require( 'gulp-csso' );
var less       = require( 'gulp-less' );
var del        = require( 'del' );

// Relevant folders
var folder = {
	src: 'src/',
	build: 'build/'
}

// HTML Task: Cleans HTML
gulp.task( 'html', function() {
	return gulp.src( folder.src + '*.html' )
		.pipe( htmlclean() )
		.pipe( gulp.dest( folder.build ) )
});

// JS Task: Concats all JS and uglifies
gulp.task( 'js', function() {
	return gulp.src( folder.src + 'js/*.js' )
		.pipe( deporder() )
		.pipe( concat( 'app.js' ) )
		.pipe( uglify() )
		.pipe( gulp.dest( folder.build + 'js' ) )
});

// CSS Task: Concats all CSS and minifies
gulp.task( 'css', function() {
	return gulp.src( folder.src + 'less/*.less' )
		.pipe( less() )
		.pipe( minifyCSS() )
		.pipe( gulp.dest( folder.build + 'css' ) )
});

// Deletes all build files
gulp.task( 'reset', function() {
	del( 'build/**/*' ).then( function( paths ) {
		console.log( 'Deleted files and folders:\n', paths.join( '\n' ) );
	});
})

// Sets up watch task
gulp.task( 'watch', function() {
	gulp.watch( folder.src + '**/*', [ 'build' ] );
});

// Build the site
gulp.task( 'build', [ 'html', 'css', 'js' ], function() {
	return gulp.src( folder.src + 'assets/**/*' )
		.pipe( gulp.dest( folder.build + 'assets' ) )
});

// Default task
gulp.task( 'default', [ 'build', 'watch' ] );