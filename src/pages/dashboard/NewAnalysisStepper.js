import react, {useContext, useEffect, useState} from 'react';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import React from "react";
import AreYouSure from "./modals/AreYouSure";
import {UserContext} from "../../context/UserContext";
import PHIEntryChecker from "./modals/PHIEntryChecker";
import {SPEECH_SAMPLE_OPTIONS} from "../../constants";
import PulsingLoadingButton from "../../components/PulsingLoadingButton";

const NewAnalysisStepper = ({setExpanded, expanded, ...otherProps}) => {
    const {
        workspaceName,
        setWorkspaceName,
        mode,
        setMode,
        setSpeechSampleContext,
        audioFileName,
        setAudioFileName,
        setAudioFile,
        setFileChosen,
        setIsCreateNewWorkspace,
        setAudioFileDuration,
        audioFileDuration,
        loadingTranscription,
    } = otherProps;
    const {
        workspacesIndex,
    } = useContext(UserContext);
    const [localWorkspaceName, setLocalWorkspaceName] = useState('')
    const [localSpeechContext, setLocalSpeechContext] = useState('');
    const [nameError, setNameError] = useState('');
    const [showAreYouSure, setShowAreYouSure] = useState(false);
    const [yesNo, setYesNo] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleMode = (event) => {
        setMode(event.target.value);
    };

    const handlePhiYes = () => {
        setIsModalOpen(false);
    };

    const handlePhiNo = () => {
        setIsModalOpen(false);
        if (workspaceName !== '') {
            setShowAreYouSure(true); // Open the AreYouSure modal
        } else {
            setYesNo(true);
        }
    };

    const checkValidAudioFile = async (file) => {
        return new Promise((resolve, reject) => {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const reader = new FileReader();

            reader.onload = function(event) {
                const audioData = event.target.result;
                audioContext.decodeAudioData(audioData, function(buffer) {
                    resolve(true);  // Successful decoding means it's a valid audio file.
                }, function(error) {
                    reject(false);  // Failed decoding.
                });
            };

            reader.onerror = function(event) {
                reject(false);
            };

            reader.readAsArrayBuffer(file);
        });
    };


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) {
            setFileChosen(false);
            return;
        }

        const allowedFileTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/x-m4a'];
        if (!allowedFileTypes.includes(file.type)) {
            alert("Please Upload a valid audio file (MP3, WAV, M4A). For other formats email: micalinscheid@fluencymetrics.com to add additional formats");
            setFileChosen(false);
            return;
        }
        const audio = new Audio();
        const objURL = URL.createObjectURL(file);
        audio.onloadedmetadata = () => {
            setAudioFileDuration(audio.duration);
            URL.revokeObjectURL(objURL);
        }
        audio.src = objURL;
        setAudioFile(file);
        setAudioFileName(file.name);
        setFileChosen(true);
    };

    const handleWorkspaceNameChange = (event) => {
        const value = event.target.value;

        if (value.length > 50) {
            setNameError('Max length is 30 characters')
        } else if (!/^[a-zA-Z0-9-_ ]*$/.test(value)) {
            setNameError('Only letters, numbers, hypens and underscores are allowed')
        } else {
            setNameError('');
        }
        const doesExist = Object.values(workspacesIndex).some(workspace => workspace.name === value);
        if (doesExist){
            setNameError('You are already using this workspace name.');
        }

        setLocalWorkspaceName(value);
    };

    const handleKeyPress = (event) => {
        event.stopPropagation();
    }

    const handleCreateWorkspace = () => {
        setIsModalOpen(true);

    };

    const handleSpeechSampleChange = (event) => {
        setLocalSpeechContext(event.target.value);
    };

    const transcriptionTimeEstimate = () => {
        const finalDur = Math.round(audioFileDuration / 60) * 8;
        const minutes = Math.floor(finalDur / 60);
        const seconds = finalDur % 60;
        let displayTime = '';
        if (minutes > 0) {
            displayTime += `${minutes} minute${minutes === 1 ? '' : 's'} and `
        }
        displayTime += `${seconds} second${seconds === 1 ? '' : 's'}`;
        return displayTime;
    };

    const transcriptionEstimate = transcriptionTimeEstimate();


    useEffect(() => {
        (async () => {
            if (yesNo) {
                setWorkspaceName(localWorkspaceName);
                setSpeechSampleContext(localSpeechContext);
                setIsCreateNewWorkspace(true);
            }
        })();

    }, [yesNo])



    return (
        <Box>
            {showAreYouSure && <AreYouSure setAreYouSure={setShowAreYouSure} setYesNo={setYesNo}/>}
            <PHIEntryChecker isModalOpen={isModalOpen} onYes={handlePhiYes} onNo={handlePhiNo} />
            <Stack spacing={2}>
                <FormControl sx={{mt: 2, width: 200}}>
                    <InputLabel>Select Mode</InputLabel>
                    <Select
                        sx={{minWidth: 100, borderColor: '#000'}}

                        label={"Select Mode"}
                        value={mode}
                        onChange={handleMode}
                    >
                        <MenuItem value={"auto"}>Automated-Transcriptions</MenuItem>
                        {/*<MenuItem value={"manual"} disabled>Manual (Coming Soon)</MenuItem>*/}
                    </Select>
                </FormControl>
                <Box>
                    <Button sx={{width: 200}} disabled={mode === ''}
                            variant={"outlined"} fullWidth component={"label"} onClick={(event) => {
                        event.currentTarget.blur();
                    }}>
                        Choose Speech Sample
                        <input
                            type={"file"}
                            accept={".mp3, .wav, .m4a"}
                            hidden
                            onChange={handleFileChange}
                        />
                    </Button>
                    <Typography variant={"body1"}>{audioFileName}</Typography>
                    <Typography></Typography>
                </Box>
                <FormControl
                    sx={{width: 200}}
                    disabled={audioFileName === ''}
                >
                    <InputLabel
                    >Sample Context</InputLabel>
                    <Select
                        value={localSpeechContext}
                        onChange={handleSpeechSampleChange}
                    >
                        {Object.keys(SPEECH_SAMPLE_OPTIONS).map((key) => (
                            <MenuItem
                                key={key}
                                value={key}
                            >
                                {SPEECH_SAMPLE_OPTIONS[key]}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                    <TextField
                        sx={{minWidth: "350px"}}
                        value={localWorkspaceName}
                        placeholder={"Enter Workspace Name"}
                        onChange={handleWorkspaceNameChange}
                        error={!!nameError}
                        helperText={nameError || ' '}
                        onKeyPress={handleKeyPress}
                        disabled={!localSpeechContext}
                    />
                </Stack>
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>

                    <PulsingLoadingButton
                        loading={loadingTranscription}
                        variant={"contained"}
                        disabled={(!!nameError || localWorkspaceName === '')}
                        shouldPulse={true}
                        onClick={handleCreateWorkspace}
                        sx={{width: 200, flexShrink: 0 }}
                    >
                        Create Workspace
                    </PulsingLoadingButton>

                    {loadingTranscription &&
                        <Stack direction={"row"} sx={{ flexGrow: 1, alignItems: 'center' }} spacing={1}>
                            {/*<CircularProgress/>*/}
                            <Typography variant={"h5"} fontWeight={"light"}>Hang tight! Processing time is: </Typography>
                            <Typography variant={"h5"}>{transcriptionEstimate}</Typography>
                        </Stack>
                    }
                </Box>
            </Stack>
        </Box>
    )
};

export default NewAnalysisStepper;