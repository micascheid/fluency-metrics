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
                How-To:
            </Typography>
            <Typography variant="subtitle1" sx={{alignItems: "center"}} gutterBottom>
                {/* Increased font size for body text */}
                At any point click on a
                <Tooltip title="Click on these for help.">
                    <HelpOutline sx={{
                        ml: 0.5,
                        mr:0.5,
                        color: theme.palette.primary.main,
                        verticalAlign: 'middle'
                    }} fontSize={"small"}/>
                </Tooltip>
                to view how to use that portion of the Fluency Metrics tool.
            </Typography>
            <Typography variant={'h5'} sx={{textDecoration: 'underline'}}>The general flow of the tool is as follows:</Typography>
            <List sx={{
                '& .MuiListItem-root': {
                    pt: 0,
                    pb: 0,
                }
            }}>
                <ListItem>
                    <CustomListItemText
                        primary="1.) Create or Resume a previous workspace in which Fluency Metrics will auto generate a transcription."
                    />
                </ListItem>
                <ListItem>
                    <CustomListItemText
                        primary="2.) Using the tools in the workspace, provide your expertise on stuttered regions within the workspace."
                    />
                </ListItem>
                <ListItem>
                    <CustomListItemText
                        primary="3.) At the bottom you’ll see a summary which Fluency Metrics creates for you. You may view, print or save it to a pdf."
                    />
                </ListItem>
            </List>
        </Box>
    );
};

export default InstructionsAutoMode;