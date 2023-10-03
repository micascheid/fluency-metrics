import react, {useContext, useState} from 'react';
import {Box, Button, Modal, Stack, Typography} from "@mui/material";
import MainCard from "../../../components/MainCard";
import {StutteredContext} from "../../../context/StutteredContext";

const style = {
    position: 'absolute',
    top:'50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    width: 400,
}

const AreYouSureTwo = ({open, setOpen, setIsDelete}) => {


    const handleClose = () => {
        setOpen(false);
    };


    const handleDeleteClick = async () => {
        setIsDelete(true);
        handleClose();
    };


    const handleKeepClick = () => {
        setIsDelete(false);
        handleClose();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <MainCard
                sx={style}
            >
                <Box sx={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
                    <Typography variant={"h4"} sx={{textAlign: 'center', pb: 1, color: 'red'}}>
                        Warning: This is a permanent action and cannot be reverted.
                    </Typography>
                    <Typography sx={{ textAlign: 'center', pb: 1}}>Are you sure you would like to delete the workspace you selected?</Typography>
                    <Stack direction={"row"} spacing={1}>
                        <Button variant={"contained"} color={"error"} onClick={handleDeleteClick}>
                            Delete
                        </Button>
                        <Button variant={"contained"} color={"success"} onClick={handleKeepClick}
                        >
                            Keep
                        </Button>
                    </Stack>
                </Box>
            </MainCard>
        </Modal>
    )
}

export default AreYouSureTwo;