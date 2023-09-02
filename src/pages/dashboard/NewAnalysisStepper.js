import react, {useContext, useState} from 'react';
import {Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography} from "@mui/material";
import {MANUAL} from "../../constants";
import React from "react";
import {StutteredContext} from "../../context/StutteredContext";
import saveWorkSpace from "./SaveWorkSpace";


const NewAnalysisStepper = () => {
    const {
        get_transcription,
        mode,
        setMode,
        setFileChosen,
        setAudioFile,
        setAudioFileName,
        audioFileName,
        saveWorkspace,
    } = useContext(StutteredContext);
    const [localWorkspaceName, setLocalWorkspaceName] = useState('');
    const [nameError, setNameError] = useState('');

    const handleMode = (event) => {
        setMode(event.target.value);
    }

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

    const handleWorkspaceNameChange = (event) => {
        const value = event.target.value;

        if (value.length > 30) {
            setNameError('Max length is 30 characters')
        } else if (!/^[a-zA-Z0-9-_ ]*$/.test(value)) {
            setNameError('Only letters, numbers, hypens and underscores are allowed')
        } else {
            setNameError('');
        }
        setLocalWorkspaceName(value);
    };

    const handleKeyPress = (event) => {
        event.stopPropagation();
    }

    const handleCreateWorkspace = async () => {
        //get the transcription
        console.log("ABOUT TO CREATE WORKSPACE");
        get_transcription().then(() => {
            //then can save off workspace
            console.log("TRANSCRIPTION COMPLETE")
            saveWorkspace(localWorkspaceName).catch(error => {
                console.log("couldn't save workspace: ", error);
            })
        }).catch(error => {
            console.log("unable to get transcription:", error)
        })

    };

    return (
        <Box maxWidth={"150px"}>
            <Stack spacing={2}>
                <FormControl sx={{mt: 2}}>
                    <InputLabel>Mode</InputLabel>
                    <Select
                        sx={{minWidth: 100}}
                        label={"Mode"}
                        value={mode}
                        onChange={handleMode}
                    >
                        <MenuItem value={"auto"}>Semi-Auto</MenuItem>
                        <MenuItem value={"manual"} disabled>Manual (Coming Soon)</MenuItem>
                    </Select>
                </FormControl>
                <Box>
                    <Button disabled={mode === ''}
                            variant={"contained"} fullWidth component={"label"} onClick={(event) => {
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
                </Box>

                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                    {/*<Typography variant={"h4"}>Workspace Name: </Typography>*/}
                    <TextField
                        sx={{minWidth: "350px"}}
                        value={localWorkspaceName}
                        placeholder={"Enter Workspace Name"}
                        onChange={handleWorkspaceNameChange}
                        error={!!nameError}
                        helperText={nameError || ' '}
                        onKeyPress={handleKeyPress}
                    ></TextField>
                </Stack>
                <Button
                    variant={"contained"}
                    disabled={!!nameError || localWorkspaceName === ''}
                    onClick={handleCreateWorkspace}
                >Create Workspace</Button>
            </Stack>
        </Box>
    )
};

export default NewAnalysisStepper;