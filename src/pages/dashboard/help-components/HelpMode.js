import {Box, List, ListItem, Typography} from "@mui/material";


const HelpMode = () => {
    const largeText = { fontSize: '1.2em', fontWeight: 'light' };
    return (
        <Box>
            <Typography variant="h4" style={largeText}>
                Starting a New Workspace
            </Typography>
            <List>
                <ListItem>
                    <Typography variant="body1" style={largeText}>
                       1.) Click on the "New Workspace" tab.
                    </Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="body1" style={largeText}>
                        2.) Use the "Select Mode" drop down (currently only one available)
                    </Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="body1" style={largeText}>
                        3.) Upload your speech sample using the "Upload Speech Sample" button. (Formats: m4a, mp3, wav)
                    </Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="body1" style={largeText}>
                        4.) Choose the type of speech sample (e.g., "Reading Passage, Describing Task, ...").
                    </Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="body1" style={largeText}>
                        5.) Assign a name to your workspace. Please note that due to our tool not being HIPAA-compliant, avoid using specific names or any PHI (Protected Health Information). Name it such that you can recall its purpose without identifying details. We apologize for the limitation.
                    </Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="body1" style={largeText}>
                        6.) Click "Create Workspace". Fluency Metrics will auto-generate a transcription of your speech sample. Estimated completion time can be found in the yellow workspace card below. Typically, it takes about 6 seconds per minute of speech.
                    </Typography>
                </ListItem>
            </List>

            <Typography variant="h4" style={largeText}>
                Resuming a Workspace
            </Typography>
            <List>
                <ListItem>
                    <Typography variant="body1" style={largeText}>
                        1.) Navigate to the "Resume Workspace" tab.
                    </Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="body1" style={largeText}>
                        2.) From the dropdown menu, select the workspace you'd like to continue.
                    </Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="body1" style={largeText}>
                        3.) Link the audio file associated with your chosen workspace by clicking "Link Audio File". We don't store audio files as of now.
                    </Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="body1" style={largeText}>
                        4.) Press "Load Workspace". You can then continue your work in the "Workplace" card below.
                    </Typography>
                </ListItem>
            </List>
        </Box>
    );
};

export default HelpMode;