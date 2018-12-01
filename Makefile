install:
	npm install

run:
	npx babel-node -- 'src/bin/page-loader.js'

publish:
	npm publish

lint:
	npx eslint .

build:
	rm -rf dist
	npm run build

test:
	npm test

test-watch:
	npm test --watch

go:
	rm -rf dist
	rm -rf tost
	mkdir tost
	npm run build
	./dist/bin/page-loader.js --output /Users/snokke/Snoke/Hexlet/project-lvl3-s358/tost https://svetlana-maksimenko.com