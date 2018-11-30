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

test('Download html page without links', async () => {
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

test('Download html page with links, format links', async () => {
  const host = 'https://hexlet.io';
  const pathname = '/';
  const pathnameImg = '/test/image.jpg';
  const pathnameScript = '/test/script.js';
  const pathnameLink = '/test/style.css';
  const bodyForFiles = 'body';
  const body = '<html><head></head><body><img src="test/image.jpg"><script src="test/script.js"></script><link href="test/style.css"></body></html>';
  const resultBody = '<html><head></head><body><img src="hexlet-io_files/test-image.jpg"><script src="hexlet-io_files/test-script.js"></script><link href="hexlet-io_files/test-style.css"></body></html>';
  const filePath = url.format({ host, pathname });
  const tempDirName = path.join(os.tmpdir(), 'hexlet-');

  nock(host)
    .get(pathname)
    .reply(200, body)
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

  expect(data).toBe(resultBody);
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
  const response = await loader(filePath, tempDir);

  expect(response.status).toBe(status);
});
