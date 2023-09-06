import react, {useContext, useEffect, useMemo, useState} from 'react';
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography
} from "@mui/material";
import React from "react";
import {UserContext} from "../../context/UserContext";
import {collection, doc, getDoc, getDocs} from "firebase/firestore";
import {db} from "../../FirebaseConfig";
import {StutteredContext} from "../../context/StutteredContext";
import Loader from "../../components/Loader";
import LoadPreviousAudioFile from "./LoadPreviousAudioFile";

const ResumeAnalysisStepper = () => {
    const {
        user,
        workspacesIndex,
    } = useContext(UserContext);
    const {
        audioFileName,
        workspaceId,
        setWorkspaceId,
        setAudioFile,
        setAudioFileName,
        setFileChosen,
        updateStateFromObject,
    } = useContext(StutteredContext);

    const workspacesColRef = collection(db, 'users', user.uid, 'workspaces');
    const workspacesIndexRef = collection(db, 'users', user.uid, 'workspaces_index');
    const [selectedResume, setSelectedResume] = useState(workspaceId || 'None');
    const [localWorkspaceId, setLocalWorkspaceId] = useState();
    const [isLoadingModal, setIsLoadingModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [workspaceObj, setWorkspaceObj] = useState({});
    // console.log("workspaceID", workspaceId);

    const handleResumeSelection = (event) => {
        // console.log("selectedResume:", event.target.value);
        const id = event.target.value;
        setSelectedResume(id);
        setWorkspaceId(id);

    };

    const formatTimestamp = (timestamp) => {
        const date = timestamp.toDate();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');

        const amOrPm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours || 12;
        hours = String(hours).padStart(2, '0');
        return `${month}/${day}/${year} ${hours}:${minutes} ${amOrPm}`;
    };

    const handleLoadWorkSpace = () => {
        //load in workspace dock from db

        setIsLoadingModal(true);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        console.log(file.name);

        if (!file) {
            setFileChosen(false);
            return;
        }
        setAudioFile(file);
        setAudioFileName(file.name);
        setFileChosen(true);
    }

    const handleLoadObj = async () => {
        const workspaceRef = doc(db, 'users', user.uid, 'workspaces', workspaceId);
        try {
            const workspaceObj = await getDoc(workspaceRef);
            updateStateFromObject(workspaceObj.data());
        } catch (error) {
            console.log("Trouble fetching workspace,", error);
        }
    };

    return (
        <Stack spacing={2}>
            <FormControl>
                <InputLabel>None</InputLabel>
                <Select
                    sx={{minWidth: '120px'}}
                    id={"resume-label"}
                    value={selectedResume}
                    onChange={handleResumeSelection}
                >
                    <MenuItem value={'None'}>
                        <em>None</em>
                    </MenuItem>
                    {workspacesIndex &&
                        Object.entries(workspacesIndex).map(([id, data], index) => {
                                const time = formatTimestamp(data.creation_time);
                                return (
                                    <MenuItem key={index} value={id}>
                                        <Typography><strong>Name:</strong> {data.name}, <strong>Date
                                            Created:</strong> {time} </Typography>
                                    </MenuItem>
                                )
                            }
                        )
                    }
                </Select>
                {/*{isLoadingModal &&*/}
                {/*    <LoadPreviousAudioFile*/}
                {/*        open={isLoadingModal}*/}
                {/*        setIsLoadingModal={setIsLoadingModal}*/}
                {/*        workspaceId={workspaceId}*/}
                {/*        handleFile={handleFile}*/}
                {/*    />}*/}
            </FormControl>
            <Box>
                <Button
                    sx={{maxWidth: 135}}
                    variant={"contained"}
                    disabled={selectedResume === 'None'}
                    onClick={(event) => {
                        event.currentTarget.blur();
                    }}
                    component={"label"}
                >
                    Link AudioFile...
                    <input
                        type={"file"}
                        hidden
                        onChange={handleFileChange}
                    />
                </Button>
                <Typography variant={"body1"}>{audioFileName}</Typography>
            </Box>

            <Button variant={"contained"} disabled={!audioFileName} onClick={handleLoadObj}>
                Load Workspace
            </Button>
        </Stack>
    );
};
export default ResumeAnalysisStepper;