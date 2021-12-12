import { JsonRpcSigner, StaticJsonRpcProvider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { DEFAULT_NETWORK, getAddresses, Networks } from "../constants";
import { RedeemHelperContract } from "../abi";
import { useSelector } from "react-redux";
import { IReduxState } from "src/store/slices/state.interface";

const addresses = getAddresses(250);

export function contractForRedeemHelper({ networkID, provider }: { networkID: number; provider: StaticJsonRpcProvider | JsonRpcSigner }) {
    return new ethers.Contract(addresses.REDEEM_HELPER_ADDRESS as string, RedeemHelperContract, provider);
}
