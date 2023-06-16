import React, {useState, useRef, useContext} from 'react';
import {Popover, TextField, styled, Stack, Divider, Typography, Button, Box} from '@mui/material';
import {Checkbox, FormControlLabel} from '@mui/material';
import {StutteredContext} from "../../context/StutteredContext";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const CustomWordInput = styled(TextField)(({theme}) => ({
    ...theme.typography.h5,
    '& input': {
        textAlign: 'center',
    },
}));

const CustomSyllableInput = styled(TextField)(({theme}) => ({
    ...theme.typography.body1,
    width: '55px',
    '& input': {
        textAlign: 'center',
    },
}));

const dividerStyles = {
    "&::before, &::after": {
        borderColor: "lightgray",
    },
    pt: 2,
}

const WordComponent = ({word, word_obj, onUpdateWord, index, style}) => {
    // VARIABLES
    const [anchorEl, setAnchorEl] = useState(null);
    const [newWord, setNewWord] = useState(word);
    const [isStuttered, setIsStuttered] = useState(false);
    const [type, setType] = useState(null);
    const [ps, setps] = useState(null);
    const [syllableCount, setSyllableCount] = useState(parseInt(word_obj.syllable_count));
    const typeMap = {0: "Repetition", 1: "Prolongation", 2: "Block", 3: "Interjection"};
    const psList = [0, 1, 2, 3, 4, 5];
    const [isClicked, setIsClicked] = useState(false);
    const {addStutteredEvent, removeStutteredEvent, setAdjustedSyllableCount} = useContext(StutteredContext);


    /* NOTES
        type: Please see stuttered context for map
     */

    // FUNCTIONS
    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
        setIsClicked(true);
    };

    const handlePopoverClose = (event) => {
        if (syllableCount === 0) {
            setSyllableCount(word_obj.syllable_count);
        }
        handleBlur();
        setAnchorEl(null);
        setIsClicked(false);
    };

    const handleChange = (event) => {
        setNewWord(event.target.value);
    };

    const handleSyllableChange = (event) => {
        const value = parseInt(event.target.value);
        const isValid = Number.isInteger(Number(value));
        if (isValid) {
            setSyllableCount(value);
            setAdjustedSyllableCount(index, value);
        } else {
            setSyllableCount(0);
        }
    };

    const handleBlur = () => {
        onUpdateWord(index, newWord);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleBlur();
        }
    };

    const handleKeyPress = (event) => {
        event.stopPropagation();
    };

    const handleStutteredChangeLocal = (event) => {
        const checked = event.target.checked;

        if (checked) {
            addStutteredEvent(word_obj, typeMap[type], ps, newWord, index);
        } else {
            removeStutteredEvent(index);
        }
        setIsStuttered(checked);
    };

    return (
        <>
            <span
                onClick={handlePopoverOpen}
                style={{
                    ...style,
                backgroundColor: isClicked ? 'yellow' : 'transparent'}}
            >
                {word}
            </span>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                onClose={handlePopoverClose}
                transitionDuration={0}
            >
                <div onMouseLeave={handlePopoverClose}>
                    <Stack direction={"column"} sx={{padding: 1}}>
                        <Box display={"flex"} justifyContent={"right"}>
                            <IconButton onClick={handlePopoverClose}>
                                <CloseIcon/>
                            </IconButton>
                        </Box>
                        <Divider textAlign={"left"} sx={dividerStyles}>Stuttered Event</Divider>
                        <Box sx={{ display: 'flex', alignItems: "center", justifyContent: "left"}}>
                            <Checkbox
                                checked={isStuttered}
                                onChange={handleStutteredChangeLocal}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </Box>
                        <Divider textAlign={"left"} sx={dividerStyles}>Text</Divider>
                        <CustomWordInput
                            value={newWord}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            onKeyPress={handleKeyPress}
                            sx={{mb: 1}}
                        />
                        <Divider textAlign={"left"} sx={dividerStyles}>Syllables</Divider>
                        <CustomSyllableInput
                            type={"number"}
                            value={syllableCount}
                            onChange={handleSyllableChange}
                        />

                        <Divider textAlign={"left"} sx={dividerStyles}>Type</Divider>
                        <Stack direction={"row"}>
                            {Object.keys(typeMap).map((key, ind) => (
                                <FormControlLabel
                                    key={ind}
                                    control={
                                        <Checkbox
                                            checked={key === type}
                                            onChange={() => setType(key)}
                                        />}
                                    label={typeMap[key]}
                                />
                            ))}
                        </Stack>
                        <Divider textAlign={"left"} sx={dividerStyles}>Physical Concomitants</Divider>
                        <Stack direction={"row"}>
                            {Object.keys(psList).map((ind) => (
                                <FormControlLabel
                                    key={ind}
                                    control={
                                        <Checkbox
                                            checked={ind === ps}
                                            onChange={() => setps(ind)}
                                        />}
                                    label={ind}
                                />
                            ))}
                        </Stack>
                        <Button variant={"contained"} sx={{width: '40px', mb: 1}}
                                onClick={handlePopoverClose}>Done</Button>
                    </Stack>
                </div>
            </Popover>
        </>
    );
};

export default WordComponent;
