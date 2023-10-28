// material-ui
import {Backdrop, Box, Button, Card, CardActions, CardContent, Grid, Stack, Typography} from '@mui/material';

import {BASE_URL, CUSTOMER_PORTAL} from "../../constants";
// project import
import MainCard from '../../components/MainCard';
import {Fragment, useContext, useState} from "react";
import {UserContext} from "../../context/UserContext";
import {alpha, useTheme} from "@mui/material/styles";
import axios from "axios";
import {useNavigate} from "react-router-dom";


const Pricing = () => {
    //Variables
    const [loadingPortal, setLoadingPortal] = useState(false);
    const {
        user,
    } = useContext(UserContext);
    const userId = user ? user.uid : null;
    const userEmail = user ? user.email : null;
    const userSubscriptionType = user ? user.subscription.subscription_type : 0;
    const trial = user ? (user.subscription.subscription_status === "trial" ? true : false) : false;
    const trialEnd = user ? user.subscription.trial_end_date : null;
    const customerId = user ? user.subscription.stripe_id : null;
    const organizationalUser = user ? user.subscription.organization_id : null;
    const subscriptionType = user ? user.subscription.subscription_status : null;
    const theme = useTheme();

    const navigate = useNavigate();

    //Functions
    const handleContactUs = () => {
        navigate('/support')
    }

    const trialDaysRemaining = () => {
        const trialEndDate = trialEnd.toDate();
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
                                buy-button-id="buy_btn_1Nz3hYHqVA5HTx14aZRI816k"
                                publishable-key="pk_test_51Nu1sKHqVA5HTx14LtyMiWlnp891ADmUOlHlV1hfa3Fu8HAdfr1Q14LPtPmNg1a4M3xaEIAIOW4mSwchw8qcp3SU00mCWRNhQS"
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
        <Card style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            <CardContent sx={{alignItems: 'center'}} style={{flexGrow: 1}}>
                <Stack direction={"row"} sx={{justifyContent: 'center', alignItems: 'baseline'}}>
                    <Typography variant="h2">
                        $16
                    </Typography>
                    <Typography variant="h4" fontWeight={"light"}>
                        /mo
                    </Typography>
                </Stack>
                <Typography align={"center"} variant="subtitle1" fontWeight={"light"}>
                    billed yearly
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
                                buy-button-id="buy_btn_1O1W0cHqVA5HTx14dmOOhUQp"
                                publishable-key="pk_test_51Nu1sKHqVA5HTx14LtyMiWlnp891ADmUOlHlV1hfa3Fu8HAdfr1Q14LPtPmNg1a4M3xaEIAIOW4mSwchw8qcp3SU00mCWRNhQS"
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
        <Card style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
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
                    <Grid container spacing={3}>
                        {trial &&
                            <Grid item xs={12} sm={12}>
                                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                                    <Typography variant={"h3"} fontWeight={"light"}>Trial Ends
                                        In: {trialDaysRemaining()}</Typography>
                                </Box>
                            </Grid>
                        }
                        <Grid item xs={12} sm={4}>
                            {userSubscriptionType === 1 &&
                                <Typography variant={"h4"} fontWeight={"light"} gutterBottom>Current Plan</Typography>}
                            {monthlyOptionRender()}
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            {userSubscriptionType === 2 &&
                                <Typography variant={"h4"} fontWeight={"light"} gutterBottom>Current Plan</Typography>}
                            {yearlyOptionRender()}
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            {userSubscriptionType === 3 &&
                                <Typography variant={"h4"} fontWeight={"light"} gutterBottom>Current Plan</Typography>}
                            {organizationalOptionRender()}
                        </Grid>
                    </Grid>
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

    );
};

export default Pricing;
