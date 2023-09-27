import React, {useState, useContext, useEffect} from 'react';
import {Popover, TextField, styled, Stack, Divider, Button, Box} from '@mui/material';
import {Checkbox, FormControlLabel} from '@mui/material';
import {StutteredContext} from "../../context/StutteredContext";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AreYouSure from "./modals/AreYouSure";
// import styled from 'styled-components';

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
    pt: 1
}

const WordSpan = styled('span')(({ isClicked, theme }) => ({
    cursor: 'pointer',
    backgroundColor: isClicked ? 'yellow' : 'inherit',
    '&:hover': {
        backgroundColor: 'yellow !important'
    },
}));

const WordComponent = ({word, word_obj, index, style}) => {
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
    const {
        addStutteredEvent,
        setTranscriptionObj,
        setAdjustedSyllableCount,
        mode,
    } = useContext(StutteredContext);


    /* NOTES
        type: Please see stuttered context for map
     */

    // FUNCTIONS
    const handlePopoverOpen = (event) => {
        console.log(event.currentTarget);
        setAnchorEl(event.currentTarget);
        setIsClicked(true);
    };

    const handleDonePopoverClose = () => {
        // if (syllableCount === 0) {
        //     setSyllableCount(word_obj.syllable_count);
        // }
        // handleStutteredEvent();
        handleBlur();
        setAnchorEl(null);
        setIsClicked(false);
    };

    const handlePopoverClose = () => {
        handleBlur();
        setAnchorEl(null);
        setIsClicked(false);
    };

    const closePopover = () => {
        handleBlur();
        setAnchorEl(null);
        setIsClicked(false)
    };

    const handleChange = (event) => {
        setNewWord(event.target.value);
    };

    const handleSyllableChange = (event) => {
        const value = parseInt(event.target.value);
        console.log("Input value: ", event.target.value);
        console.log("Parsed value: ", value);
        if (!Number.isNaN(value)) {
            console.log("Setting syllableCount to ", value);
            setSyllableCount(value);
            setAdjustedSyllableCount(index, value);
        } else {
            console.log("Setting syllableCount to 0");
            setSyllableCount(0);
        }
    };

    const handleBlur = () => {
        // onUpdateWord(index, newWord);
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

    const handleStutteredEvent = () => {
        if (isStuttered) {
            addStutteredEvent(word_obj, typeMap[type], ps, newWord, index);
        }
    };

    const handleWordDeletion = () => {
        setTranscriptionObj(prevTranscription => {
            let newTranscription = {...prevTranscription};
            delete newTranscription[index];
            const finalTranscription = reIndexKeys(newTranscription);
            return finalTranscription;
        });
        handlePopoverClose();
    }

    const reIndexKeys = (obj) => {
        return Object.keys(obj).reduce((newObj, currentObj, index) => {
            const val = obj[currentObj];
            newObj[index+1] = val;
            return newObj;
        }, {});
    };

    useEffect(() => {
        setNewWord(word);
    }, [word]);


    return (
        <>
            <WordSpan
                onClick={(event) => {
                    if (mode !== "auto") {
                        handlePopoverOpen();
                    }

                    handlePopoverOpen(event);
                }
                }
                style={{
                    ...style,
                    backgroundColor: isClicked ? 'yellow' : style.backgroundColor,
                    ':hover': {
                        backgroundColor: 'yellow'
                    }
                }}
            >
                {newWord}
            </WordSpan>
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
                onClose={closePopover}
                transitionDuration={150}
            >

                <div onMouseLeave={closePopover}>
                    <Stack direction={"column"} sx={{pl: 1, pb: 1, pr: 1}}>
                        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                            <IconButton sx={{mb: '-1'}} onClick={closePopover}>
                                <CloseIcon/>
                            </IconButton>
                            <IconButton onClick={()=> {
                                handleWordDeletion();
                                <AreYouSure />
                            }
                            }>
                                <DeleteForeverIcon sx={{color: 'red'}}/>
                            </IconButton>
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
                            inputProps={{min: 0}}
                            sx={{mb: 1}}
                        />
                        <Button variant={"contained"} sx={{width: '40px', mb: 1}}
                                onClick={handleDonePopoverClose}>Done</Button>
                    </Stack>
                </div>
            </Popover>
        </>
    );
};

export default WordComponent;
