import {Box, Typography} from "@mui/material";
import {headerBoxStyle, howToStyle, titleStyle} from "./HelpStyles";


const HelpAdditionalNotes = () => {
    const largeText = { fontSize: '1.4em', fontWeight: 'light' };

    return (
        <Box>
            <Typography variant="body1" style={largeText}>
                This card provides a live tally of metrics commonly required for the SSI-4 as you progress with your analysis.
            </Typography>
        </Box>
    );
};

export default HelpAdditionalNotes;