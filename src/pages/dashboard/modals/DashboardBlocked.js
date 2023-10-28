import react, {useContext, useState} from 'react';
import {Backdrop, Box, Button, CircularProgress, Grid, Modal, Stack, Typography} from "@mui/material";
import MainCard from "../../../components/MainCard";
import {StutteredContext} from "../../../context/StutteredContext";
import React from "react";
import {useNavigate} from "react-router-dom";
import ReloadButton from "../../../components/ReloadButton";
import {useTheme} from "@mui/material/styles"
import {alpha} from "@mui/material/styles";

const DashboardBlocked = ({isBlocked}) => {
    const navigate = useNavigate();
    const theme = useTheme()


    return (
        <Backdrop open={isBlocked} sx={{backgroundColor: alpha(theme.palette.warning.dark, .5), color: '#fff', zIndex: (theme) => theme.zIndex.appBar - 1}}>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
            >
                <Grid container spacing={2}>
                    {/* First Column */}
                    <Grid item xs={5}>
                        <Stack spacing={1} sx={{alignItems: 'center'}}>
                            <Typography variant="h1" gutterBottom>
                                Oh no!
                            </Typography>
                            <Typography sx={{textAlign: 'center'}} variant={"h3"} fontWeight={"light"}>
                                Looks like you're not under an active subscription.
                            </Typography>
                            <Button

                                variant={"outlined"}
                                onClick={() => navigate('/pricing')}
                            >Resume Access</Button>
                        </Stack>
                    </Grid>

                    {/* "Or" text in the center */}
                    <Grid item xs={2}>
                        <Typography variant={"h3"} fontWeight={"light"} textAlign="center">Or</Typography>
                    </Grid>

                    {/* Second Column */}
                    <Grid item xs={5}>
                        <Stack spacing={1} sx={{alignItems: 'center'}}>
                            <Typography sx={{alignSelf: 'center'}} variant="h1" gutterBottom>
                                Refresh
                            </Typography>
                            <Typography variant={"h3"} fontWeight={"light"}>
                                Reload if you just made a purchase
                            </Typography>
                            <ReloadButton />
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Backdrop>
    );
};

export default DashboardBlocked;