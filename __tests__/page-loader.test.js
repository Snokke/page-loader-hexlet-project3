import nock from 'nock';
import axios from 'axios';
import fs from 'fs';
import url from 'url';
import os from 'os';
import path from 'path';
import httpAdapter from 'axios/lib/adapters/http';
import loader from '../src';

axios.defaults.adapter = httpAdapter;
nock.disableNetConnect();

const originalHtmlPath = path.join(__dirname, '__fixtures__', 'original_index.html');
const htmlWithLocalLinksPath = path.join(__dirname, '__fixtures__', 'modified_index.html');
const imagePath = path.join(__dirname, '__fixtures__', 'image.jpg');
const scriptPath = path.join(__dirname, '__fixtures__', 'script.txt');
const linkPath = path.join(__dirname, '__fixtures__', 'style.css');


test('Download html', async () => {
  const host = 'https://hexlet.io';
  const pathname = '/courses';
  const body = '<html><head></head><body></body></html>';
  const filePath = url.format({ host, pathname });
  const tempDirName = path.join(os.tmpdir(), 'hexlet-');

  nock(host).get(pathname).reply(200, body);

  const tempDir = await fs.promises.mkdtemp(tempDirName);
  await loader(filePath, tempDir);
  const fileName = await fs.promises.readdir(tempDir);
  const tempFilePath = path.join(tempDir, fileName[0]);
  const data = await fs.promises.readFile(tempFilePath, 'utf8');

  expect(data).toBe(body);
});


test('Update html with local links', async () => {
  const host = 'https://hexlet.io';
  const pathname = '/';
  const pathnameImg = '/test/image.jpg';
  const pathnameScript = '/test/script.txt';
  const pathnameLink = '/test/style.css';
  const bodyForFiles = 'body';
  const filePath = url.format({ host, pathname });
  const tempDirName = path.join(os.tmpdir(), 'hexlet-');

  const originalHtml = await fs.promises.readFile(originalHtmlPath, 'utf8');
  const htmlWithLocalLinks = await fs.promises.readFile(htmlWithLocalLinksPath, 'utf8');

  nock(host)
    .get(pathname)
    .reply(200, originalHtml)
    .get(pathnameImg)
    .reply(200, bodyForFiles)
    .get(pathnameScript)
    .reply(200, bodyForFiles)
    .get(pathnameLink)
    .reply(200, bodyForFiles);

  const tempDir = await fs.promises.mkdtemp(tempDirName);
  await loader(filePath, tempDir);
  const fileName = await fs.promises.readdir(tempDir);

  const tempFilePath = path.join(tempDir, fileName[0]);
  const data = await fs.promises.readFile(tempFilePath, 'utf8');

  expect(data).toBe(htmlWithLocalLinks);
});

test('Download local files', async () => {
  const host = 'https://hexlet.io';
  const pathname = '/';
  const pathnameImg = '/test/image.jpg';
  const pathnameScript = '/test/script.txt';
  const pathnameLink = '/test/style.css';
  const filePath = url.format({ host, pathname });
  const tempDirName = path.join(os.tmpdir(), 'hexlet-');

  const originalHtml = await fs.promises.readFile(originalHtmlPath, 'utf8');
  const expectedImage = await fs.promises.readFile(imagePath, 'utf8');
  const expectedScript = await fs.promises.readFile(scriptPath, 'utf8');
  const expectedCss = await fs.promises.readFile(linkPath, 'utf8');

  nock(host)
    .get(pathname)
    .reply(200, originalHtml)
    .get(pathnameImg)
    .reply(200, expectedImage)
    .get(pathnameScript)
    .reply(200, expectedScript)
    .get(pathnameLink)
    .reply(200, expectedCss);

  const tempDir = await fs.promises.mkdtemp(tempDirName);
  await loader(filePath, tempDir);

  const jpgPath = path.join(tempDir, 'hexlet-io_files/test-image.jpg');
  const jsPath = path.join(tempDir, 'hexlet-io_files/test-script.txt');
  const cssPath = path.join(tempDir, 'hexlet-io_files/test-style.css');

  const receivedImage = await fs.promises.readFile(jpgPath, 'utf8');
  const receivedScript = await fs.promises.readFile(jsPath, 'utf8');
  const receivedCss = await fs.promises.readFile(cssPath, 'utf8');


  expect(receivedImage).toBe(expectedImage);
  expect(receivedScript).toBe(expectedScript);
  expect(receivedCss).toBe(expectedCss);
});

test('Error', async () => {
  const host = 'https://hexlet.io';
  const pathname = '/fakepath';
  const body = 'html body';
  const status = 404;
  const filePath = url.format({ host, pathname });
  const tempDirName = path.join(os.tmpdir(), 'hexlet-');

  nock(host).get(pathname).reply(status, body);
  const tempDir = await fs.promises.mkdtemp(tempDirName);

  await expect(loader(filePath, tempDir)).rejects.toThrowError();
});
