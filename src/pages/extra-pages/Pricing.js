// material-ui
import {Backdrop, Box, Button, Card, CardActions, CardContent, Grid, Stack, Typography} from '@mui/material';

import {BASE_URL, CUSTOMER_PORTAL} from "../../constants";
// project import
import MainCard from '../../components/MainCard';
import {Fragment, useContext, useEffect, useState} from "react";
import {UserContext} from "../../context/UserContext";
import {alpha, useTheme} from "@mui/material/styles";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import LoadingOverlay from "../dashboard/LoadingOverlay";


const Pricing = () => {
    //Variables

    const {
        user,
        isLoading
    } = useContext(UserContext);
    const userId = user ? user.uid : null;
    const userEmail = user ? user.email : null;
    const userSubscriptionType = user ? user.subscription.subscription_type : 0;
    const trial = user ? (user.subscription.subscription_status === "trial" ? true : false) : false;
    const trialEnd = user ? user.subscription.trial_end_date : null;
    const customerId = user ? user.subscription.stripe_id : null;
    const organizationalUser = user ? user.subscription.organization_id : null;
    const subscriptionType = user ? user.subscription.subscription_status : null;

    const navigate = useNavigate();
    if (user) {
        console.log("subscription:", user);
    }
    //Functions
    const handleContactUs = () => {
        navigate('/support')
    }

    const trialDaysRemaining = () => {
        let trialEndDate;
        if (!(trialEnd instanceof Date)) {
            trialEndDate = trialEnd.toDate();
        } else {
            trialEndDate = trialEnd;
        }
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const differenceInMilliseconds = trialEndDate - now;

        const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24));

        const days = differenceInDays === 1 ? "day" : "days";

        return Number(differenceInDays > 0 ? differenceInDays : 0).toString() + ` ${days}`;
    };

    const handleManagePlanClick = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/${CUSTOMER_PORTAL}`, {
                customerId: customerId
            });

            window.location.href = response.data.portal_url;
        } catch (error) {
            console.error("Unable to retrieve portal link for customer: ", error);
        }
    };


    //Render Section
    const monthlyOptionRender = () => (
        <Card style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <CardContent sx={{alignItems: 'center'}} style={{flexGrow: 1}}>
                <Stack direction={"row"} sx={{justifyContent: 'center', alignItems: 'baseline'}}>
                    <Typography variant="h2">
                        $19
                    </Typography>
                    <Typography variant="h4" fontWeight={"light"}>
                        /mo
                    </Typography>
                </Stack>
                <Typography align={"center"} variant="subtitle1" fontWeight={"light"}>
                    billed monthly
                </Typography>
                <Typography>
                    &bull; Individual plan
                </Typography>
                <Typography>
                    &bull; Unlimited workspaces and analysis
                </Typography>
                <Typography>
                    &bull; Onboarding assistance
                </Typography>
            </CardContent>
            <Box>
                <CardActions style={{marginTop: 'auto', justifyContent: 'center'}}>
                    {userSubscriptionType === 2 ? (
                        <Button
                            disabled={!customerId}
                            variant={"outlined"}
                            onClick={handleManagePlanClick}
                            size={"large"}
                        >
                            Manage Plan
                        </Button>
                    ) : (userSubscriptionType !== 1 && (
                            <stripe-buy-button
                                buy-button-id="buy_btn_1O6ID0HqVA5HTx14lZaHjkk2"
                                publishable-key="pk_live_51Nu1sKHqVA5HTx14EhN5oCVe966oawDRHXpbSJIXBTJyTIYrAYilODRxFg9CIXviY6Bs0Fib18M9IkcjzhzLNmHx00bw8FQioj"
                                client-reference-id={userId}
                                customer-email={userEmail}
                            >
                            </stripe-buy-button>
                        )

                    )}

                </CardActions>
            </Box>
        </Card>
    );

    const yearlyOptionRender = () => (
        <Card style={{height: '100%', display: 'flex', flexDirection: 'column', maxWidth: 300}}>
            <CardContent sx={{alignItems: 'center'}} style={{flexGrow: 1}}>
                <Stack direction={"row"} sx={{justifyContent: 'center', alignItems: 'baseline'}}>
                    <Typography variant="h2">
                        $39
                    </Typography>
                    <Typography variant="h4" fontWeight={"light"}>
                        /yr
                    </Typography>
                </Stack>
                <Typography>
                    &bull; Individual plan
                </Typography>
                <Typography>
                    &bull; Unlimited workspaces and analysis
                </Typography>
                <Typography>
                    &bull; Onboarding assistance
                </Typography>
            </CardContent>
            <Box>
                <CardActions style={{marginTop: 'auto', justifyContent: 'center'}}>
                    {userSubscriptionType === 1 ? (
                        <Button
                            disabled={!customerId}
                            variant={"outlined"}
                            onClick={handleManagePlanClick}
                            size={"large"}
                        >
                            Manage Plan
                        </Button>
                    ) : (userSubscriptionType !== 2 && (
                            <stripe-buy-button
                                buy-button-id="buy_btn_1O6ICxHqVA5HTx14ZvWXp4RH"
                                publishable-key="pk_live_51Nu1sKHqVA5HTx14EhN5oCVe966oawDRHXpbSJIXBTJyTIYrAYilODRxFg9CIXviY6Bs0Fib18M9IkcjzhzLNmHx00bw8FQioj"
                                client-reference-id={userId}
                                customer-email={userEmail}
                            >
                            </stripe-buy-button>
                        )
                    )}
                </CardActions>
            </Box>
        </Card>
    );

    const organizationalOptionRender = () => (
        <Card style={{height: '100%', display: 'flex', flexDirection: 'column', maxWidth: 300}}>
            <CardContent sx={{alignItems: 'center'}} style={{flexGrow: 1}}>
                <Typography align={"center"} variant="h3">
                    Organization
                </Typography>
                <Typography align={"center"} fontWeight={"light"} variant="subtitle1">
                    billed accordingly
                </Typography>
                <Typography>
                    &bull; Per seat pricing
                </Typography>
                <Typography>
                    &bull; Unlimited workspaces and analysis for each user
                </Typography>
                <Typography>
                    &bull; Onboarding assistance
                </Typography>
            </CardContent>
            <Box>
                <CardActions style={{justifyContent: 'center', marginBottom: 5}}>
                    <Button
                        size="large"
                        variant={"outlined"}
                        onClick={handleContactUs}
                    >
                        Contact Us
                    </Button>
                </CardActions>
            </Box>
        </Card>
    );

    const orgDisable = organizationalUser && subscriptionType === "active";

    return (
        <Fragment>
            {isLoading ? (
                <LoadingOverlay isOpen={true}/>
            ) : (
                <Fragment>
                    {orgDisable &&
                        <Typography variant={"h3"} fontWeight={"light"}>This page is unavailable to organizational
                            users</Typography>
                    }
                    <Box
                        sx={{
                            opacity: orgDisable ? .5 : 1,
                            pointerEvents: orgDisable ? 'none' : 'auto',
                            height: '100%',
                            marginBottom: 1
                        }}
                    >
                        <MainCard title={"Plans"} sx={{height: '100%', marginBottom: 1}}>
                            {trial &&
                                <Grid item xs={12} sm={12}>
                                    <Box sx={{display: 'flex', justifyContent: 'center'}}>
                                        <Typography variant={"h3"} fontWeight={"light"}>Trial Ends
                                            In: {trialDaysRemaining()}</Typography>
                                    </Box>
                                </Grid>
                            }
                            <Stack direction={"row"} spacing={2} justifyContent={"center"}>
                                <Box>
                                    {userSubscriptionType === 2 &&
                                        <Typography variant={"h4"} fontWeight={"light"} gutterBottom>Current
                                            Plan</Typography>}
                                    {yearlyOptionRender()}
                                </Box>

                                <Box>
                                    {userSubscriptionType === 3 &&
                                        <Typography variant={"h4"} fontWeight={"light"} gutterBottom>Current
                                            Plan</Typography>}
                                    {organizationalOptionRender()}
                                </Box>
                            </Stack>
                        </MainCard>

                    </Box>
                    <Button
                        disabled={!customerId}
                        variant={"outlined"}
                        onClick={handleManagePlanClick}
                        size={"large"}
                    >
                        Manage Plan
                    </Button>
                </Fragment>
            )}
        </Fragment>

    );
};

export default Pricing;
