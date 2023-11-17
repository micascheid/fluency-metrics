import React from 'react';
import {
    Box,
    CircularProgress,
    Typography,
    Backdrop
} from '@mui/material';

const LoadingOverlay = ({ isOpen }) => {
    return (
        <Backdrop open={isOpen} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant="h1" component="div" gutterBottom>
                    Loading...
                </Typography>
                <CircularProgress color="inherit" />
            </Box>
        </Backdrop>
    );
};

export default LoadingOverlay;
