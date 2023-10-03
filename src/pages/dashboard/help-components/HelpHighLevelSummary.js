import {Box, List, ListItem, Typography} from "@mui/material";
import {HelpOutline} from "@mui/icons-material";
import {useTheme} from "@mui/material/styles";
import {headerBoxStyle, howToStyle, titleStyle} from "./HelpStyles";
import PrintIcon from "@mui/icons-material/Print";

const HelpWorkspace = () => {
    const largeText = {fontSize: '1.5em'};

    return (
        <Box>
            <Typography variant="body1" style={largeText}>
                The Summary Card presents key statistics related to your ongoing analysis in the current workspace. Once finished, you can integrate these statistics into your workflow or utilize the
                 "<PrintIcon style={{verticalAlign: 'middle'}} sx={{mb: .5}} /> Summary and Transcription" button to print or save as a PDF.
            </Typography>

        </Box>
    );
};

export default HelpWorkspace;