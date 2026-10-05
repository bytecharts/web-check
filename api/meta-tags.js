import * as cheerio from 'cheerio';
import middleware from './_common/middleware.js';
import { httpGet } from './_common/http.js';
import { upstreamError } from './_common/upstream.js';

// Google truncates titles around 50-60 chars and descriptions around 150-160
const TITLE_MIN = 30;
const TITLE_MAX = 60;
const DESC_MIN = 70;
const DESC_MAX = 160;

const judge = (length, min, max, label) => {
  if (!length) return `${label} is missing.`;
  if (length < min) return `${label} is ${length} characters, shorter than the ${min} minimum.`;
  if (length > max)
    return `${label} is ${length} characters, likely truncated past ${max} in search results.`;
  return `${label} is ${length} characters, within the ideal ${min}-${max} range.`;
};

const metaTagsHandler = async (url) => {
  let response;
  try {
    response = await httpGet(url);
  } catch (error) {
    return upstreamError(error, 'Meta tags fetch');
  }
  try {
    const $ = cheerio.load(response.data);
    const title = ($('head title').text() || '').trim();
    const description = ($('meta[name="description"]').attr('content') || '').trim();
    if (!title && !description) {
      return { skipped: 'No title or meta description found on this page' };
    }
    return {
      title: title || null,
      titleLength: title.length,
      titleVerdict: judge(title.length, TITLE_MIN, TITLE_MAX, 'Title'),
      description: description || null,
      descriptionLength: description.length,
      descriptionVerdict: judge(description.length, DESC_MIN, DESC_MAX, 'Description'),
    };
  } catch (error) {
    return { error: `Failed parsing meta tags: ${error.message}` };
  }
};

export const handler = middleware(metaTagsHandler);
export default handler;
