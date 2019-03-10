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
	DEBUG=page-loader npm test

test-watch:
	npm test --watch

go:
	rm -rf dist
	rm -rf tost
	mkdir tost
	npm run build
	./dist/bin/page-loader.js --output /Users/snokke/Snoke/Hexlet/page-loader-hexlet-project3/tost https://www.youtube.com/