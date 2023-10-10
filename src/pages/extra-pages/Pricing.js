// material-ui
import {Box, Button, Card, CardActions, CardContent, Divider, Grid, Modal, Stack, Typography} from '@mui/material';

// project import
import MainCard from '../../components/MainCard';
import {useContext, useState} from "react";
import {UserContext} from "../../context/UserContext";
import {useTheme} from "@mui/material/styles";



// ==============================|| SAMPLE PAGE ||============================== //

const Pricing = () => {
    //Variables
    const [open, setOpen] = useState(false);

    const {
        user,
    } = useContext(UserContext);
    const userId = user ? user.uid : null;
    const userEmail = user ? user.email : null;
    const theme = useTheme();
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    //Functions
    const handleMonthlyOption = () => {


    }


    //Render Section
    const monthlyOptionRender = () => (
        <Card style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
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
                <Typography style={{overflowY: 'auto', maxHeight: '150px'}}>
                    &bull; Individual plan
                </Typography>
                <Typography style={{overflowY: 'auto', maxHeight: '150px'}}>
                    &bull; Unlimited workspaces and analysis
                </Typography>
                <Typography style={{overflowY: 'auto', maxHeight: '150px'}}>
                    &bull; Onboarding assistance
                </Typography>
            </CardContent>
            <Box>
                <CardActions style={{marginTop: 'auto', justifyContent: 'center'}}>
                    <stripe-buy-button
                        buy-button-id="buy_btn_1Nz3hYHqVA5HTx14aZRI816k"
                        publishable-key="pk_test_51Nu1sKHqVA5HTx14LtyMiWlnp891ADmUOlHlV1hfa3Fu8HAdfr1Q14LPtPmNg1a4M3xaEIAIOW4mSwchw8qcp3SU00mCWRNhQS"
                        client-reference-id={userId}
                        customer-email={userEmail}
                    />
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
                <Typography style={{overflowY: 'auto', maxHeight: '150px'}}>
                    &bull; Individual plan
                </Typography>
                <Typography style={{overflowY: 'auto', maxHeight: '150px'}}>
                    &bull; Unlimited workspaces and analysis
                </Typography>
                <Typography style={{overflowY: 'auto', maxHeight: '150px'}}>
                    &bull; Onboarding assistance
                </Typography>
            </CardContent>
            <Box>
                <CardActions style={{marginTop: 'auto', justifyContent: 'center'}}>
                    <Button size="small" variant="contained">
                        Purchase Yearly
                    </Button>
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
                <Typography style={{overflowY: 'auto', maxHeight: '150px'}}>
                    &bull; Per seat pricing
                </Typography>
                <Typography style={{overflowY: 'auto', maxHeight: '150px'}}>
                    &bull; Unlimited workspaces and analysis for each user
                </Typography>
                <Typography style={{overflowY: 'auto', maxHeight: '150px'}}>
                    &bull; Onboarding assistance
                </Typography>
            </CardContent>
            <Box>
                <CardActions style={{marginTop: 'auto', justifyContent: 'center'}}>
                    <Button size="small" variant="contained">
                        Contact Us
                    </Button>
                </CardActions>
            </Box>
        </Card>
    );


    return (
        <MainCard title={"Pricing Plans"}>
            <Grid container spacing={3}>

                <Grid item xs={12} sm={4}>
                    {monthlyOptionRender()}
                </Grid>
                <Grid item xs={12} sm={4}>
                    {yearlyOptionRender()}
                </Grid>

                <Grid item xs={12} sm={4}>
                    {organizationalOptionRender()}
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default Pricing;
