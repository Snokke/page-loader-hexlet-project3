import axios from 'axios';
import fs from 'fs';
import url from 'url';
import path from 'path';

export default (requestUrl, pathToFile) => {
  const { hostname, pathname } = url.parse(requestUrl);
  const rawFileName = url.format({ hostname, pathname });
  const fileName = `${rawFileName.replace(/[^a-zA-Z0-9]/g, '-')}.html`;
  const resultPath = path.join(pathToFile, fileName);

  return axios.get(requestUrl)
    .then(response => fs.promises.writeFile(resultPath, response.data))
    .catch(error => error.response);
};
