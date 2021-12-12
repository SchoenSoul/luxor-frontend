import { Networks } from "./blockchain";

const FTM_MAINNET = {
    DAO_ADDRESS: "0xcB5ba2079C7E9eA6571bb971E383Fe5D59291a95", // MS: 0xFa5Ebc2731ec2292bc4Cdc192d2a5f6F4B312e92
    LUX_ADDRESS: "0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b",
    LUM_ADDRESS: "0x4290b33158F429F40C0eDc8f9b9e5d8C5288800c",
    WLUM_ADDRESS: "0xa69557e01B0a6b86E5b29BE66d730c0Bfff68208",
    DAI_ADDRESS: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
    USDC_ADDRESS: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
    STAKING_ADDRESS: "0xf3F0BCFd430085e198466cdCA4Db8C2Af47f0802",
    STAKING_HELPER_ADDRESS: "0x49a359BB873E4DfC9B07b3E32ee404c4e8ED14e7",
    LUX_BONDING_CALC_ADDRESS: "0x6e2bd6d4654226C752A0bC753A3f9Cd6F569B6cB",
    TREASURY_ADDRESS: "0xDF2A28Cc2878422354A93fEb05B41Bd57d71DB24",
    ZAPIN_ADDRESS: "0x8CcD03e5EC7427fde1DCE3b2c9C8dc9ab1A035d0",
    ANYSWAP_ADDRESS: "0xb576c9403f39829565bd6051695e2ac7ecf850e2", // FTM
    ANY_WLUM_ADDRESS: "",
    REDEEM_HELPER_ADDRESS: "0xb56F10a977FCd25D5294cd9D7F32EAE5c38b2729", // FTM
};

const BSC_MAINNET = {
    DAO_ADDRESS: "",
    LUX_ADDRESS: "",
    LUM_ADDRESS: "",
    WLUM_ADDRESS: "", // TODO
    DAI_ADDRESS: "",
    STAKING_ADDRESS: "",
    STAKING_HELPER_ADDRESS: "",
    LUX_BONDING_CALC_ADDRESS: "",
    TREASURY_ADDRESS: "",
    ZAPIN_ADDRESS: "",
    ANYSWAP_ADDRESS: "", // TODO
    ANY_WLUM_ADDRESS: "", // TODO
    REDEEM_HELPER_ADDRESS: "",
};

export const getAddresses = (networkID: number) => {
    if (networkID === Networks.FTM) return FTM_MAINNET;
    if (networkID === Networks.BSC) return BSC_MAINNET;

    throw Error("Unsupported Network");
};
