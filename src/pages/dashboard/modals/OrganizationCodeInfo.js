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

const OrganizationCodeInfo = ({setIsShow}) => {


    const handleOk = () => {
        setIsShow(false);
    }

    return (
        <Modal
            open={true}
            onClose={() => setIsShow(false)}
        >
            <MainCard
                sx={style}
            >
                <Stack>
                    <Typography variant={"h4"} fontWeight={"medium"} sx={{textAlign: 'Left', pb: 1}}>
                        Fluency Metrics will work with your organizations admin to get you an account without your purchase.
                    </Typography>
                    <Typography>Please contact:</Typography>
                    <Typography>micalinscheid@fluencymetrics.com</Typography>
                    <Typography>or</Typography>
                    <Typography>1-907-942-2446 (call/text)</Typography>
                    <Typography fontWeight={"bold"}>And we will get you a free account as soon as possible</Typography>
                    <Button variant={"outlined"} onClick={handleOk}>
                        Ok
                    </Button>
                </Stack>
            </MainCard>
        </Modal>
    )
}

export default OrganizationCodeInfo;