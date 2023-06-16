import {Fragment, React, useContext, useRef, useState} from "react";
import {Box, Button, Stack, TextField, Typography} from "@mui/material";
import axios from 'axios';
import {BASE_URL} from "../../constants";
import WordComponent from "./WordComponent";
import {StutteredContext} from "../../context/StutteredContext";


const TranscriptionManual = () => {
    // VARIABLES
    const [editing, setEditing] = useState(true);
    const textFieldRef = useRef();
    const {
        transcriptionObj,
        setTranscriptionObj,
        handleWordUpdate,
        currentWordIndex} = useContext(StutteredContext);

    //FUNCTIONS
    const handleKeyPress = (event) => {
        event.stopPropagation();
    };

    const manualTranscriptionHandler = () => {
        setEditing(prevState => !prevState);

        if (editing) {
            const data = {"data" : textFieldRef.current.value};
            axios.post(`${BASE_URL}/manual_transcription`, data).then((response) => {
                console.log("RESPONSE TRANSCRIPTION OBJ", response.data.transcription_obj);
                setTranscriptionObj(response.data.transcription_obj);
            }).catch((error) => {
                console.log("Error handling manual_transcription: ", error);
            });
        }
    };

    return (
        <Stack spacing={1}>
            {editing ? (
                    <TextField
                        inputRef={textFieldRef}
                        onKeyPress={handleKeyPress}
                        disabled={!editing}
                        label={"Manual Transcription"}
                        variant={"outlined"}
                        multiline
                        fullWidth
                        rows={5}
                        sx={{
                            '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: '#000000' },
                            '& .MuiInputBase-root': {fontSize: '18px'},
                            '& .MuiFormLabel-root': {fontSize: '20px'},
                        }}
                    />
            ) : (
                <Typography variant={"h4"}>
                    {transcriptionObj && Object.keys(transcriptionObj).map((key) => (
                        <Fragment key={key}>
                            <WordComponent
                                word={transcriptionObj[key].text}
                                word_obj={transcriptionObj[key]}
                                onUpdateWord={handleWordUpdate}
                                index={key}
                                style={{backgroundColor: currentWordIndex === key ? '#ADD8E6' : 'transparent'}}>
                            </WordComponent>{" "}
                        </Fragment>
                    ))}
                </Typography>
            )}
            <Button
                onClick={manualTranscriptionHandler}
                variant={"contained"}
                sx={{width: 100}}
            >
                {editing ? (
                    "Done"
                ) : (
                    "Edit"
                )
                }
            </Button>
        </Stack>
    );
};

export default TranscriptionManual;