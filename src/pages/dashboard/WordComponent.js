import React, { useState } from 'react';

const WordComponent = ({word, onUpdateWord, index, currentWordIndex, style}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newWord, setNewWord] = useState(word);

    const handleDoubleClick = () => {
      setIsEditing(true);
    };

    const handleChange = (event) => {
        setNewWord(event.target.value);
    };

    const handleBlur = () => {
        setIsEditing(false);
        onUpdateWord(index, newWord);
    };


    return (
        isEditing ? (
            <input
                type="text"
                value={newWord}
                onChange={handleChange}
                onBlur={handleBlur}
                size={newWord.length > 0 ? newWord.length : 1}
            />
        ) : (
            <span onDoubleClick={handleDoubleClick} style={style}>
                {word}
            </span>
        )
    );
};

export default WordComponent;