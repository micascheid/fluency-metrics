import react, {useContext, useState} from 'react';
import {Box, Button, Divider, Popover, Stack, styled, TextField, Typography} from "@mui/material";
import {dividerStyles, CustomSyllableInput, CustomWordInput} from "../../../components/PopoverStyling";
import {isDisabled} from "@testing-library/user-event/dist/utils";
import {StutteredContext} from "../../../context/StutteredContext";

const AddTextPopover = ({leftId, rightId, setAnchorEl, anchorEl,}) => {
    const {
        transcriptionObj,
        setTranscriptionObj,
    } = useContext(StutteredContext);
    const [addedText, setAddedText] = useState('');
    const [syllables, setSyllables] = useState(0);
    const isButtonDisabled = !addedText.trim();
    const handleClose = (event) => {
        event.stopPropagation();
        setAnchorEl(null);

        // Call an update function here
    }

    const handleDone = (event) => {
      event.stopPropagation();
      addNewWord();
      setAnchorEl(null);
    };

    const addNewWord = () => {
        // TODO | MAKE A TRANSCRIPTION WORD OBJECT TO USE
        const updatedTranscription = {};
        const start = transcriptionObj[leftId].end + 0.01;
        const end = transcriptionObj[rightId].start - 0.01;
        const confidence = 1;
        const punctuated_word = addedText;
        const syllable_count = syllables;
        const add_obj = {
            punctuated_word: addedText,
            confidence: confidence,
            start: start,
            end: end,
            syllable_count: syllable_count,
            word: addedText,
            stuttered: false,
        }

        //Iterate through
        setTranscriptionObj((prevTranscription) => {
           Object.keys(prevTranscription).forEach((tKey) => {
               const currentKey = parseInt(tKey, 10);
              if (currentKey < rightId) {
                  updatedTranscription[currentKey] = prevTranscription[currentKey]
              } else {
                  updatedTranscription[currentKey + 1] = prevTranscription[currentKey];
              }

           });
           updatedTranscription[rightId] = add_obj;
           return updatedTranscription;
        });

    };



    return (
        <Popover
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorEl={anchorEl}
        >
            <Box sx={{display: 'flex', alignItems: 'center', padding: 1}}>
                <Stack>
                    <Divider sx={dividerStyles}>Text or Annotate</Divider>
                    <CustomWordInput
                        value={addedText}
                        onChange={(event) => {
                            event.stopPropagation();
                            setAddedText(event.target.value)
                        }}
                        onKeyPress={(event) => {
                            event.stopPropagation();
                        }}
                    />
                    <Divider sx={dividerStyles}>Syllables</Divider>
                    <CustomSyllableInput
                        type={"number"}
                        value={syllables}
                        onChange={(event) => setSyllables(parseInt(event.target.value))}
                    />
                    <Button disabled={isButtonDisabled} variant={"contained"} onClick={handleDone}>
                        Done
                    </Button>
                </Stack>

            </Box>

        </Popover>
    );
};

export default AddTextPopover;