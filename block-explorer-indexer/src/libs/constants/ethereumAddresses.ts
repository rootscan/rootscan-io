import { TTokenType } from '@/types';
import { Address } from 'viem';

const addresses: { nativeId: number; contractAddress: Address; type: TTokenType }[] = [
  // ASTO
  {
    nativeId: 4196,
    contractAddress: '0x823556202e86763853b40e9cDE725f412e294689',
    type: 'ERC20',
  },
  // ROOT
  {
    nativeId: 1,
    contractAddress: '0xa3d4BEe77B05d4a0C943877558Ce21A763C4fa29',
    type: 'ERC20',
  },
  // DAI
  {
    nativeId: 9316,
    contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    type: 'ERC20',
  },
  // USDT
  {
    nativeId: 6244,
    contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    type: 'ERC20',
  },
  // USDC
  {
    nativeId: 3172,
    contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    type: 'ERC20',
  },
  // SYLO
  {
    nativeId: 2148,
    contractAddress: '0xf293d23BF2CDc05411Ca0edDD588eb1977e8dcd4',
    type: 'ERC20',
  },
  // ERC721
  {
    nativeId: 33892,
    contractAddress: '0xaAF03a65CbD8f01b512Cd8d530a675b3963dE255',
    type: 'ERC721',
  },
  // FLUF
  {
    nativeId: 12388,
    contractAddress: '0xCcc441ac31f02cD96C153DB6fd5Fe0a2F4e6A68d',
    type: 'ERC721',
  },

  // TNL Character
  {
    nativeId: 1124,
    contractAddress: '0x6bCa6de2dbDc4E0d41f7273011785ea16Ba47182',
    type: 'ERC721',
  },
  {
    nativeId: 17508,
    contractAddress: '0x35471f47c3C0BC5FC75025b97A19ECDDe00F78f8',
    type: 'ERC721',
  },
  {
    nativeId: 27748,
    contractAddress: '0x35471f47c3c0bc5fc75025b97a19ecdde00f78f8',
    type: 'ERC721',
  },
];

export default addresses;
