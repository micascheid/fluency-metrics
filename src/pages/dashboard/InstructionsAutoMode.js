import react from 'react';
import {Box, Divider, List, ListItem, Stack, Typography} from "@mui/material";

const InstructionsAutoMode = () => {

    return (
        <Box>
            {/* Title for Getting Started with Auto Mode */}
            <Typography variant="h5">
                Creating your First Analysis (auto-mode):
            </Typography>

            <List>
                {/* Upload Audio */}
                <Stack direction={"row"} spacing={1}>
                    <Typography variant="subtitle1" gutterBottom>
                        Upload Audio:
                    </Typography>
                    <Typography>
                        Use the 'New Analysis' tab and provide an audio speech sample using the 'Choose File' option.
                    </Typography>
                </Stack>

                {/* Workspace Name */}
                <Stack direction={"row"} spacing={1}>
                    <Typography gutterBottom>
                        <strong>Workspace Name:</strong> Give your analysis a name.
                    </Typography>

                </Stack>
                <ListItem>
                    <Typography variant="body2" sx={{color: 'red'}}>
                        Note: Ensure the name doesn't contain any PHI (Personal Health Information). The tool currently
                        is not HIPAA compliant.
                    </Typography>
                </ListItem>

                {/* Create Workspace */}
                <Typography gutterBottom>
                    <strong>Create Workspace:</strong> Click 'Create Workspace' and Fluency Metrics will create a
                    workspace and automated transcription
                    for you to work from
                </Typography>
            </List>

            {/* Divider between sections */
            }
            <Divider style={{borderColor: "#000"}}/>

            {/* Title for Using the Tool */
            }
            <Typography variant={"h5"}>
                Using the Tool:
            </Typography>
            <List>
                {/* Audio Controls */}
                <Typography variant="subtitle1">
                    Audio Controls:
                </Typography>
                <ListItem>
                    <Stack>
                        <Typography>
                            <strong>Left Slider:</strong> Controls audio playback speed.
                        </Typography>
                        <Typography>
                            <strong>Right Slider:</strong> Adjusts zoom on the waveform.
                        </Typography>
                    </Stack>
                </ListItem>

                {/* Editing Words */}

                <Typography gutterBottom>
                    <strong>Editing Words:</strong> Click on a word to modify or delete it.
                </Typography>

                {/* Playback */}
                <Typography variant="subtitle1">
                    Marking Stuttered Events at Playback:
                </Typography>
                <ListItem>
                    <Stack>
                        <Typography>
                            <strong>Space Bar:</strong> Use to toggle between play and pause.
                        </Typography>
                        <Typography>
                            <strong>'s' Key:</strong> Press during playback to mark the start and end of a stuttered
                            event. A shaded region will display on the waveform.
                        </Typography>
                    </Stack>
                </ListItem>
                <Typography>
                    <strong>Once Stuttered Events are Marked:</strong>
                </Typography>
                <ListItem>
                    <Stack>
                        <Typography>- Click on a shaded region to review and make any necessary edits.</Typography>
                        <Typography>
                            - Confirm your edits by selecting "Done". The region will then turn orange. Edits can still be
                            made afterwards.
                        </Typography>
                        <Typography>
                           - The "Fluency Metrics" card updates in real-time with each confirmed stuttered region.
                        </Typography>
                    </Stack>
                </ListItem>
            </List>
        </Box>
    )
};

export default InstructionsAutoMode;