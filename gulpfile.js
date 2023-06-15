// Cài đặt các biến
var gulp = require("gulp");
var browserSync = require("browser-sync").create();
var sass = require("gulp-sass")(require("sass"));
const sourcemaps = require('gulp-sourcemaps');

// Complete sass & inject into Brower

// Tạo task để xác định mở đường dẫn chính đến các file, chạy browerSync ở đây ta lưu trữ trong ./src. Nếu ta gọi hàm watch bằng cách đưa lệnh nào lồng vào sẵn thì không tách ra lệnh này
gulp.task("browserSync", function () {
  browserSync.init({
    server: {
      baseDir: "./src",
    },
  });
});

// Dùng để di chuyển scss và biên dịch file scss sang css bằng sass
gulp.task("sass", function () {
  return gulp
    .src([
      "./node_modules/bootstrap/scss/bootstrap.scss",
      "src/scss/**/*.scss","./node_modules/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css","./node_modules/animate.css/animate.css","./node_modules/swiper/swiper-bundle.css"
    ])
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("src/css"))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

// Dùng để di chuyển các file js cần thiết vào thư mục
gulp.task("js", function () {
  return gulp
    .src([
      "./node_modules/bootstrap/dist/js/bootstrap.js",
      "./node_modules/jquery/dist/jquery.js",
      "./node_modules/@popperjs/core/dist/umd/popper.js",
      "./node_modules/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.js","./node_modules/swiper/swiper-bundle.js","./node_modules/wowjs/dist/wow.js"
    ])
    .pipe(gulp.dest("src/js"))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

// Dùng để di chuyển các file map của thư viện như bootstrap, popper...
gulp.task("map", function () {
  return gulp
    .src([
      "./node_modules/bootstrap/dist/js/bootstrap.js.map",
      "./node_modules/@popperjs/core/dist/umd/popper.js.map","./node_modules/swiper/swiper-bundle.js.map"
    ])
    .pipe(gulp.dest("src/js"))
});

// dùng để di chuyển font awesome vào thư mục font
gulp.task("fonts", function () {
  return gulp
    .src("./node_modules/font-awesome/fonts/*")
    .pipe(gulp.dest("src/fonts"));
});

// dùng để di chuyển thư mục css của fontawesome vào css
gulp.task("fa", function () {
  return gulp
    .src("./node_modules/font-awesome/css/font-awesome.css")
    .pipe(gulp.dest("src/css"));
});

// Cach chay 1, với cách này thì không cần phải tạo task browserSync ở trên

// gulp.task("watch", function () {
//   browserSync.init({
//     server: {
//       baseDir: "./src",
//     },
//   });
//   gulp.watch("./src/scss/**/*.scss").on("change", gulp.series("sass"));
//   gulp.watch("./src/**/*.html").on("change", browserSync.reload);
//   gulp.watch("./src/css/*.css").on("change", browserSync.reload);
//   gulp.watch("./src/js/**/*.js").on("change", browserSync.reload);
// });

// gulp.task('default', 'watch');

// Cach chay 2
// Thiết lập chạy song song và nếu thay đổi ở file scss , js , html, css thì reload lại trang, gulp.parralled có thể chạy song song tiến trình, còn gulp.seriers thì chạy tuần tự.
gulp.task("watch", gulp.parallel("browserSync",'sass', function () {
  gulp.watch("./src/scss/**/*.scss").on("change", gulp.series("sass"));
  gulp.watch("./src/**/*.html").on("change", browserSync.reload);
  gulp.watch("./src/css/**/*.css").on("change", browserSync.reload);
  gulp.watch("./src/js/**/*.js").on("change", browserSync.reload);
}));

// Hàm chạy mặc định, nếu ta khi ta dùng terminal để chạy lệnh gulp, còn chạy từng bước xác định ta chạy theo kiểu 'gulp watch' hay tương tự như 'gulp sass'
gulp.task("default", gulp.series("sass", "js", "fonts", "fa","map", "watch"));