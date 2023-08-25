import {Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, Stack, Typography} from "@mui/material";
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
    const [tempVal, setTempVal] = useState(null);
    const [path, setPath] = useState(null);
    const [startNew, setStartNew] = useState(false);
    const [selectedResume, setSelectedResume] = useState('None');
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

    const get_transcription = async () => {
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


    const handleStartNew = () => {
        setStartNew(true);
        setSelectedResume(null);
    };

    const handleResumeSelection = (event) => {
        setSelectedResume(event.target.value);
        setStartNew(false);
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
                <Grid item xs={6} sm={6} md={6} lg={6}>
                    <Box sx={{display: 'flex'}} gap={2} width={"100%"}>
                        <Stack>
                            <Button variant={"contained"} disabled={selectedResume !== 'None'} onClick={handleStartNew}>
                                Start New
                            </Button>
                            <FormControl sx={{mt: 2}} disabled={!startNew || selectedResume}>
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
                            <Button sx={{mt: 2}} disabled={mode === '' || !startNew || selectedResume}
                                    variant={"contained"} component={"label"} onClick={(event) => {
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
                                    disabled={!startNew || selectedResume || audioFile === null || mode === MANUAL}>
                                Get Transcript
                            </Button>
                        </Stack>
                        <Typography>Or</Typography>
                        <Stack>
                            <FormControl >
                                <InputLabel>Resume</InputLabel>
                                <Select
                                    sx={{minWidth: '120px'}}
                                    id={"resume-label"}
                                    value={selectedResume}
                                    onChange={handleResumeSelection}
                                >
                                    <MenuItem value={'None'}>
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={20}>20</MenuItem>
                                    <MenuItem value={30}>30</MenuItem>
                                </Select>
                                <Button sx={{mt: 2}} variant={"contained"} disabled={startNew || selectedResume === 'None'}>
                                    Load
                                </Button>
                            </FormControl>
                        </Stack>
                    </Box>
                </Grid>
                <Grid item xs={3} sm={3} md={3} lg={3}>
                    <Typography>{autoModeText}</Typography>
                </Grid>
                <Grid item xs={3} sm={3} md={3} lg={3}>
                    <Typography>{manualModeText}</Typography>
                </Grid>
            </Grid>
        </MainCard>

    );
};

export default Mode;