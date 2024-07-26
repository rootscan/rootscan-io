import isUrl from 'is-url';

const skipDomains = ['example.com', 'localhost', '0.0.0'];
const skipDomainsRegex = new RegExp(skipDomains.map((domain) => `(${domain})`).join('|'), 'i');
const containsIpWithPortRegex = /(https?:\/\/)?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?\/?[\w\\/.-]*\b/;

export function prepareTokenMetadataUrl(link: string | undefined): string | undefined {
  if (!link) {
    return;
  }
  link = link.trim();

  if (link.toLowerCase().startsWith('ipfs://')) {
    // See https://docs.ipfs.tech/quickstart/retrieve/#fetching-the-cid-with-an-ipfs-gateway
    link = link.replace(/^ipfs:\/\//i, 'https://ipfs.io/ipfs/');
  }
  if (!link.includes('://')) {
    link = `https://${link}`;
  }
  if (!isUrl(link) || containsIpWithPortRegex.test(link) || skipDomainsRegex.test(link)) {
    return;
  }
  return link;
}
