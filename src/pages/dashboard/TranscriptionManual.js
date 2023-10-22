import {Fragment, React, useContext, useEffect, useRef, useState} from "react";
import {Box, Button, Stack, TextField, Typography} from "@mui/material";
import axios from 'axios';
import {BASE_URL} from "../../constants";
import WordComponent from "./WordComponent";
import {StutteredContext} from "../../context/StutteredContext";
import ErrorBox from "./ErrorBox";


const TranscriptionManual = () => {
    // VARIABLES
    const [editing, setEditing] = useState(true);
    const [textFieldValue, setTextFieldValue] = useState('');
    const textFieldRef = useRef();
    const {
        transcriptionObj,
        setTranscriptionObj,
        handleWordUpdate,
        currentWordIndex,
        fileChosen,
        audioPlayerControl,
        setPlayBackSpeed
    } = useContext(StutteredContext);

    //FUNCTIONS
    const handleKeyPress = (event) => {
        event.stopPropagation();

        if (event.shiftKey && event.key === " ") {
            event.preventDefault();
            if (audioPlayerControl) {
                audioPlayerControl.playPause();
            }
        }

        if (event.key.match(/[0-9]/)) {
            event.preventDefault();
            if (event.key === "0"){
                setPlayBackSpeed(1);
            } else {
                setPlayBackSpeed(Number(event.key)/10);
                console.log(Number(event.key)/10);
            }
        }

    };

    const manualTranscriptionHandler = () => {
        setEditing(prevState => !prevState);

        if (editing) {
            const data = {"data" : textFieldRef.current.value};
            axios.post(`${BASE_URL}/manual_transcription`, data).then((response) => {
                setTranscriptionObj(response.data.transcription_obj);
            }).catch((error) => {
                console.log("ProfileError handling manual_transcription: ", error);
            });
        }
    };

    const handleTextFieldInitValue = () => {
        let build_string = "";
        Object.keys(transcriptionObj).forEach((key, index) => {
            if (index === 0) {
                build_string = transcriptionObj[key].text;
            } else {
                build_string = build_string + " " + transcriptionObj[key].text;
            }
        });
        setTextFieldValue(build_string);
    };

    useEffect(() => {
        if (transcriptionObj) {
            handleTextFieldInitValue();
        }
    }, [editing, transcriptionObj]);

    return (
        <Stack spacing={1}>
            {!fileChosen &&
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Typography variant={"h4"}>
                        Choose an audio file to get started
                    </Typography>
                </Box>
            }
            {editing && fileChosen? (
                    <TextField
                        inputRef={textFieldRef}
                        onKeyPress={handleKeyPress}
                        disabled={!editing}
                        label={"Manual Transcription"}
                        variant={"outlined"}
                        multiline
                        fullWidth
                        minRows={3}
                        maxRows={15}
                        defaultValue={textFieldValue}
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
                                word={transcriptionObj[key].punctuated_word}
                                word_obj={transcriptionObj[key]}
                                onUpdateWord={handleWordUpdate}
                                index={key}
                                style={{backgroundColor: currentWordIndex === key ? '#ADD8E6' : 'transparent'}}>
                            </WordComponent>{" "}
                        </Fragment>
                    ))}
                </Typography>
            )}
            {fileChosen &&
                <Button
                    onClick={(event) => {
                        manualTranscriptionHandler();
                        event.currentTarget.blur();
                    }
                    }
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
            }
        </Stack>
    );
};

export default TranscriptionManual;