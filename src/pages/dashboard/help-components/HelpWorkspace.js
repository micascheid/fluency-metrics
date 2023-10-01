import {Box, List, ListItem, Typography} from "@mui/material";
import {HelpOutline} from "@mui/icons-material";
import {useTheme} from "@mui/material/styles";

const HelpWorkspace = () => {
    const largeText = {fontSize: '1.5em'};

    return (
        <Box>
            <Typography variant="body1" color="error" style={largeText}>
                Note: Ensure you click the “Save Work” button before leaving or refreshing the site. You can always return to
                continue your work so long as you save, automated saving is coming soon.
            </Typography>
            <Typography variant="body1" gutterBottom style={largeText}>
                Your Workspace integrates two tools for your analysis:
            </Typography>

            <List>
                <ListItem>
                    <Typography variant="body1" style={largeText}>
                        <strong>Audio Player Card</strong>: Easily pinpoint stuttered portions in audio.
                    </Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="body1" style={largeText}>
                        <strong>Transcription Card</strong>: Annotate and review audio transcriptions.
                    </Typography>
                </ListItem>
            </List>

            <Typography variant="body1" gutterBottom style={largeText}>
                Here's how to get started:
            </Typography>
            <List>
                <ListItem><Typography variant="body1" style={largeText}>1. Identify the stuttered section in the
                    audio. (Check the "?" in the audio player card on how to do so.)</Typography></ListItem>
                <ListItem><Typography variant="body1" style={largeText}>2. Provide brief information about the
                    event.</Typography></ListItem>
                <ListItem><Typography variant="body1" style={largeText}>3. Let Fluency Metrics handle the rest – no need
                    for stopwatches, manual transcriptions, or syllable counting!</Typography></ListItem>
            </List>

            <Typography variant="body1" color="textSecondary" gutterBottom style={largeText}>
                For detailed guidance, click the
                <HelpOutline
                    color={"primary"}
                    sx={{
                        ml: .5,
                        verticalAlign: 'middle'
                    }}
                    fontSize={"medium"}/> on each card.
            </Typography>

        </Box>
    );
};

export default HelpWorkspace;