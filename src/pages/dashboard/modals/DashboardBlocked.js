import react, {useContext, useState} from 'react';
import {Backdrop, Box, Button, CircularProgress, Modal, Stack, Typography} from "@mui/material";
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
                <Stack spacing={1} sx={{alignItems: 'center'}}>
                    <Typography variant="h1" component="div" gutterBottom>
                        Oh no!
                    </Typography>
                    <Typography variant={"h3"} fontWeight={"light"}>Looks like your not under an active subscription.</Typography>
                    <Button
                        variant={"outlined"}
                        onClick={() => navigate('/pricing')}
                    >Resume Access</Button>
                    <Typography variant={"h3"} fontWeight={"light"}>Or</Typography>
                    <Typography variant={"h3"} fontWeight={"light"}>Reload if you just made a purchase</Typography>
                    <ReloadButton />

                </Stack>
            </Box>
        </Backdrop>
    );
};

export default DashboardBlocked;