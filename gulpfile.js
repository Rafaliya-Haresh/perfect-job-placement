'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var pump = require('pump');



gulp.task('sass', function() {
    return gulp.src('./public/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/css/sass'));
});

gulp.task('default', ['sass'], function() {
    nodemon({
        script: 'local.js',
        ext: 'js html',
        env: {},
        ignore: ['public']
    });
    gulp.watch('./public/sass/*.scss', ['sass']);
});



var script1 = [
    './public/libs/jQuery/dist/jquery.min.js',
    './public/libs/bootstrap/dist/js/bootstrap.min.js',
    './public/libs-custom/jquery-ui/jquery-ui-1.9.2.js',
    './public/libs-custom/sidr/jquery.sidr.js'
];

var script2 = [
    './public/libs-custom/date-utils.min.js',
    './public/libs-custom/dropzone/dropzone.js',
    './public/libs-custom/color-box/jquery.justifiedGallery.min.js',
    './public/libs-custom/color-box/jquery.colorbox-min.js',
    './public/libs/keyboardjs/dist/keyboard.min.js',
    './public/libs-custom/moment/moment.min.js',
    './public/libs-custom/fullcalendar/fullcalendar.js',
    './public/libs-custom/bgrins-spectrum/spectrum.js',
    './public/libs/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js'
];

var script3 = [
    './public/libs/angular/angular.min.js',
    './public/libs/angular-route/angular-route.js',
    './public/libs/angular-toastr/dist/angular-toastr.tpls.js',
    './public/libs/angular-sanitize/angular-sanitize.min.js',
    './public/libs/angular-ui-router/release/angular-ui-router.min.js',
    './public/libs/angular-resource/angular-resource.min.js',
    './public/libs/angular-mocks/angular-mocks.js',
    './public/libs/angular-cookies/angular-cookies.js',
    './public/libs/angular-bootstrap/ui-bootstrap-tpls.js',
    './public/libs/angular-animate/angular-animate.min.js',
    './public/libs-custom/ng-sortable/ng-sortable.min.js',
    './public/libs-custom/bootstrap-datepicker/bootstrap-datepicker.js',
    './public/libs/angular-ui-switch/angular-ui-switch.min.js',
    './public/libs/angularjs-dropdown-multiselect/src/angularjs-dropdown-multiselect.js',
    './public/libs/ng-scrollbars/dist/scrollbars.min.js'
];


var script4 = [
    './public/js/common.js',
    './public/angular/routes/icMean.js',
    './public/angular/controllers/ib-sections/estimation-module.js',
    './public/angular/controllers/user.js',
    './public/angular/controllers/ib-common.js',
    './public/angular/controllers/ib-boards.js',
    './public/angular/controllers/ib-details.js',
    './public/angular/controllers/ib-column.js',
    './public/angular/controllers/ib-card.js',
    './public/angular/controllers/ib-child-board.js',
    './public/angular/controllers/ib-team.js',
    './public/angular/controllers/ib-socket.js',
    './public/angular/services/global.js',
    './public/angular/services/icMean.js',
    './public/angular/services/ib-boards.js',
    './public/angular/services/ib-details.js',
    './public/angular/config/config.js',
];




//
var cssFiles = [
    './public/libs/bootstrap/dist/css/bootstrap.min.css',
    './public/fonts/themify-icons/themify-icons.min.css',
    './public/fonts/weather-icons/css/weather-icons.min.css',
    './public/libs/angular-toastr/dist/angular-toastr.css',
    './public/libs/font-awesome/css/font-awesome.css',
    './public/css/old/ideaboard.css',
    './public/css/old/ic-ideaboard-v1.css',
    './public/css/old/main.css',
    './public/css/old/ic-hack.css',
    './public/css/old/ic-ideaboard.css',
    './public/css/old/app.css',
    './public/css/old/noise.css',
    './public/libs-custom/fullcalendar/fullcalendar.css',
    './public/libs-custom/ng-sortable/ng-sortable.min.css',
    './public/libs-custom/ng-sortable/ng-sortable.style.min.css',
    './public/libs-custom/bootstrap-datepicker/datepicker3.css',
    './public/libs-custom/color-box/colorbox.css',
    './public/css/ib-custom.css',
    './public/libs/angular-ui-switch/angular-ui-switch.min.css',
    './public/libs-custom/sidr/jquery.sidr.light.css',
    './public/libs-custom/dropzone/dropzone.css',
    './public/libs-custom/bgrins-spectrum/spectrum.css',
    './public/css/sass/global.css',
];



gulp.task('min-css', function() {
    return gulp.src(cssFiles)
        .pipe(cleanCSS({
            compatibility: 'ie8',
            rebase: false
        }))
        .pipe(concat('final.min.css'))
        .pipe(gulp.dest('./public/iccaches/'));
});



gulp.task('js-1', function() {
    return gulp.src(script1)
        .pipe(concat('script-1.min.js'))
        .pipe(gulp.dest('public/iccaches/'));
});

gulp.task('js-2', function() {
    return gulp.src(script2)
        .pipe(concat('script-2.min.js'))
        .pipe(gulp.dest('public/iccaches/'));
});

gulp.task('js-3', function() {
    return gulp.src(script3)
        .pipe(concat('script-3.min.js'))
        .pipe(gulp.dest('public/iccaches/'));
});

gulp.task('js-4', function() {
    return gulp.src(script4)
        .pipe(concat('script-4.min.js'))
        .pipe(gulp.dest('public/iccaches/'));
});


//
gulp.task('js', ['js-1', 'js-2', 'js-3', 'js-4']);

//
gulp.task('all', ['min-css', 'js']);
