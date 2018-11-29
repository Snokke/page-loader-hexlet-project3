import axios from 'axios';
import fs from 'fs';
import url from 'url';
import cheerio from 'cheerio';
import path from 'path';

const mapping = {
  img: 'src',
  script: 'src',
  link: 'href',
};

// eslint-disable-next-line
const getLinks = (html, baseUrl, tag) => {
  const $ = cheerio.load(html);
  const links = [];
  $(tag).each((i, elem) => {
    const link = $(elem).attr(mapping[tag]);
    if (link && !url.parse(link).hostname && link[1] !== '/') {
      const { protocol, host, pathname } = url.parse(baseUrl);
      const resultUrl = (link[0] === '/') ? url.format({ protocol, host, pathname: link }) : url.format({ protocol, host, pathname: `${pathname}/${link}` });
      links.push(resultUrl);
    }
  });
  return links;
};

const formatName = (baseUrl, extension = '') => {
  const { hostname, pathname } = url.parse(baseUrl);
  const rawFileName = url.format({ hostname, pathname });
  return `${rawFileName.replace(/[^a-zA-Z0-9]/g, '-')}${extension}`;
};


export default (requestUrl, pathToFile) => {
  const fileName = formatName(requestUrl, '.html');
  const pathForHtml = path.join(pathToFile, fileName);

  const dirName = formatName(requestUrl, '_files');
  const pathForDir = path.join(pathToFile, dirName);

  return axios.get(requestUrl)
    .then(response => fs.promises.writeFile(pathForHtml, response.data))
    .then(() => fs.promises.mkdir(pathForDir))
    .catch((error) => {
      throw new Error(error.message);
    });
};
