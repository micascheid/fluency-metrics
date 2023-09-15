import react, {Fragment, useContext, useState} from 'react';
import {HelpOutline} from "@mui/icons-material";
import {Modal, Stack, Typography} from "@mui/material";
import MainCard from "../../components/MainCard";
import {useTheme} from "@mui/material/styles";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
}



const Help = ({children, title}) => {
    const [isShowHelp, setIsShowHelp] = useState(false);
    const theme = useTheme();
    const handleClose = () => {
        setIsShowHelp(false);
    };


    return (
        <Fragment>
            <Stack spacing={1} direction={"row"}>
                <HelpOutline
                    sx={{
                        ':hover': {
                            color: theme.palette.primary.main
                        }
                    }}
                    onClick={() => {
                    setIsShowHelp((prevState) => {
                        console.log("set help");
                    return !prevState
                })}}/>
                <Typography variant={"h5"} fontWeight={"medium"}>{title}</Typography>
            </Stack>
            {isShowHelp &&
                <Modal
                    open={isShowHelp}
                    onClose={handleClose}
                >
                    <MainCard sx={style}>
                        {children}
                    </MainCard>
                </Modal>
            }
        </Fragment>


    );
};

export default Help;