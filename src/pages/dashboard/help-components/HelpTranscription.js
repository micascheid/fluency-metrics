import {Box, List, ListItem, Typography} from "@mui/material";
import {headerBoxStyle, headerBoxStylel, howToStyle, HowToStyle, titleStyle} from "./HelpStyles";

const HelpTranscription = () => {
    const largeText = { fontSize: '1.4em', fontWeight: 'light' };

    return (
        <Box>
            <Typography variant="body1" gutterBottom style={largeText}>The transcription area allows you to refine and adjust the automated transcription. Here's how:</Typography>
            <List>
                <ListItem>
                    <Typography variant="body1" style={largeText} component="div">
                        <strong>Modifying a Word</strong>:
                        <ul>
                            <li><strong>Delete</strong>: Click on a word to reveal a popup with a red trashcan icon in the top right. Clicking the trashcan will remove the word.</li>
                            <li><strong>Edit</strong>: After clicking a word, modify its text in the provided field. Adjust syllables as needed and click "Done" to finalize changes.</li>
                        </ul>
                    </Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="body1" style={largeText} component="div">
                        <strong>Adding Text or Annotation</strong>:
                        <ul>
                            <li>Position your cursor between two words. A white plus sign will appear. Click it.</li>
                            <li>Enter the desired text or annotation and specify syllables if needed. Click "Done" to insert the new word.</li>
                        </ul>
                    </Typography>
                </ListItem>
            </List>
        </Box>
    );
};

export default HelpTranscription;