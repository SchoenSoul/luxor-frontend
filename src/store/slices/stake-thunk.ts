import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { StakingHelperContract, LuxorTokenContract, LumensTokenContract, StakingContract } from "../../abi";
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./pending-txns-slice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./account-slice";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../../constants/blockchain";
import { warning, success, info, error } from "../../store/slices/messages-slice";
import { messages } from "../../constants/messages";
import { getGasPrice } from "../../helpers/get-gas-price";
import { metamaskErrorWrap } from "../../helpers/metamask-error-wrap";
import { sleep } from "../../helpers";

interface IChangeApproval {
    token: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
}

export const changeApproval = createAsyncThunk("stake/changeApproval", async ({ token, provider, address, networkID }: IChangeApproval, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);

    const signer = provider.getSigner();
    const luxorContract = new ethers.Contract(addresses.LUX_ADDRESS, LuxorTokenContract, signer);
    const lumensContract = new ethers.Contract(addresses.LUM_ADDRESS, LumensTokenContract, signer);

    let approveTx;
    try {
        const gasPrice = await getGasPrice(provider);

        if (token === "luxor") {
            approveTx = await luxorContract.approve(addresses.STAKING_HELPER_ADDRESS, ethers.constants.MaxUint256, { gasPrice });
        }

        if (token === "lumens") {
            approveTx = await lumensContract.approve(addresses.STAKING_ADDRESS, ethers.constants.MaxUint256, { gasPrice });
        }

        const text = "Approve " + (token === "luxor" ? "Staking" : "Unstaking");
        const pendingTxnType = token === "luxor" ? "approve_staking" : "approve_unstaking";

        dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));
        await approveTx.wait();
        dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (approveTx) {
            dispatch(clearPendingTxn(approveTx.hash));
        }
    }

    await sleep(2);

    const stakeAllowance = await luxorContract.allowance(address, addresses.STAKING_HELPER_ADDRESS);
    const unstakeAllowance = await lumensContract.allowance(address, addresses.STAKING_ADDRESS);

    return dispatch(
        fetchAccountSuccess({
            staking: {
                luxorStake: Number(stakeAllowance),
                lumensUnstake: Number(unstakeAllowance),
            },
        }),
    );
});

interface IChangeStake {
    action: string;
    value: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
}

export const changeStake = createAsyncThunk("stake/changeStake", async ({ action, value, provider, address, networkID }: IChangeStake, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const staking = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, signer);
    const stakingHelper = new ethers.Contract(addresses.STAKING_HELPER_ADDRESS, StakingHelperContract, signer);

    let stakeTx;

    try {
        const gasPrice = await getGasPrice(provider);

        if (action === "stake") {
            stakeTx = await stakingHelper.stake(ethers.utils.parseUnits(value, "gwei"), address, { gasPrice });
        } else {
            stakeTx = await staking.unstake(ethers.utils.parseUnits(value, "gwei"), true, { gasPrice });
        }
        const pendingTxnType = action === "stake" ? "staking" : "unstaking";
        dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: getStakingTypeText(action), type: pendingTxnType }));
        await stakeTx.wait();
        dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (stakeTx) {
            dispatch(clearPendingTxn(stakeTx.hash));
        }
    }
    dispatch(info({ text: messages.your_balance_update_soon }));
    await sleep(10);
    await dispatch(getBalances({ address, networkID, provider }));
    dispatch(info({ text: messages.your_balance_updated }));
    return;
});
