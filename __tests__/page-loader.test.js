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

test('Download html page', async () => {
  const host = 'https://hexlet.io';
  const pathname = '/courses';
  const body = 'html body';
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

test('Error: 404', async () => {
  const host = 'https://hexlet.io';
  const pathname = '/fakepath';
  const body = 'html body';
  const status = 404;
  const filePath = url.format({ host, pathname });
  const tempDirName = path.join(os.tmpdir(), 'hexlet-');

  nock(host).get(pathname).reply(status, body);

  const tempDir = await fs.promises.mkdtemp(tempDirName);
  const result = await loader(filePath, tempDir);

  expect(result.status).toBe(status);
});
