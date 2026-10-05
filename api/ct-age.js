import middleware from './_common/middleware.js';
import { httpGet } from './_common/http.js';
import { parseTarget, baseDomain } from './_common/parse-target.js';

const SOURCE_TIMEOUT = 15000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const isIpAddress = (host) => /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.includes(':');

// Keyless, reliable for low volume. Rows carry not_before per issuance.
const certSpotter = async (domain) => {
  const res = await httpGet('https://api.certspotter.com/v1/issuances', {
    params: { domain, expand: 'dns_names' },
    headers: { Accept: 'application/json' },
    timeout: SOURCE_TIMEOUT,
  });
  if (!Array.isArray(res.data)) throw new Error('certSpotter returned an unexpected response');
  return { dates: res.data.map((row) => row?.not_before), count: res.data.length };
};

// Bot protection blocks browser-like UAs, so identify plainly.
const crtSh = async (domain) => {
  const res = await httpGet('https://crt.sh/', {
    params: { q: domain, output: 'json' },
    headers: { Accept: 'application/json', 'user-agent': 'web-check/1.0 (+https://web-check.xyz)' },
    timeout: SOURCE_TIMEOUT,
  });
  if (!Array.isArray(res.data)) throw new Error('crt.sh returned an unexpected response');
  return { dates: res.data.map((row) => row?.not_before), count: res.data.length };
};

const SOURCES = [
  { name: 'certSpotter', lookup: certSpotter },
  { name: 'crt.sh', lookup: crtSh },
];

const ctAgeHandler = async (url) => {
  const { hostname } = parseTarget(url);
  if (isIpAddress(hostname)) {
    return { skipped: 'Certificate Transparency only applies to domain names' };
  }
  const domain = baseDomain(hostname);
  if (!domain || !domain.includes('.')) {
    return { skipped: 'Could not resolve a registrable domain' };
  }

  let succeeded = 0;
  for (const source of SOURCES) {
    try {
      const { dates, count } = await source.lookup(domain);
      succeeded += 1;
      const issued = (dates || [])
        .map((d) => new Date(d).getTime())
        .filter((t) => !Number.isNaN(t));
      if (!issued.length) continue;
      const firstSeen = new Date(Math.min(...issued));
      return {
        domain,
        firstSeen: firstSeen.toISOString(),
        certCount: count,
        ageDays: Math.floor((Date.now() - firstSeen.getTime()) / 86400000),
        source: source.name,
      };
    } catch {
      await sleep(1000);
    }
  }
  if (succeeded) {
    return {
      skipped: `No certificates found for ${domain} in Certificate Transparency logs`,
    };
  }
  return { error: 'Certificate Transparency lookup is temporarily unavailable', retryable: true };
};

export const handler = middleware(ctAgeHandler);
export default handler;
