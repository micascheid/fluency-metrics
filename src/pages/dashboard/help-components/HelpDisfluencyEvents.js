import {Box, Typography} from "@mui/material";
import {headerBoxStyle, howToStyle, titleStyle} from "./HelpStyles";
import PrintIcon from "@mui/icons-material/Print";


const HelpDisfluencyEvents = () => {
    const largeText = {fontSize: '1.5em'};

    return (
        <Box>
            <Typography variant="body1" style={largeText}>
                This card dynamically displays a list of disfluency events as you identify them. For each event, you'll see its type, duration, associated physical concomitants, and the relevant text.
            </Typography>
        </Box>
    );
};

export default HelpDisfluencyEvents;