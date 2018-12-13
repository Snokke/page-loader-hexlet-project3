import axios from 'axios';
import fs from 'fs';
import url from 'url';
import cheerio from 'cheerio';
import path from 'path';
import debug from 'debug';
import Listr from 'listr';
import _ from 'lodash';

const log = debug('page-loader');

const tagMapping = {
  img: 'src',
  script: 'src',
  link: 'href',
};

/*
const getErrorMessage = (error) => {
  switch (error.code) {
    case 'ENOTFOUND':
      return new Error(`Wrong url: ${error.config.url}`);
    case 'ENOENT':
      return new Error(`Wrong path: ${error.path}`);
    case 'EACCES':
      return new Error(`Permission denied: ${error.path}`);
    default:
      return error;
  }
};
*/

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
    return `${rawFileNameWihtoutSlash.replace(/\W/g, '-')}${extension}`;
  }
  const newExtension = path.extname(rawFileNameWihtoutSlash);
  const rawFileNameWithoutExt = rawFileNameWihtoutSlash.split(newExtension)[0];
  return `${rawFileNameWithoutExt.replace(/\W/g, '-')}${newExtension}`;
};

const isLinkLocal = (link) => {
  if (!link) {
    return false;
  }
  const { hostname } = url.parse(link);
  return !hostname && link[1] !== '/';
};

const getLocalResources = (html, dirName) => {
  const $ = cheerio.load(html);
  const links = [];
  Object.keys(tagMapping).forEach(tag => $(tag)
    .filter((i, elem) => {
      const link = $(elem).attr(tagMapping[tag]);
      return isLinkLocal(link);
    })
    .each((i, elem) => {
      const link = $(elem).attr(tagMapping[tag]);
      links.push(link);
      const newLink = `${dirName}/${formatLink(link)}`;
      return $(elem).attr(tagMapping[tag], newLink);
    }));
  return { htmlWithLocalLinks: $.html(), localResourcesFilenames: links };
};

export default async (requestUrl, pathToFile) => {
  const HtmlName = formatLink(requestUrl, '.html');
  const pathForHtml = path.join(pathToFile, HtmlName);

  const dirName = formatLink(requestUrl, '_files');
  const pathForDir = path.join(pathToFile, dirName);

  let localResourcesLinks = [];

  const response = await axios.get(requestUrl);

  const {
    localResourcesFilenames,
    htmlWithLocalLinks,
  } = getLocalResources(response.data, dirName);
  localResourcesLinks = getDirectLinks(_.uniq(localResourcesFilenames), requestUrl);
  log(`Download page ${requestUrl}`);
  log(`Save HTML page to: ${pathForHtml}`);
  await fs.promises.writeFile(pathForHtml, htmlWithLocalLinks);

  log(`Create dir: ${pathForDir}`);
  await fs.promises.mkdir(pathForDir);

  const tasks = new Listr(localResourcesLinks.map(link => ({
    title: link,
    task: async () => {
      const responseResources = await axios.get(link, { responseType: 'arraybuffer' });
      const { pathname } = url.parse(link);
      const currentName = formatLink(pathname.substring(1));
      const pathForFile = `${pathForDir}/${currentName}`;
      log(`Download and save file: ${currentName}`);
      await fs.promises.writeFile(pathForFile, responseResources.data);
    },
  })), { concurrent: true });
  await tasks.run();

  console.log(`Succesfully download HTML page: '${HtmlName}' to '${pathForDir.replace(dirName, '')}'`);

  // Old version with promises
  /*
  return axios.get(requestUrl)
    .then((response) => {
      const {
        localResourcesFilenames,
        htmlWithLocalLinks,
      } = getLocalResources(response.data, dirName);
      localResourcesLinks = getDirectLinks(_.uniq(localResourcesFilenames), requestUrl);
      log(`Download page ${requestUrl}`);
      log(`Save HTML page to: ${pathForHtml}`);
      return fs.promises.writeFile(pathForHtml, htmlWithLocalLinks);
    })
    .then(() => {
      log(`Create dir: ${pathForDir}`);
      return fs.promises.mkdir(pathForDir);
    })
    .then(() => {
      const tasks = new Listr(localResourcesLinks.map(link => ({
        title: link,
        task: () => axios.get(link, { responseType: 'arraybuffer' })
          .then((response) => {
            const { pathname } = url.parse(link);
            const currentName = formatLink(pathname.substring(1));
            const pathForFile = `${pathForDir}/${currentName}`;
            log(`Download and save file: ${currentName}`);
            return fs.promises.writeFile(pathForFile, response.data);
          }),
      })), { concurrent: true });
      return tasks.run();
    })
    .then(() => console.log(`Download page: '${HtmlName}' to '${pathForDir.replace(dirName, '')}'`))
    .catch(error => Promise.reject(getErrorMessage(error)));
  */
};
