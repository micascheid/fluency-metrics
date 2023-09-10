import react from 'react';
import {Box, Button, Modal, Stack, Typography} from "@mui/material";
import MainCard from "../../../components/MainCard";
import React from "react";

const style = {
    position: 'absolute',
    top:'50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    width: 400,
}

const CorrectAudioFileChecker = ({audioFileName, isModalOpen, onYes, onNo}) => {

    return (
        <Modal open={isModalOpen}>
            <MainCard sx={style}>
                <Box sx={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
                    <Typography variant={"body"} sx={{textAlign: 'center', pb: 1}}>
                        Is <strong>{audioFileName}</strong> the correct audio file associated with this workspace?
                        At this time FlunceyMetrics does not store audio files.
                    </Typography>
                    <Stack direction={"row"} spacing={1}>
                        <Button variant={"contained"} onClick={onYes}>
                            Yes
                        </Button>
                        <Button variant={"contained"} onClick={onNo}
                        >
                            No
                        </Button>
                    </Stack>
                </Box>
            </MainCard>
        </Modal>
    );
};

export default CorrectAudioFileChecker;