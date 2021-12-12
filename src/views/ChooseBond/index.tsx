import { useSelector } from "react-redux";
import { Paper, Grid, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Zoom } from "@material-ui/core";
import { BondTableData, BondDataCard } from "./BondRow";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { trim } from "../../helpers";
import useBonds from "../../hooks/bonds";
import ClaimBonds from "./ClaimBonds";
import isEmpty from "lodash/isEmpty";
import "./choosebond.scss";
import { Skeleton } from "@material-ui/lab";
import { useAppSelector } from "src/hooks";

import { IReduxState } from "../../store/slices/state.interface";
import { IUserBondDetails } from "src/store/slices/account-slice";

function ChooseBond() {
    const { bonds } = useBonds();
    const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query

    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const isAccountLoading: boolean = useAppSelector(state => state.account.loading);

    const accountBonds: IUserBondDetails[] = useAppSelector(state => {
        const withInterestDue = [];
        for (const bond in state.account.bonds) {
            if (state.account.bonds[bond].interestDue > 0) {
                withInterestDue.push(state.account.bonds[bond]);
            }
        }
        return withInterestDue;
    });

    const luxPrice = useSelector<IReduxState, number>(state => {
        return state.app.luxPrice;
    });

    const treasuryBalance = useSelector<IReduxState, number>(state => {
        return state.app.treasuryBalance;
    });

    return (
        <div className="choose-bond-view">
            {!isAccountLoading && !isEmpty(accountBonds) && <ClaimBonds activeBonds={accountBonds} />}
            <Zoom in={true}>
                <div className="choose-bond-view-card">
                    <div className="choose-bond-view-card-header">{/* <p className="choose-bond-view-card-title"> Mint Luxor using DAI</p> */}</div>
                    <Grid container item xs={12} spacing={2} className="choose-bond-view-card-metrics">
                        <Grid item xs={12} sm={6}>
                            <Box textAlign="center">
                                <p className="choose-bond-view-card-metrics-title">Treasury Balance</p>
                                <p className="choose-bond-view-card-metrics-value">
                                    {isAppLoading ? (
                                        <Skeleton width="180px" />
                                    ) : (
                                        new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                            maximumFractionDigits: 0,
                                            minimumFractionDigits: 0,
                                        }).format(treasuryBalance)
                                    )}
                                </p>
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Box textAlign="center">
                                <p className="choose-bond-view-card-metrics-title">LUX Price</p>
                                <p className="choose-bond-view-card-metrics-value">
                                    {isAppLoading ? (
                                        <Skeleton width="100px" />
                                    ) : (
                                        new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                            maximumFractionDigits: 0,
                                            minimumFractionDigits: 0,
                                        }).format(luxPrice)
                                    )}
                                </p>
                            </Box>
                        </Grid>
                    </Grid>
                    {!isSmallScreen && (
                        <Grid container item>
                            <TableContainer className="choose-bond-view-card-table">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">
                                                <p className="choose-bond-view-card-table-title">Mint</p>
                                            </TableCell>
                                            <TableCell align="center">
                                                <p className="choose-bond-view-card-table-title">Price</p>
                                            </TableCell>
                                            <TableCell align="center">
                                                <p className="choose-bond-view-card-table-title">ROI</p>
                                            </TableCell>
                                            <TableCell align="right">
                                                <p className="choose-bond-view-card-table-title">Purchased</p>
                                            </TableCell>
                                            <TableCell align="right"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {bonds.map(bond => (
                                            <BondTableData key={bond.name} bond={bond} />
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    )}
                </div>
            </Zoom>

            {isSmallScreen && (
                <div className="choose-bond-view-card-container">
                    <Grid container item spacing={2}>
                        {bonds.map(bond => (
                            <Grid item xs={12} key={bond.name}>
                                <BondDataCard key={bond.name} bond={bond} />
                            </Grid>
                        ))}
                    </Grid>
                </div>
            )}
        </div>
    );
}

export default ChooseBond;
