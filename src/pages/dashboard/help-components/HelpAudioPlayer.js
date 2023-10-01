import {Box, List, ListItem, Typography} from "@mui/material";
import {useTheme} from "@mui/material/styles";

const HelpAudioPlayer = () => {
    const largeText = { fontSize: '1.4em', fontWeight: 'light' };
    const theme = useTheme();


    return (
        <Box>
            <List>
                <ListItem>
                    <Typography variant="body1" style={largeText}>
                        <strong>Play & Pause</strong>: Begin your analysis by pressing the “space-bar” or using the “Play/Pause” button.
                    </Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="body1" style={largeText}>
                        <strong>Adjusting Playback Speed</strong>: On the left, you'll find a slider. Use this to fine-tune the audio's playback speed for detailed listening.
                    </Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="body1" style={largeText}>
                        <strong>Adjusting Waveform Detail</strong>: On the right you'll see a slider which helps you zoom in or out of the speech sample.
                    </Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="body1" style={{...largeText, color: theme.palette.success.light}}>
                        <strong>Marking Disfluencies</strong>: When you detect the start of a disfluency, press the ’s’ key. To mark its end, press the ’s’ key again. This action will highlight the section on the waveform in red.
                    </Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="body1" style={largeText}>
                        <strong>Multiple Disfluencies</strong>: Continue using the 's' key method to pinpoint all the disfluency events in the audio.
                    </Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="body1" style={largeText}>
                        <strong>Fine-Tuning Stuttered Regions</strong>: Before finalizing, you can modify the edges of a red region to include more or fewer words for precise accuracy. Once confirmed, the region can only be removed, but rest assured, no words will be deleted.
                    </Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="body1" style={largeText}>
                        <strong>Event Details</strong>: Click on any highlighted region to open a popup. Here, you can detail the specifics of the disfluency event. Confirm your input by pressing the “Confirm” button. Use the red "trash can" icon if you need to remove.
                    </Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="body1" style={largeText}>
                        <strong>Updates & Metrics</strong>: As you annotate and adjust transcriptions, witness real-time updates in the transcription. Concurrently, the summary card will present the latest metrics for your analysis.
                    </Typography>
                </ListItem>
            </List>
        </Box>
    );
};

export default HelpAudioPlayer;