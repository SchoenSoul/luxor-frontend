import { IPendingTxn } from "./pending-txns-slice";
import { IAccountSlice } from "./account-slice";
import { IAppSlice } from "./app-slice";
import { MessagesState } from "./messages-slice";
import { IWrapSlice } from "./wrap-slice";

// Note(zx): this is a barebones interface for the state. Update to be more accurate
interface IBondSlice {
    status: string;
    [key: string]: any;
}

export interface IReduxState {
    pendingTransactions: IPendingTxn[];
    account: IAccountSlice;
    app: IAppSlice;
    bonding: IBondSlice;
    messages: MessagesState;
    wrapping: IWrapSlice;
}
