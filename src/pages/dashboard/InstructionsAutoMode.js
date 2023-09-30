import react, {Fragment, useEffect, useRef, useState} from 'react';
import {
    Box,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Stack,
    styled, TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {HelpOutline} from "@mui/icons-material";
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';

function HelpOutlineIcon() {
    return null;
}

const CustomListItemText = styled(ListItemText)(({theme}) => ({
    fontSize: theme.typography.h5.fontSize,
    fontWeight: 'medium',
}));

CustomListItemText.defaultProps = {
    disableTypography: true,
}


const InstructionsAutoMode = ({setOverflow}) => {
    const theme = useTheme();
    const contentBoxRef = useRef(null);
    const parentContainerRef = useRef(null);

    useEffect(() => {
        const checkOverflow = () => {
            if (contentBoxRef.current.scrollHeight > parentContainerRef.current.clientHeight) {
                setOverflow(true);
            } else {
                setOverflow(false);
            }
        };

        checkOverflow();

        window.addEventListener('resize', checkOverflow);

        return () => window.removeEventListener('resize', checkOverflow);

    }, []);


    return (
        <Box ref={parentContainerRef} sx={{height: '335px'}}>
        <Box ref={contentBoxRef}>
            <Typography variant="h4" gutterBottom>
                Getting Started:
            </Typography>
            <Typography variant="subtitle1" sx={{alignItems: "center"}} gutterBottom>
                {/* Increased font size for body text */}
                Click any of the
                <Tooltip title="Click on these for help.">
                    <HelpOutline sx={{
                        ml: 0.5,
                        mr: 0.5,
                        color: theme.palette.primary.main,
                        verticalAlign: 'middle'
                    }} fontSize={"small"}/>
                </Tooltip>
                icons anytime for guidance.
            </Typography>
            <Typography variant={'h5'} sx={{textDecoration: 'underline'}}>Tool Workflow:</Typography>
            <List sx={{
                '& .MuiListItem-root': {
                    pt: 0,
                    pb: 0,
                }
            }}>
                <ListItem>
                    <CustomListItemText
                        primary="1.) Begin with “New Workspace” or “Resume Workspace”. Upon creation, Fluency Metrics provides an automated transcription and audio player for you to work from or continue from where you left off."
                    />
                </ListItem>
                <ListItem>
                    <CustomListItemText
                        primary="2.) Next, the workspace will open, now you may utilize the workspace tools to annotate stuttered regions."
                    />
                </ListItem>
                <ListItem>
                    <CustomListItemText
                        primary={`3.) When you're done, scroll down to "Summary" to view, print, or download the auto-generated metrics summary available at the bottom. You may add extra notes within the summary.`}
                    />
                </ListItem>
                <ListItem>
                    <CustomListItemText
                        primary={`Note: Only provide information about the stuttered events through the audio player. Fluency Metrics will handle the rest`}
                    />
                </ListItem>
            </List>
        </Box>
        </Box>
    );
};

export default InstructionsAutoMode;