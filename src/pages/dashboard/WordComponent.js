import React, {useState, useRef} from 'react';
import {Popover, TextField, styled, useTheme, Box} from '@mui/material';
import {KeyboardArrowUp} from "@mui/icons-material";


const CustomInput = styled(TextField)(({theme}) => ({
    ...theme.typography.h5,
    '& input': {
        textAlign: 'center'
    },
}));

const WordComponent = ({word, onUpdateWord, index, style}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [newWord, setNewWord] = useState(word);

    const wordRef = useRef();

    const handleDoubleClick = (event) => {
        setIsEditing(true);
        setAnchorEl(wordRef.current);
    };

    const handleChange = (event) => {
        setNewWord(event.target.value);
    };

    const handleBlur = () => {
        setIsEditing(false);
        onUpdateWord(index, newWord);
    };

    const handleClose = () => {
        setIsEditing(false);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleBlur();
        }
    }

    const handleKeyPress = (event) => {
        event.stopPropagation();
    }

    const open = Boolean(anchorEl);

    return (
        <>
            <span
                ref={wordRef}
                onDoubleClick={handleDoubleClick}
                style={style}
            >
              {word}
            </span>
            <Popover
                open={isEditing}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <CustomInput
                    autoFocus
                    value={newWord}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    onKeyPress={handleKeyPress}
                />
            </Popover>
        </>
    );
};

export default WordComponent;
