import type { Check } from '.';

export default {
  title: 'Meta Title & Description',
  categories: ['seo'],
  summary: 'Whether the title and description fit search-result limits',
  description:
    'The title tag and meta description are what search engines show on the ' +
    'results page. Too short and they undersell the page, too long and Google ' +
    'truncates them mid-sentence. Both have well-known ideal lengths.',
  use:
    'A missing description means Google writes your snippet for you, from ' +
    'whatever text it finds first. A truncated title buries the words that ' +
    'would have earned the click.',
  resources: [
    'https://developers.google.com/search/docs/appearance/title-link',
    'https://developers.google.com/search/docs/appearance/snippet',
  ],
} satisfies Check;
