import react, {useContext, useState} from 'react';
import {Box, Button, Modal, Stack, Typography} from "@mui/material";
import MainCard from "../../../components/MainCard";
import {StutteredContext} from "../../../context/StutteredContext";

const AreYouSure = ({setAreYouSure, setYesNo}) => {
    const {
        resetTransAndSE,
    } = useContext(StutteredContext);

    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => {
        setAreYouSure(false);
    };
    const style = {
        position: 'absolute',
        top:'50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 400,
    }

    const handleYesClick = () => {
        // resetTransAndSE();
        setYesNo(true);
        handleClose();
    };


    const handleNoClick = () => {
        setYesNo(false);
        handleClose();
    };

    return (
        <Modal
            open={true}
            onClose={handleClose}
            >
            <MainCard
            sx={style}
            >
                <Box sx={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
                    <Typography variant={"h4"} sx={{textAlign: 'center', pb: 1}}>
                        Retrieving transcription will delete your current transcription and edits. Are you sure
                        you want to continue?
                    </Typography>
                    <Stack direction={"row"} spacing={1}>
                        <Button variant={"contained"} onClick={handleYesClick}>
                            Yes
                        </Button>
                        <Button variant={"contained"} onClick={handleNoClick}
                        >
                            No
                        </Button>
                    </Stack>
                </Box>
            </MainCard>
        </Modal>
    )
}

export default AreYouSure;