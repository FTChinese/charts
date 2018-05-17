// generated on 2017-05-15 using generator-webapp 2.4.1
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync').create();
const del = require('del');
const wiredep = require('wiredep').stream;
const runSequence = require('run-sequence');
const fs = require('fs-jetpack');
const path = require('path');
const $ = gulpLoadPlugins();
const reload = browserSync.reload;

const rollup = require('rollup').rollup;
const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');


var dev = true;

gulp.task('styles', () => {
  return gulp.src('app/styles/*.scss')
    .pipe($.plumber())
    .pipe($.if(dev, $.sourcemaps.init()))
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['bower_components']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.if(dev, $.sourcemaps.write()))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});
/*
gulp.task('scripts', () => {
  //return gulp.src('app/scripts/**/ /*.js')
    /*.pipe($.plumber())
    .pipe($.if(dev, $.sourcemaps.init()))
    .pipe($.babel())
    .pipe($.if(dev, $.sourcemaps.write('.')))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(reload({stream: true}));
});
*/
gulp.task('scripts', () => {
  return gulp.src('app/scripts/**/*.js')
    .pipe(gulp.dest('.tmp/scripts'))
});


gulp.task('rollup', async () => {
  // TODO:关于rollup需要再认真学习一下

    const bundle = await rollup({
      input:`./es6/addFeatureToTable.js`,
      plugins:[
        babel({//这里需要配置文件.babelrc
          exclude:'node_modules/**'
        }),
        nodeResolve({
          jsnext:true,
        })
      // rollupUglify({}, minifyEs6)//压缩es6代码
      ]
    });

    await bundle.write({//返回promise，以便下一步then()
        file: `.tmp/scripts/addFeatureToTable.js`,
        format: 'iife',
        name:'addFeatureToTable',
        sourcemap: true,
        
    });
    browserSync.reload();
});



function lint(files) {
  return gulp.src(files)
    .pipe($.eslint({ fix: true }))
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
  return lint('app/scripts/**/*.js')
    .pipe(gulp.dest('app/scripts'));
});
gulp.task('lint:test', () => {
  return lint('test/spec/**/*.js')
    .pipe(gulp.dest('test/spec'));
});

gulp.task('html', ['styles', 'scripts'], () => {
  return gulp.src('app/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if(/\.js$/, $.uglify({compress: {drop_console: true}})))
    .pipe($.if(/\.css$/, $.cssnano({safe: true, autoprefixer: false})))
    .pipe($.if(/\.html$/, $.htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: {compress: {drop_console: true}},
      processConditionalComments: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    })))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin()))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    .concat('app/fonts/**/*'))
    .pipe($.if(dev, gulp.dest('.tmp/fonts'), gulp.dest('dist/fonts')));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', () => {
  runSequence(['clean', 'wiredep'], ['styles', 'rollup','scripts', 'fonts','copydata'], () => {
    browserSync.init({
      notify: false,
      port: 8080,
      server: {
        baseDir: ['.tmp', 'app'],
        routes: {
          '/bower_components': 'bower_components'
        }
      }
    });

    gulp.watch([
      'app/*.html',
      'app/images/**/*',
      '.tmp/fonts/**/*'
    ]).on('change', reload);

    gulp.watch('app/styles/**/*.scss', ['styles']);
    gulp.watch('app/scripts/**/*.js', ['scripts']);
    gulp.watch('app/es6/*.js',['rollup']);
    gulp.watch('app/fonts/**/*', ['fonts']);
    gulp.watch('bower.json', ['wiredep', 'fonts']);
  });
});

gulp.task('serve:dist', ['default'], () => {
  browserSync.init({
    notify: false,
    port: 8080,
    server: {
      baseDir: ['dist']
    }
  });
});

gulp.task('serve:test', ['scripts'], () => {
  browserSync.init({
    notify: false,
    port: 8080,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/scripts': '.tmp/scripts',
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch(['test/spec/**/*.js', 'test/index.html']).on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('app/styles/*.scss')
    .pipe($.filter(file => file.stat && file.stat.size))
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build', ['lint', 'html','images', 'fonts', 'extras'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', () => {
  return new Promise(resolve => {
    dev = false;
    runSequence(['clean', 'wiredep'], 'build', resolve);
  });
});

//MARK: Customized gulp functions
gulp.task('copy', ['build'], function () {
  const dest = 'dev_cms/chartist';
  // `api*` use make a `api*` directory under dest.
  return gulp.src(['dist/**/*'])
  .pipe(gulp.dest(`../${dest}`))
  .pipe(gulp.dest(`../testing/${dest}`));
});

function getRandomInt(min, max) {
  /**
   * @dest 生成min~max之间的随机整数，如果min和max都为整数，那么生成区间包含min,不包含max
   * @param min TYPE Number, the min value of the range min~max
   * @param max TYPE Number, the max value of the range min~max
   * @return TYPE Int, the random int between min~max, witch containing min ,not containg max
   */
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; 
}
function getNumberInNormalDistribution(mean,std_dev){//生成正态分布位伪随机数
  return mean+(randomNormalDistribution()*std_dev);
}

function randomNormalDistribution(){
  var u=0.0, v=0.0, w=0.0, c=0.0;
  do{
      //获得两个（-1,1）的独立随机变量
      u=Math.random()*2-1.0;
      v=Math.random()*2-1.0;
      w=u*u+v*v;
  }while(w==0.0||w>=1.0)
  //这里就是 Box-Muller转换
  c=Math.sqrt((-2*Math.log(w))/w);
  //返回2个标准正态分布的随机数，封装进一个数组返回
  //当然，因为这个函数运行较快，也可以扔掉一个
  //return [u*c,v*c];
  //return u*c;
  return Math.round(u*c);//四舍五入为整数
}

gulp.task('produceSimulatedData',()=>{
  /**
   * @dest:生成engagement模拟数据
   */
  const dataArr = [];
  const dataSize = 100;
  for(let i=0;i<dataSize;i++) {
    //const R = getRandomInt(0,91);
    const R = getNumberInNormalDistribution(5,2);
    //const F = getRandomInt(0,101);
    const F = getNumberInNormalDistribution(10,5);
    //const V = getRandomInt(0,201);
    const V = getNumberInNormalDistribution(13,4);

    const S = F * Math.sqrt(V) / (R + 1);
    const C = getRandomInt(0,4);
    const oneDataItem = {
      R,
      F,
      V,
      S,
      C
    };
    dataArr.push(oneDataItem);
  }

  const destFile = path.resolve('data','engagementData.json');
  fs.writeAsync(destFile, dataArr);
});

gulp.task('copydata',() => {
  return gulp.src('data/*.json')
    .pipe(gulp.dest('.tmp/data'));
})