import type { Check } from '.';

export default {
  title: 'HTTP Version & Compression',
  categories: ['server', 'performance'],
  summary: 'Which HTTP version is negotiated and whether responses are compressed',
  description:
    'Newer HTTP versions multiplex requests over fewer connections, and ' +
    'compressed responses ship fewer bytes. Both are negotiated in the open: the ' +
    'protocol version, the content encoding and any HTTP/3 Alt-Svc advertisement ' +
    'are all visible in a single response.',
  use:
    'Uncompressed HTML, CSS and JavaScript is the cheapest performance win ' +
    'there is — one server flag, paid on every single page load. HTTP/3 ' +
    'advertisement shows whether the operator keeps the stack current.',
  resources: [
    'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding',
    'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Alt-Svc',
  ],
} satisfies Check;
