import { React } from 'react';
import MainCard from "../../components/MainCard";
import {List, ListItem, ListItemText, Stack, Typography} from "@mui/material";



const KeyboardLegend = (props) => {
    const shortcuts = [
        { key: 's', description: 'Use to mark off stuttered syllables' },
        { key: 'n', description: 'Use to mark off non-stuttered syllables' },
        { key: 'space-bar', description: 'To start and stop the audio' },
    ];


    return (
        <MainCard>
            <List>
                <Typography variant={"h4"}>Keyboard Shortcuts</Typography>
                {shortcuts.map((shortcut, index) => (
                    <ListItem sx={{py: 0}} key={index}>
                        <ListItemText
                            primary={
                                <Typography variant="h4">{shortcut.key}</Typography>
                            }
                            secondary={
                                <Typography variant="body1" color="textSecondary">
                                    {shortcut.description}
                                </Typography>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </MainCard>

    );
};

export default KeyboardLegend;