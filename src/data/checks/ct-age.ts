import type { Check } from '.';

export default {
  title: 'Certificate Age',
  categories: ['domain'],
  summary: 'How long a domain has appeared in Certificate Transparency logs',
  description:
    'Every publicly trusted certificate is recorded in append-only Certificate ' +
    'Transparency logs. The earliest entry for a domain is a public, verifiable lower ' +
    'bound on how long it has existed — a fifteen-year-old business and a domain set ' +
    'up last Tuesday look very different here.',
  use:
    'Newly observed domains are a classic phishing signal. If a site asking for ' +
    'credentials or payment first appeared in the logs days ago, treat it with ' +
    'suspicion regardless of how professional it looks.',
  resources: [
    'https://crt.sh/',
    'https://certificate.transparency.dev/',
    'https://certspotter.com/',
  ],
} satisfies Check;
