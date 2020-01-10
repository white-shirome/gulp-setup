var gulp = require("gulp"); //gulp : 4以上
var sass = require("gulp-sass"); //sassのコンパイルプラグイン
var autoprefixer = require("gulp-autoprefixer"); //ベンダープレフィックスを付与
var notify = require("gulp-notify"); //エラー通知
var plumber = require("gulp-plumber"); //自動停止を削除
var browserSync = require("browser-sync"); //ブラウザー自動更新
var reload = browserSync.reload;
var sourcemaps = require("gulp-sourcemaps"); // ソースマップ
// var minify = require('gulp-minify-css'); // cssの圧縮
var uglify = require("gulp-uglify"); // 圧縮
/* 画像圧縮系のプラグイン */
var isChanged = require("gulp-changed");
var minifyImg = require("gulp-imagemin");
var minifyImg_JPG = require("imagemin-jpeg-recompress");
var minifyImg_JPG = require("imagemin-mozjpeg");
var minifyImg_PNG = require("imagemin-pngquant");
var minifyImg_GIF = require("imagemin-gifsicle");

/* ---------- インストールコマンド ---------- */
/**
 * 
 * npm i -D gulp gulp-sass gulp-autoprefixer gulp-notify gulp-plumber browser-sync gulp-sourcemaps gulp-uglify gulp-changed
 */

/**
 * 画像圧縮をするなら
 *  gulp-imagemin imagemin-jpeg-recompress imagemin-pngquant imagemin-gifsicle
 */
/* ---------- インストールコマンド ---------- */

// sass
gulp.task("sass", function (done) {
    gulp
        .src("src/scss/**/*.scss")
        .pipe(
            plumber({
                errorHandler: notify.onError("Error: <%= error.message %>")
            })
        )
        .pipe(sass())
        .pipe(
            autoprefixer({
                cascade: false
            })
        )
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dist/css/"))
        .pipe(browserSync.stream());

    done();
});

// js
gulp.task("js", function (done) {
    gulp
        .src("src/js/*.js")
        .pipe(
            plumber({
                errorHandler: notify.onError("Error: <%= error.message %>")
            })
        )
        .pipe(sourcemaps.write())
        .pipe(uglify())
        .pipe(gulp.dest("dist/js/"));

    done();
});

// html
gulp.task("html", function (done) {
    gulp
        .src("src/*.html")
        .pipe(
            plumber({
                errorHandler: notify.onError("Error: <%= error.message %>")
            })
        )
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./dist/"));

    done();
});

// image
gulp.task("image", function (done) {
    gulp
        .src("src/img/*.+(jpg|jpeg|png|gif)")
        .pipe(isChanged("dist"))
        .pipe(
            plumber({
                errorHandler: notify.onError("Error: <%= error.message %>")
            })
        )
        .pipe(minifyImg(
            [minifyImg_JPG({
                    quality: 'low',
                    method: 'smallfry',
                    quality: 85,
                    max: 80,
                    loops: 10,
                    progressive: true,
                }),
                minifyImg_PNG({
                    quality: '40-80',
                    speed: 1
                }),
                minifyImg_GIF({
                    interlaced: false, // 
                    optimizationLevel: 3, // 1 - 3
                    colors: 100 // 2 - 256
                })
            ]
        ))
        .pipe(gulp.dest("dist/img/"))
        .pipe(browserSync.stream());

    done();
});

// server
gulp.task("server", function (done) {
    browserSync.init({
        server: {
            baseDir: "dist/",
            index: "index.html"
        }
    });

    done();
});

gulp.task("watch", function (done) {
    gulp.watch("src/*.html", gulp.series("html")).on("change", reload);
    gulp.watch("src/js/*.js", gulp.series("js")).on("change", reload);
    gulp.watch("src/scss/**/*.scss", gulp.series("sass"));
    gulp.watch(["src/*.*"], gulp.task("image"));

    done();
});

gulp.task("default", gulp.parallel("watch", "server"));
