import { Networks } from "../../constants/blockchain";
import { CustomLPBond, LPBond } from "./lp-bond";
import { CustomBond, StableBond } from "./stable-bond";

import DaiIcon from "../../assets/tokens/DAI.svg";
import UsdcIcon from "../../assets/tokens/USDC.svg";
import LuxIcon from "../../assets/tokens/LUXOR.svg";
import FtmIcon from "../../assets/tokens/FTM.svg";
// import SoulIcon from "../../assets/tokens/SOUL.png";
import DaiLuxorIcon from "../../assets/tokens/DAI.svg";
import FtmLuxorIcon from "../../assets/tokens/FTM-LUX.svg";

import { StableBondContract, DaiLpBondContract, FtmLpBondContract, WftmBondContract, StableReserveContract, LpReserveContract } from "../../abi";

export const dai = new StableBond({
    name: "dai",
    displayName: "DAI",
    bondToken: "DAI",
    bondIconSvg: DaiIcon,
    bondContractABI: StableBondContract,
    reserveContractAbi: StableReserveContract,
    networkAddrs: {
        [Networks.FTM]: {
            bondAddress: "0xCf994423b39A6991e82443a8011Bf6749e19434b",
            reserveAddress: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
        },
        [Networks.BSC]: {
            bondAddress: "",
            reserveAddress: "",
        },
    },
    tokensInStrategy: "00000000000000000000000",
});

// export const usdc = new StableBond({
//     name: "usdc",
//     displayName: "USDC",
//     bondToken: "USDC",
//     bondIconSvg: UsdcIcon,
//     bondContractABI: StableBondContract,
//     reserveContractAbi: StableReserveContract,
//     networkAddrs: {
//         [Networks.FTM]: {
//             bondAddress: "0x5351Ca511C2348738728b5E71dd76e905BeCbCb8",
//             reserveAddress: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
//         },
//         [Networks.BSC]: {
//             bondAddress: "",
//             reserveAddress: "",
//         },
//     },
//     tokensInStrategy: "00000000000000000000000",
// });

export const wftm = new CustomBond({
    name: "wftm",
    displayName: "WFTM",
    bondToken: "FTM",
    bondIconSvg: FtmIcon,
    bondContractABI: WftmBondContract,
    reserveContractAbi: StableReserveContract,
    networkAddrs: {
        [Networks.FTM]: {
            bondAddress: "0x13729e99A7b77469f7FD204495a7b49e25e8444a",
            reserveAddress: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
        },
        [Networks.BSC]: {
            bondAddress: "",
            reserveAddress: "",
        },
    },
    tokensInStrategy: "00000000000000000000000",
});

export const daiLuxor = new LPBond({
    name: "dai_lux_lp",
    displayName: "LUX-DAI",
    bondToken: "DAI",
    bondIconSvg: LuxIcon,
    bondContractABI: DaiLpBondContract,
    reserveContractAbi: LpReserveContract,
    networkAddrs: {
        [Networks.FTM]: {
            // token0: DAI
            bondAddress: "0x5612d83dfED9B387c925Ac4D19ED3aeDd71004A8",
            reserveAddress: "0x46729c2AeeabE7774a0E710867df80a6E19Ef851",
        },
        [Networks.BSC]: {
            bondAddress: "",
            reserveAddress: "",
        },
    },
    lpUrl: "https://app.soulswap.finance/exchange/add/0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E/0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b",
});

// export const soulLuxor = new CustomLPBond({
//     name: "soul_lux_lp",
//     displayName: "LUX-SOUL",
//     bondToken: "SOUL",
//     bondIconSvg: LuxIcon,
//     bondContractABI: SoulLpBondContract,
//     reserveContractAbi: LpReserveContract,
//     networkAddrs: {
//         [Networks.FTM]: {
//             // token0:
//             bondAddress: "0x426374029CBef6feF7Dd48946bec404dEC9350eE",
//             reserveAddress: "0x475a63154C3e85ac0F2CB453f0b5c63e4370333c",
//         },
//         [Networks.BSC]: {
//             bondAddress: "",
//             reserveAddress: "",
//         },
//     },
//     lpUrl: "https://app.soulswap.finance/exchange/add/0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E/0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b",
// });

export const ftmLuxor = new CustomLPBond({
    name: "ftm_lux_lp",
    displayName: "LUX-FTM",
    bondToken: "FTM",
    bondIconSvg: FtmLuxorIcon,
    bondContractABI: FtmLpBondContract,
    reserveContractAbi: LpReserveContract,
    networkAddrs: {
        [Networks.FTM]: {
            // token0: WFTM
            bondAddress: "0xaBAD60240f1a39fce0d828eecf54d790FFF92cec",
            reserveAddress: "0x951BBB838e49F7081072895947735b0892cCcbCD",
        },
        [Networks.BSC]: {
            bondAddress: "",
            reserveAddress: "",
        },
    },
    lpUrl: "https://app.soulswap.finance/exchange/add/ETH/0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b",
});

export default [dai, daiLuxor, ftmLuxor, wftm];
