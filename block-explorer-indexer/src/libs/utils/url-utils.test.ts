import { prepareTokenMetadataUrl } from './url-utils';

describe('UrlUtils', () => {
  test('prepareTokenMetadataUrl: incorrect urls should skip', () => {
    const badUrls = [
      'https://1',
      'https://42',
      'https://1024',
      undefined,
      null,
      '',
      'null',
      'null0',
      'test123',
      'https://test123',
      '1',
      'test1',
      'true',
      'example.com',
      'localhost',
      'https://localhost/x',
      '0.0.0.0',
      '0.0.0',
      '0.0',
      '0',
      'https://192.168.1.1:30333',
    ];
    for (const url of badUrls) {
      expect(prepareTokenMetadataUrl(url as string)).toBe(undefined);
    }
  });

  test('prepareTokenMetadataUrl: correct urls', () => {
    const correctUrls = [
      'https://rns-metadata.fly.dev/mainnet/0x44640D662A423d738D5ebF8B51E57AfC0f2cf4Df/34568736216980230572277344339278661393462213082217059465217671489155940463826',
      'https://www.projecttempus.xyz/api/51300/token/77',
    ];
    for (const url of correctUrls) {
      expect(prepareTokenMetadataUrl(url as string)).toBe(url);
    }
    expect(prepareTokenMetadataUrl('projecttempus.xyz/api/51300/token/77')).toBe(
      'https://projecttempus.xyz/api/51300/token/77',
    );
  });

  test('prepareTokenMetadataUrl: ipfs urls', () => {
    expect(prepareTokenMetadataUrl('ipfs://test')).toBe('https://ipfs.io/ipfs/test');
  });
});
