import { ethers } from "ethers";
import { getAddresses, Networks } from "../../constants";
import { StakingContract, LumensTokenContract, LuxorTokenContract, LpReserveContract } from "../../abi";
import { setAll } from "../../helpers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider } from "@ethersproject/providers";
import { getTokenPrice } from "../../helpers";
import { getMarketPrice } from "../../helpers/get-market-price";
import { RootState } from "../store";
import allBonds from "../../helpers/bond";
import { IBaseAsyncThunk } from "./interfaces";
import axios from "axios";

interface ILoadAppDetails {
    networkID: number;
    provider: JsonRpcProvider;
}

/**
 * checks if app.slice has marketPrice already
 * if yes then simply load that state
 * if no then fetches via `loadMarketPrice`
 *
 * `usage`:
 * ```
 * const originalPromiseResult = await dispatch(
 *    findOrLoadMarketPrice({ networkID: networkID, provider: provider }),
 *  ).unwrap();
 * originalPromiseResult?.whateverValue;
 * ```
 */
export const findOrLoadMarketPrice = createAsyncThunk("app/findOrLoadMarketPrice", async ({ networkID, provider }: IBaseAsyncThunk, { dispatch, getState }) => {
    const state: any = getState();
    let marketPrice;
    // check if we already have loaded market price
    if (state.app.loadingMarketPrice === false && state.app.marketPrice) {
        // go get marketPrice from app.state
        marketPrice = state.app.marketPrice;
    } else {
        // we don't have marketPrice in app.state, so go get it
        try {
            const originalPromiseResult = await dispatch(loadMarketPrice({ networkID: networkID, provider: provider })).unwrap();
            marketPrice = originalPromiseResult?.marketPrice;
        } catch (rejectedValueOrSerializedError) {
            // handle error here
            console.error("Returned a null response from dispatch(loadMarketPrice)");
            return;
        }
    }
    return { marketPrice };
});

/**
 * - fetches the OHM price from CoinGecko (via getTokenPrice)
 * - falls back to fetch marketPrice from ohm-dai contract
 * - updates the App.slice when it runs
 */
const loadMarketPrice = createAsyncThunk("app/loadMarketPrice", async ({ networkID, provider }: IBaseAsyncThunk) => {
    let marketPrice: number;
    try {
        // only get marketPrice from eth mainnet
        marketPrice = await getMarketPrice(250, provider);
        // let mainnetProvider = (marketPrice = await getMarketPrice({ 1: NetworkID, provider }));
        marketPrice = marketPrice / Math.pow(10, 9);
    } catch (e) {
        marketPrice = await getTokenPrice("olympus");
    }
    return { marketPrice };
});

export const loadAppDetails = createAsyncThunk(
    "app/loadAppDetails",
    //@ts-ignore
    async ({ networkID, provider }: ILoadAppDetails) => {
        const daiPrice = getTokenPrice("DAI");
        console.log("DAI:%s", daiPrice);

        const addresses = getAddresses(networkID);

        const stakingContract = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, provider);
        const currentBlock = await provider.getBlockNumber();
        const currentBlockTime = (await provider.getBlock(currentBlock)).timestamp;
        const lumensContract = new ethers.Contract(addresses.LUM_ADDRESS, LumensTokenContract, provider);
        const luxorContract = new ethers.Contract(addresses.LUX_ADDRESS, LuxorTokenContract, provider);

        const luxPrice = Number((await getTokenPrice("lux")) / Math.pow(10, 9)) * Number(daiPrice);
        console.log("luxPrice:%s", await Number(luxPrice));

        const totalSupply = (await luxorContract.totalSupply()) / Math.pow(10, 9);
        const circSupply = (await lumensContract.circulatingSupply()) / Math.pow(10, 9);

        const stakingTVL = circSupply * luxPrice;
        const marketCap = totalSupply * luxPrice;

        const tokenBalPromises = allBonds.map(bond => bond.getTreasuryBalance(networkID, provider));
        const tokenBalances = await Promise.all(tokenBalPromises);
        const treasuryBalance = tokenBalances.reduce((tokenBalance0, tokenBalance1) => tokenBalance0 + tokenBalance1, 0);

        const tokenAmountsPromises = allBonds.map(bond => bond.getTokenAmount(networkID, provider));
        const tokenAmounts = await Promise.all(tokenAmountsPromises);
        const rfvTreasury = tokenAmounts.reduce((tokenAmount0, tokenAmount1) => tokenAmount0 + tokenAmount1, 0);

        const luxorBondsAmountsPromises = allBonds.map(bond => bond.getLuxorAmount(networkID, provider));
        const luxorBondsAmounts = await Promise.all(luxorBondsAmountsPromises);
        const luxorAmount = luxorBondsAmounts.reduce((luxorAmount0, luxorAmount1) => luxorAmount0 + luxorAmount1, 0);
        const luxorSupply = totalSupply - luxorAmount;

        const rfv = rfvTreasury / luxorSupply;

        const epoch = await stakingContract.epoch();
        const stakingReward = epoch.distribute;
        const circ = await lumensContract.circulatingSupply();
        const stakingRebase = stakingReward / circ;
        const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
        const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;

        const currentIndex = await stakingContract.index();
        const nextRebase = epoch.endTime;

        const treasuryRunway = rfvTreasury / circSupply;
        const runway = Math.log(treasuryRunway) / Math.log(1 + stakingRebase) / 3;

        return {
            currentIndex: Number(ethers.utils.formatUnits(currentIndex, "gwei")), // / 4.5,
            totalSupply,
            marketCap,
            currentBlock,
            circSupply,
            fiveDayRate,
            treasuryBalance,
            stakingAPY,
            stakingTVL,
            stakingRebase,
            luxPrice,
            currentBlockTime,
            nextRebase,
            rfv,
            runway,
        };
    },
);

const initialState = {
    loading: true,
};

export interface IAppSlice {
    loading: boolean;
    stakingTVL: number;
    luxPrice: number;
    marketCap: number;
    circSupply: number;
    currentIndex: string;
    currentBlock: number;
    currentBlockTime: number;
    fiveDayRate: number;
    treasuryBalance: number;
    stakingAPY: number;
    stakingRebase: number;
    networkID: number;
    nextRebase: number;
    totalSupply: number;
    rfv: number;
    runway: number;
}

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        fetchAppSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadAppDetails.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(loadAppDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAppDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            });
    },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
