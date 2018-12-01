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