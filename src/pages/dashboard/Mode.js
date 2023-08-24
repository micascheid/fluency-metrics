import {Button, FormControl, Grid, InputLabel, MenuItem, Select, Stack, Typography} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import MainCard from "../../components/MainCard";
import {StutteredContext} from "../../context/StutteredContext";
import {BASE_URL, MANUAL} from "../../constants";
import axios from "axios";
import AreYouSure from "./popovers/AreYouSure";


const Mode = () => {
    const {mode, setMode, setFileChosen, setAudioFile, setAudioFileName, audioFileName} = useContext(StutteredContext);
    const autoModeText = "Some text about auto mode";
    const manualModeText = "Some text about manual mode";
    const [showAreYouSure, setShowAreYouSure] = useState(false);
    const [yesNo, setYesNo] = useState(false);
    const {
        setLoadingTranscription,
        audioFile,
        transcriptionObj,
        setTranscriptionObj,
        countTotalSyllables,
    } = useContext(StutteredContext);
    const handleMode = (event) => {
        setMode(event.target.value);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) {
            setFileChosen(false);
            return;
        }
        setAudioFile(file);
        setAudioFileName(file.name);
        setFileChosen(true);
    };

    const get_transcription = async() => {
        console.log("GETTING CALLED?")
        setLoadingTranscription(true);
        const formData = new FormData();
        console.log(audioFile.name);
        formData.append('file', audioFile);
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        await delay(1500);
        axios.post(`${BASE_URL}/get_transcription2`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(response => {
            const transcriptionObj = response.data.transcription_obj;
            setTranscriptionObj(transcriptionObj);
            countTotalSyllables();
            setLoadingTranscription(false);
            setYesNo(false);

        }).catch(error => {
            console.log("ERROR handling get_transcription:", error);
            setLoadingTranscription(false);
            setYesNo(false);
        });
    };

    useEffect(() => {
        if (yesNo) {
            get_transcription();
        }
    }, [yesNo])

    return (
        <MainCard>
            {showAreYouSure && <AreYouSure setAreYouSure={setShowAreYouSure} setYesNo={setYesNo}/>}
            <Grid container spacing={2}>
                <Grid item xs={2} sm={2} md={2} lg={2}>
                    <Stack style={{maxWidth: "120px"}} >
                        <FormControl>
                            <InputLabel>Mode</InputLabel>
                            <Select
                                sx={{minWidth: 100}}
                                label={"Mode"}
                                value={mode}
                                onChange={handleMode}
                            >
                                <MenuItem value={"manual"}>Manual</MenuItem>
                                <MenuItem value={"auto"}>Semi-Auto</MenuItem>
                            </Select>
                        </FormControl>
                        <Button sx={{mt: 2}} disabled={mode === ''} variant={"contained"} component={"label"} onClick={(event) => {
                            event.currentTarget.blur();
                        }}>
                            Choose File
                            <input
                                type={"file"}
                                hidden
                                onChange={handleFileChange}
                            />
                        </Button>
                        <Typography variant={"body1"}>{audioFileName}</Typography>
                        <Button sx={{mt: 2}} variant={"contained"}
                                onClick={(event) => {
                                    if (transcriptionObj) {
                                        setShowAreYouSure(true);
                                    } else if (transcriptionObj && !yesNo) {
                                        get_transcription();
                                        event.currentTarget.blur();
                                    } else {
                                        get_transcription();
                                        event.currentTarget.blur();
                                    }
                                }}
                                disabled={audioFile === null || mode === MANUAL}>
                            Get Transcript
                        </Button>
                    </Stack>
                </Grid>
                <Grid item xs={5} sm={5} md={5} lg={5}>
                    <Typography>{autoModeText}</Typography>
                </Grid>
                <Grid item xs={5} sm={5} md={5} lg={5}>
                    <Typography>{manualModeText}</Typography>
                </Grid>
            </Grid>
        </MainCard>

    );
};

export default Mode;