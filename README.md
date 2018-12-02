# Загрузчик страниц (Hexlet Project 3)

[![Maintainability](https://api.codeclimate.com/v1/badges/f3f0d04da86250976590/maintainability)](https://codeclimate.com/github/Snokke/project-lvl3-s358/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/f3f0d04da86250976590/test_coverage)](https://codeclimate.com/github/Snokke/project-lvl3-s358/test_coverage)
[![Build Status](https://travis-ci.org/Snokke/project-lvl3-s358.svg?branch=master)](https://travis-ci.org/Snokke/project-lvl3-s358)

## Install
```sh
npm install -g page-loader-snokke
```

## Description
```
Program for download pages from web

Options:
  -V, --version          output the version number
  -o, --output [folder]  output folder (default: current folder)
  -h, --help             output usage information
```

## Usage
```
bash-3.2$ page-loader --output /Users/snokke/test https://www.youtube.com/

  ✔ https://www.youtube.com/yts/img/pixel-vfl3z5WfW.gif
  ✔ https://www.youtube.com/yts/jsbin/scheduler-vfl2iJIO4/scheduler.js
  ✔ https://www.youtube.com/yts/jsbin/spf-vflhSOzLf/spf.js
  ✔ https://www.youtube.com/yts/jsbin/www-en_US-vfliyqPoO/base.js
  ✔ https://www.youtube.com/yts/cssbin/www-core-vflKmIJhL.css
  ✔ https://www.youtube.com/yts/cssbin/www-home-c4-vflgGC6wm.css
  ✔ https://www.youtube.com/yts/cssbin/player-vflDka7MU/www-player.css
  ✔ https://www.youtube.com/yts/cssbin/www-pageframe-vfl2QekqP.css
  ✔ https://www.youtube.com/yts/cssbin/www-guide-vflNDDMf7.css
  ✔ https://www.youtube.com/manifest.json
  ✔ https://www.youtube.com/yts/img/favicon_32-vflOogEID.png
  ✔ https://www.youtube.com/yts/img/favicon_48-vflVjB_Qk.png
  ✔ https://www.youtube.com/yts/img/favicon_96-vflW9Ec0w.png
  ✔ https://www.youtube.com/yts/img/favicon_144-vfliLAfaB.png
  
Succesfully download HTML page: 'www-youtube-com.html' to '/Users/snokke/test/'
```

## Asciinema`s
Step 1. Download html - [Asciinema](https://asciinema.org/a/th1vMEzRVOHX8JRhyjdf1pBgp?speed=3)

Step 2. Download all files for html - [Asciinema](https://asciinema.org/a/leQKFxxSzpYEz43vnbdnvwd1S?speed=3)

Step 3. Debug - [Asciinema](https://asciinema.org/a/Kzn14DSkGea4des9mt8dlr4SJ?speed=3)

Step 4. Errors processing - [Asciinema](https://asciinema.org/a/1OB6oEwyS3qWnZRFyzGjVtFmb?speed=3)

Step 5. Listr - [Asciinema](https://asciinema.org/a/uq3vxuBSnSiCBQo0YXpqktZ0j)