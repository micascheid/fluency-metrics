import react, {useContext, useState} from 'react';
import {Backdrop, Box, Button, CircularProgress, Modal, Stack, Typography} from "@mui/material";
import MainCard from "../../../components/MainCard";
import {StutteredContext} from "../../../context/StutteredContext";
import React from "react";

const DashboardBlocked = ({isBlocked}) => {



    return (
        <Backdrop open={isBlocked} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.appBar - 1 }}>
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
                    <Typography>Looks like your not under an active subscription.</Typography>
                    {/*TODO: takes user to plans*/}
                    <Button variant={"contained"}>Resume Access</Button>
                </Stack>
            </Box>
        </Backdrop>
    );
};

export default DashboardBlocked;