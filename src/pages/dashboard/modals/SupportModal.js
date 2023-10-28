import react, {useContext, useState} from 'react';
import {Box, Button, Modal, Stack, Typography} from "@mui/material";
import MainCard from "../../../components/MainCard";
import {StutteredContext} from "../../../context/StutteredContext";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    width: 400,
}

const SupportModal = ({isShow, setIsShow}) => {


    const handleOk = () => {
        setIsShow(false);
    }

    return (
        <Modal
            open={isShow}
            onClose={() => setIsShow(false)}
        >
            <MainCard
                sx={style}
            >
                <Stack sx={{alignItems: 'center'}}>
                    <Typography>micalinscheid@fluencymetrics.com</Typography>
                    <Typography>or</Typography>
                    <Typography>1-907-942-2446 (call/text)</Typography>
                    <Button variant={"outlined"} onClick={handleOk} sx={{width: '25%'}}>
                        Ok
                    </Button>
                </Stack>
            </MainCard>
        </Modal>
    )
}

export default SupportModal;