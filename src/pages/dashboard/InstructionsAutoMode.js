import react from 'react';
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

function HelpOutlineIcon() {
    return null;
}

const CustomListItemText = styled(ListItemText)(({ theme }) => ({
    fontSize: theme.typography.h5.fontSize,
    fontWeight: 'medium',
}));

CustomListItemText.defaultProps = {
    disableTypography: true,
}


const InstructionsAutoMode = () => {
    const theme = useTheme();
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Getting Started:
            </Typography>
            <Typography variant="subtitle1" sx={{alignItems: "center"}} gutterBottom>
                {/* Increased font size for body text */}
                Click any of the
                <Tooltip title="Click on these for help.">
                    <HelpOutline sx={{
                        ml: 0.5,
                        mr:0.5,
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
                        primary="1.) Start a new workspace or resume an existing one. Upon creation, Fluency Metrics provides an auto-generated transcription and audio player for you to work from."
                    />
                </ListItem>
                <ListItem>
                    <CustomListItemText
                        primary="2.) Next the workspace will open, now you may utilize the workspace tools to annotate stuttered regions."
                    />
                </ListItem>
                <ListItem>
                    <CustomListItemText
                        primary={`3.) When you're done in the workspace scroll down to \"Summary\" to view, print, or download the auto-generated metrics summary available at the bottom. You can also add extra notes within the summary.`}
                    />
                </ListItem>
            </List>
        </Box>
    );
};

export default InstructionsAutoMode;