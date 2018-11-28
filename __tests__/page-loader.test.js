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

  nock(host).get(pathname).reply(200, body);

  const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir()));
  await loader(filePath, tempDir);
  const fileName = await fs.promises.readdir(tempDir);
  const tempFilePath = path.resolve(tempDir, fileName[0]);
  const data = await fs.promises.readFile(tempFilePath);

  expect(data.toString('utf8')).toBe(body);
});
