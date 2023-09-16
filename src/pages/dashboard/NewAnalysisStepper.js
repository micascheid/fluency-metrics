import react, {useContext, useEffect, useState} from 'react';
import {Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography} from "@mui/material";
import {MANUAL} from "../../constants";
import React from "react";
import {StutteredContext} from "../../context/StutteredContext";
import saveWorkSpace from "./SaveWorkspace";
import AreYouSure from "./modals/AreYouSure";
import {UserContext} from "../../context/UserContext";
import PHIEntryChecker from "./modals/PHIEntryChecker";


const NewAnalysisStepper = (props) => {
    const {
        workspaceName,
        setWorkspaceName,
        mode,
        setMode,
        audioFileName,
        setAudioFileName,
        setAudioFile,
        setFileChosen,
        setIsCreateNewWorkspace,
    } = props;
    const {
        workspacesIndex,
        setWorkspacesIndex,
    } = useContext(UserContext);
    const [localWorkspaceName, setLocalWorkspaceName] = useState('');
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

    useEffect(() => {
        (async () => {
            if (yesNo) {
                console.log("local workspace name", localWorkspaceName);
                setWorkspaceName(localWorkspaceName);
                setIsCreateNewWorkspace(true);
            }
        })();

    }, [yesNo])


    return (
        <Box maxWidth={"150px"}>
            {showAreYouSure && <AreYouSure setAreYouSure={setShowAreYouSure} setYesNo={setYesNo}/>}
            <PHIEntryChecker isModalOpen={isModalOpen} onYes={handlePhiYes} onNo={handlePhiNo} />
            <Stack spacing={2}>
                <FormControl sx={{mt: 2}}>
                    <InputLabel>Select Mode</InputLabel>
                    <Select
                        sx={{minWidth: 100}}
                        label={"Select Mode"}
                        value={mode}
                        onChange={handleMode}
                    >
                        <MenuItem value={"auto"}>Automated-Transcriptions</MenuItem>
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
                    <TextField
                        sx={{minWidth: "350px"}}
                        value={localWorkspaceName}
                        placeholder={"Enter Workspace Name"}
                        onChange={handleWorkspaceNameChange}
                        error={!!nameError}
                        helperText={nameError || ' '}
                        onKeyPress={handleKeyPress}
                        disabled={audioFileName === ''}
                    />
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