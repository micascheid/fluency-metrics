import react, {useContext, useState} from 'react';
import {Backdrop, Box, Button, CircularProgress, Modal, Stack, Typography} from "@mui/material";
import React from "react";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    width: 400,
}

const BadHealth = ({reason, open}) => {



    return (
        <Backdrop open={open} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.appBar - 1 }}>
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
                    <Typography variant={"h3"}>Looks like were having some issues on our end.</Typography>
                    <Typography variant={"h4"}>Reason: {reason}</Typography>
                </Stack>
            </Box>
        </Backdrop>
    );
};

export default BadHealth;