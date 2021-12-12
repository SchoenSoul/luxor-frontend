import { JsonRpcSigner, StaticJsonRpcProvider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { RedeemHelperContract } from "../abi";

export * from "./get-market-price";
export * from "./shorten";
export * from "./trim";
export * from "./seconds-until-block";
export * from "./prettify-seconds";
export * from "./pretty-vesting-period";
export * from "./get-token-image";
export * from "./set-all";
export * from "./token-price";
export * from "./price-units";
export * from "./sleep";
export * from "./metamask-error-wrap";
export * from "./redeem-helper";

export const REDEEM_HELPER_ADDRESS = "0xE1e83825613DE12E8F0502Da939523558f0B819E"; // TODO

// TS-REFACTOR-NOTE - Used for:
// AccountSlice.ts, AppSlice.ts, LusdSlice.ts
export function setAll(state: any, properties: any) {
    if (properties) {
        const props = Object.keys(properties);
        props.forEach(key => {
            state[key] = properties[key];
        });
    }
}

export function contractForRedeemHelper({ networkID, provider }: { networkID: number; provider: StaticJsonRpcProvider | JsonRpcSigner }) {
    return new ethers.Contract(REDEEM_HELPER_ADDRESS as string, RedeemHelperContract, provider);
}
