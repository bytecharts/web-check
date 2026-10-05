import http from 'http';
import https from 'https';
import middleware from './_common/middleware.js';

const REQUEST_TIMEOUT = 10000;
const GOOD_ENCODINGS = ['br', 'gzip', 'deflate', 'zstd'];

const probe = (url) =>
  new Promise((resolve) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.request(
      url,
      { method: 'GET', headers: { 'Accept-Encoding': 'gzip, deflate, br' } },
      (res) => {
        let bytes = 0;
        res.on('data', (chunk) => {
          bytes += chunk.length;
        });
        res.on('end', () => {
          resolve({
            protocol: `HTTP/${res.httpVersion}`,
            alpn: res.socket?.alpnProtocol || null,
            altSvc: res.headers['alt-svc'] || null,
            contentEncoding: res.headers['content-encoding'] || null,
            bytes,
          });
        });
        res.resume();
      },
    );
    req.on('timeout', () => resolve({ error: 'Protocol probe timed out' }));
    req.on('error', (e) => resolve({ error: `Protocol probe failed: ${e.message}` }));
    req.setTimeout(REQUEST_TIMEOUT);
    req.end();
  });

const httpProtoHandler = async (url) => {
  const result = await probe(url);
  if (result.error) return result;

  const encoding = (result.contentEncoding || '').toLowerCase();
  const compressed = GOOD_ENCODINGS.some((e) => encoding.includes(e));
  const http3Advertised = /(^|,\s*)h3=/.test(result.altSvc || '');

  return {
    ...result,
    compressed,
    http3Advertised,
    compressionVerdict: compressed
      ? `Responses are compressed (${result.contentEncoding}).`
      : 'Responses are not compressed, the page ships more bytes than it needs to.',
    http3Verdict: http3Advertised
      ? 'The server advertises HTTP/3 via Alt-Svc (advertised only, not directly probed).'
      : 'The server does not advertise HTTP/3 via Alt-Svc.',
  };
};

export const handler = middleware(httpProtoHandler);
export default handler;
