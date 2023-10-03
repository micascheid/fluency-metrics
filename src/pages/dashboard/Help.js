import react, {Fragment, useContext, useState} from 'react';
import {HelpOutline} from "@mui/icons-material";
import {Box, IconButton, Modal, Stack, styled, Tooltip, Typography} from "@mui/material";
import MainCard from "../../components/MainCard";
import {useTheme} from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import CloseIcon from '@mui/icons-material/Close';
import {howToStyle, titleStyle} from "./help-components/HelpStyles";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    maxHeight: '80%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    overflowY: 'auto'
}
const ExpandMore = styled((props) => {
    const {expand, ...other} = props;
    return <IconButton {...other} />;
})(({theme, expand}) => ({
    transform: !expand ? 'rotate(-90deg)' : 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));


const Help = ({children, title}) => {
    const [isShowHelp, setIsShowHelp] = useState(false);
    const theme = useTheme();
    const [expanded, setExpanded] = React.useState(true);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    const handleClose = () => {
        setIsShowHelp(false);
    };


    return (
        <Fragment>
            <Stack spacing={1} direction={"row"} sx={{alignItems: 'center'}}>
                <Tooltip title="Click for help">
                    <IconButton
                        onClick={() => {
                            setIsShowHelp(prevState => {
                                return !prevState;
                            })
                        }}>
                        <HelpOutline
                            sx={{
                                color: theme.palette.primary.main,
                            }}
                            fontSize={"medium"}

                        />
                    </IconButton>

                </Tooltip>
                <Typography variant={"h5"} fontWeight={"medium"}>{title}</Typography>
            </Stack>
            {isShowHelp &&
                <Modal
                    open={isShowHelp}
                    onClose={handleClose}
                >
                    <MainCard sx={style} title={
                        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                            <Box>
                                <Typography variant="h4" style={howToStyle}>
                                    How-To:
                                </Typography>
                                <Typography variant="h6" style={titleStyle}>
                                    {title}
                                </Typography>
                            </Box>
                            <IconButton
                                fontSize={"large"}
                                onClick={() => setIsShowHelp(false)}
                            >
                                <CloseIcon/>
                            </IconButton>
                        </Box>
                    }>

                        {children}
                    </MainCard>
                </Modal>
            }
        </Fragment>


    );
};

export default Help;