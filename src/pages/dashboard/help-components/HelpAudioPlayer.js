import {Box, List, ListItem, Typography} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import ZoomOut from "@mui/icons-material/ZoomOut";
import ZoomIn from "@mui/icons-material/ZoomIn";

const HelpAudioPlayer = () => {
    const largeText = { fontSize: '1.4em', fontWeight: 'light' };
    const theme = useTheme();


    return (
        <Box>
            <List>
                <ListItem>
                    <Typography variant="body1" style={largeText} component="div">
                        <strong>Keyboard Shortcuts</strong>:
                        <ul>
                            <li><strong>'s'</strong>: To mark or end stuttered event.</li>
                            <li><strong>'space-bar</strong>: Play/Pause audio.</li>
                        </ul>
                    </Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="body1" style={largeText}>
                        <strong>Play & Pause</strong>: Begin your analysis by pressing the “space-bar” or using the “Play/Pause” button.
                    </Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="body1" style={largeText}>
                        <strong>Audio Cursor</strong>: Move the audio cursor by clicking anywhere on the waveform.
                    </Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="body1" style={largeText}>
                        <strong>Adjusting Playback Speed</strong>: On the left, you'll find a slider. Use this to fine-tune the audio's playback speed for detailed listening.
                    </Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="body1" style={largeText}>
                        <strong>Adjusting Waveform Zoom</strong>: On the farthest right side of your controls you'll find the <ZoomOut color={"primary"} sx={{
                        ml: .5,
                        verticalAlign: 'middle'
                    }} fontSize={"small"}/>
                        and the
                        <ZoomIn color={"primary"} fontSize={"small"} sx={{
                            ml: .5,
                            verticalAlign: 'middle'
                        }}/> options. Use these to adjust the view of the audio waveform.
                    </Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="body1" style={{...largeText, color: theme.palette.success.main}}>
                        <strong>Marking Disfluencies</strong>: When you detect the start of a disfluency, press the ’s’ key or "Mark Stutter" button. To mark its end, press the ’s’ key or "Mark Stutter" again. This action will highlight the section on the waveform in red.
                    </Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="body1" style={largeText}>
                        <strong>Multiple Disfluencies</strong>: Continue marking disfluencies as described above.                    </Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="body1" style={largeText}>
                        <strong>Fine-Tuning Stuttered Regions</strong>: Before finalizing, you can modify the edges of a red region to include more or fewer words for precise accuracy. Once confirmed, the region can only be removed, but rest assured, no words will be deleted.
                    </Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="body1" style={largeText}>
                        <strong>Event Details</strong>: Click on any highlighted region to open a popup. Here, you can detail the specifics of the disfluency event. Confirm your input by pressing the “Confirm” button. The region will turn orange. Use the red "trash can" icon if you need to remove.
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