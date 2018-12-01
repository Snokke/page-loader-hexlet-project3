import axios from 'axios';
import fs from 'fs';
import url from 'url';
import cheerio from 'cheerio';
import path from 'path';
import _ from 'lodash';

const tagMapping = {
  img: 'src',
  script: 'src',
  link: 'href',
};

const getDirectLinks = (links, baseUrl) => {
  const { protocol, host, pathname } = url.parse(baseUrl);
  return links.map((link) => {
    if (link[0] === '/') {
      return url.format({ protocol, host, pathname: link });
    }
    return url.format({ protocol, host, pathname: `${pathname}${link}` });
  });
};

const formatLink = (baseUrl, extension) => {
  const { hostname, pathname } = url.parse(baseUrl);
  const rawFileName = url.format({ hostname, pathname });
  const rawFileNameWihtoutSlash = rawFileName[rawFileName.length - 1] === '/' ? rawFileName.slice(0, -1) : rawFileName;
  if (extension) {
    return `${rawFileNameWihtoutSlash.replace(/[^a-zA-Z0-9]/g, '-')}${extension}`;
  }
  const newExtension = path.extname(rawFileNameWihtoutSlash);
  const rawFileNameWithoutExt = rawFileNameWihtoutSlash.split(newExtension)[0];
  return `${rawFileNameWithoutExt.replace(/[^a-zA-Z0-9]/g, '-')}${newExtension}`;
};

const getLocalResources = (html, dirName) => {
  const $ = cheerio.load(html);
  const links = [];
  Object.keys(tagMapping).forEach(tag => $(tag).each((i, elem) => {
    const link = $(elem).attr(tagMapping[tag]);
    if (link && !url.parse(link).hostname && link[1] !== '/') {
      links.push(link);
      const newLink = `${dirName}/${formatLink(link)}`;
      return $(elem).attr(tagMapping[tag], newLink);
    }
    return '';
  }));
  return { htmlWithLocalLinks: $.html(), localResourcesFilenames: links };
};

export default (requestUrl, pathToFile) => {
  const HtmlName = formatLink(requestUrl, '.html');
  const pathForHtml = path.join(pathToFile, HtmlName);

  const dirName = formatLink(requestUrl, '_files');
  const pathForDir = path.join(pathToFile, dirName);

  let localResourcesLinks = [];

  return axios.get(requestUrl)
    .then((response) => {
      const {
        localResourcesFilenames,
        htmlWithLocalLinks,
      } = getLocalResources(response.data, dirName);
      localResourcesLinks = getDirectLinks(_.uniq(localResourcesFilenames), requestUrl);
      return fs.promises.writeFile(pathForHtml, htmlWithLocalLinks);
    })
    .then(() => fs.promises.mkdir(pathForDir))
    .then(() => Promise.all(localResourcesLinks.map(link => axios
      .get(link, { responseType: 'arraybuffer' })
      .then((response) => {
        const { pathname } = url.parse(link);
        const currentName = formatLink(pathname.substring(1));
        const pathForFile = `${pathForDir}/${currentName}`;
        return fs.promises.writeFile(pathForFile, response.data);
      }))))
    .catch((error) => {
      console.log(`${error.message}. Error with url: ${error.config.url}`);
      return Promise.reject(error);
    });
};
