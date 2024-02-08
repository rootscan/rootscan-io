import { Address } from "viem"
import { CHAIN_ID } from "../viem-client"

const URL_BASE = "/logos/"

const logos: { [key: number]: { [key: Address]: string } } = {
  7668: {
    // Root
    "0xcCcCCccC00000001000000000000000000000000": "token-root.png",
    // XRP
    "0xCCCCcCCc00000002000000000000000000000000": "token-xrp.png",
    // Sylo
    "0xcCcCCCCc00000864000000000000000000000000": "token-sylo.png",
    // USDT
    "0xCCCccccc00001864000000000000000000000000": "token-usdt.png",
    // DAI
    "0xcCCCcCcc00002464000000000000000000000000": "token-dai.png",
    // ASTO
    "0xCccCccCc00001064000000000000000000000000": "token-asto.png",
    // Vortex
    "0xcCccCcCC00000003000000000000000000000000": "token-vtx.png",
    // ATEM Car Club: Vehicles
    "0xaaaaAAAa00004064000000000000000000000000": "token-atem.png",
    "0xC64e7D6c94e4769927A84941398e18Bda5EF12f7": "token-atem.png",
    // USDC
    "0xCCcCCcCC00000C64000000000000000000000000": "token-usdc.png",
    // Goblins
    "0xaAaaAaaa00000c64000000000000000000000000": "token-goblins.png",
    // ETH
    "0xccCcCccC00000464000000000000000000000000": "token-eth.png",
    // Amulets
    "0xAAaaAAaa00000864000000000000000000000000": "token-amulet.png",
    // TNL Gear
    "0xaaaAAaaA00006864000000000000000000000000": "token-tnl.png",
    "0x5BF788cf0065f6524Daac8BcfCF5eC77f07B5F25": "token-tnl.png",
    // FIFA
    "0xaAAaAAAa00003864000000000000000000000000": "token-fifa.png",
    "0xAaaAaAAa00003c64000000000000000000000000": "token-fifa.png",
    "0xAaaaaAAA00003464000000000000000000000000": "token-fifa.png",
    "0xAaAAaaAa00002C64000000000000000000000000": "token-fifa.png",
    "0xAaAaAAAA00001C64000000000000000000000000": "token-fifa.png",
    // MANA
    "0xAaaaAaaA00002064000000000000000000000000": "token-mana.png",
    "0xaAaAaaAA00002464000000000000000000000000": "token-mana.png",
    // Futureverse Logos
    "0xAAAaaAAa00001864000000000000000000000000": "token-fv.png",
    // Partybear
    "0xaAaaAaaA00004464000000000000000000000000": "token-pb.png",
    "0xAaaAAAaa00000464000000000000000000000000": "token-pb.png",
    // Partybear Accessories
    "0xBbBBBBbb00006064000000000000000000000000": "token-pb.png",
    "0xbbbbbBbb00004C64000000000000000000000000": "token-pb.png",
    "0xBBbbbBbb00004864000000000000000000000000": "token-pb.png",
    "0xBbbBbBbB00005c64000000000000000000000000": "token-pb.png",
    "0xbBBbBbBB00006464000000000000000000000000": "token-pb.png",
    "0xBBBbbbbb00005064000000000000000000000000": "token-pb.png",
    "0xbbbbbBbb00005464000000000000000000000000": "token-pb.png",
    "0xbbbBBBbb00005864000000000000000000000000": "token-pb.png",
    // Scenes & Sounds
    "0xBBBbbBbB00007864000000000000000000000000": "token-ss.png",
    "0xbBbbbbBb00007c64000000000000000000000000": "token-ss.png",
    "0xBBBBBBbb00007064000000000000000000000000": "token-ss.png",
    "0xBBBbbbbb00007464000000000000000000000000": "token-ss.png",
    "0xaaAaaAAa00008864000000000000000000000000": "token-raicers.png",
    "0xaaAAaaAa00008C64000000000000000000000000": "token-raicers.png",
    "0xaAAaaAAA00009064000000000000000000000000": "token-raicers.png",
    "0xaAaaAaAA00009464000000000000000000000000": "token-raicers.png",
    "0xaaaaaaaA00009864000000000000000000000000": "token-raicers.png",
    "0xaAAAAAAA00009c64000000000000000000000000": "token-raicers.png",
    "0xbbbBbBbB0000a064000000000000000000000000": "token-raicers.png",
    "0xBbbbbBBb0000a464000000000000000000000000": "token-raicers.png",
    "0xbbBbBBBb0000a864000000000000000000000000": "token-raicers.png",
  },
  7672: {
    // Root
    "0xcCcCCccC00000001000000000000000000000000": "token-root.png",
    // XRP
    "0xCCCCcCCc00000002000000000000000000000000": "token-xrp.png",
  },
}

const getTokenLogo = (address: Address) => {
  return logos?.[CHAIN_ID]?.[address]
    ? `${URL_BASE}${logos?.[CHAIN_ID]?.[address]}`
    : undefined
}

export default getTokenLogo
