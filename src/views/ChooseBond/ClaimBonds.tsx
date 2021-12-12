import { useEffect, useState } from "react";
import { ClaimBondTableData, ClaimBondCardData } from "./ClaimRow";
import { isPendingTxn, txnButtonTextGeneralPending } from "src/store/slices/pending-txns-slice";
import redeemAllBonds from "src/store/slices/bond-slice";
import CardHeader from "../../components/CardHeader";
import { useWeb3Context } from "src/hooks";
import useBonds from "src/hooks/bonds";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Zoom } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "./choosebond.scss";
import "src/style.scss";
import { useDispatch, useSelector } from "react-redux";
import { IReduxState } from "src/store/slices/state.interface";
import { IPendingTxn } from "src/store/slices/pending-txns-slice";

function ClaimBonds(activeBonds: any) {
    const dispatch = useDispatch();
    const { provider, address } = useWeb3Context();
    const { bonds } = useBonds();

    const [numberOfBonds, setNumberOfBonds] = useState(0);
    const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query

    let pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    const pendingClaim = () => {
        if (isPendingTxn(pendingTransactions, "redeem_all_bonds") || isPendingTxn(pendingTransactions, "redeem_all_bonds_autostake")) {
            return true;
        }

        return false;
    };

    const onRedeemAll = async (autostake: any) => {
        console.log("redeeming all bonds");

        // dispatch(redeemAllBonds(, redeem));

        console.log("redeem all complete");
    };

    useEffect(() => {
        let bondCount = Object.keys(activeBonds).length;
        setNumberOfBonds(bondCount);
    }, [activeBonds]);

    return (
        <>
            {numberOfBonds > 0 && (
                <Zoom in={true}>
                    <Paper className="lux-card claim-bonds-card">
                        {/* <CardHeader title="Your Bonds" /> */}
                        <Box>
                            {!isSmallScreen && (
                                <TableContainer>
                                    <Table aria-label="Claimable bonds">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center">Bond</TableCell>
                                                <TableCell align="center">Claimable</TableCell>
                                                <TableCell align="center">Pending</TableCell>
                                                <TableCell align="right">Fully Vested</TableCell>
                                                <TableCell align="right"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Object.entries(activeBonds).map((bond, i) => (
                                                <ClaimBondTableData key={i} userBond={bond} />
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}

                            {isSmallScreen && Object.entries(activeBonds).map((bond, i) => <ClaimBondCardData key={i} userBond={bond} />)}

                            <Box display="flex" justifyContent="center" className={`global-claim-buttons ${isSmallScreen ? "small" : ""}`}>
                                {numberOfBonds > 1 && (
                                    <>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className="transaction-button"
                                            fullWidth
                                            disabled={pendingClaim()}
                                            onClick={() => {
                                                onRedeemAll({ autostake: false });
                                            }}
                                        >
                                            {txnButtonTextGeneralPending(pendingTransactions, "redeem_all_bonds", `Claim all`)}
                                        </Button>

                                        <Button
                                            variant="contained"
                                            color="primary"
                                            id="claim-all-and-stake-btn"
                                            className="transaction-button"
                                            fullWidth
                                            disabled={pendingClaim()}
                                            onClick={() => {
                                                onRedeemAll({ autostake: true });
                                            }}
                                        >
                                            {txnButtonTextGeneralPending(pendingTransactions, "redeem_all_bonds_autostake", `Claim all and Stake`)}
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Box>
                    </Paper>
                </Zoom>
            )}
        </>
    );
}

export default ClaimBonds;
