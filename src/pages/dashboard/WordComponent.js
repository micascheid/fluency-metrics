import React, { useState, useRef, useContext } from 'react';
import { Popover, TextField, styled, Stack } from '@mui/material';
import { Checkbox, FormControlLabel } from '@mui/material';
import { StutteredContext } from "../../context/StutteredContext";

const CustomWordInput = styled(TextField)(({ theme }) => ({
    ...theme.typography.h5,
    '& input': {
        textAlign: 'center',
    },
}));

const CustomSyllableInput = styled(TextField)(({ theme }) => ({
    ...theme.typography.body1,
    width: '55px',
    '& input': {
        textAlign: 'center',
    },
}));

const WordComponent = ({ word, word_obj, onUpdateWord, index, style }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [newWord, setNewWord] = useState(word);
    const [isStuttered, setIsStuttered] = useState(false);
    const { addStutteredEvent, removeStutteredEvent, setAdjustedSyllableCount } = useContext(StutteredContext);
    const [syllableCount, setSyllableCount] = useState(parseInt(word_obj.syllable_count));
    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        if (syllableCount === 0) {
            setSyllableCount(word_obj.syllable_count);
        }
        setAnchorEl(null);
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
    }

    const handleStutteredChangeLocal = (event) => {
        const checked = event.target.checked;

        if (checked) {
            addStutteredEvent(word_obj, null, null, newWord, index);
        } else {
            removeStutteredEvent(index);
        }
        setIsStuttered(checked);
    };

    return (
        <>
            <span
                onClick={handlePopoverOpen}
                style={style}
            >
                {word}
            </span>
            <Popover
                // style={{pointerEvents: 'none'}}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                // style={{pointerEvents: 'none'}}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                onClose={handlePopoverClose}

            >
                <div onMouseLeave={handlePopoverClose}>
                    <Stack direction={"column"} sx={{ padding: 1 }}>
                        <CustomWordInput
                            autoFocus
                            value={newWord}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                        />
                        <CustomSyllableInput
                            type={"number"}
                            value={syllableCount}
                            onChange={handleSyllableChange}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isStuttered}
                                    onChange={handleStutteredChangeLocal}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            }
                            label={"Stuttered"}
                        />
                    </Stack>
                </div>
            </Popover>
        </>
    );
};

export default WordComponent;
