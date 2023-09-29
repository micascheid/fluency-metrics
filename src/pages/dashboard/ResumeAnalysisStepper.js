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
import CorrectAudioFileChecker from "./modals/CorrectAudioFileChecker";

const ResumeAnalysisStepper = ({setExpanded, expanded, ...otherProps}) => {
    const {
        user,
        workspacesIndex,
    } = useContext(UserContext);
    const {
        audioFileName,
        setAudioFileName,
        setAudioFile,
        setFileChosen,
        workspaceId,
        setWorkspaceId,
        setLoadWorkspaceByObj,
        setWorkspaceExpanded
    } = otherProps;

    const workspacesColRef = collection(db, 'users', user.uid, 'workspaces');
    const workspacesIndexRef = collection(db, 'users', user.uid, 'workspaces_index');
    const [selectedResume, setSelectedResume] = useState(workspaceId);
    const [localWorkspaceId, setLocalWorkspaceId] = useState(workspaceId);
    const [isLoadingModal, setIsLoadingModal] = useState(false);
    const [isAudioCheckerModal, setIsAudioCheckerModal] = useState(false);

    const handleResumeSelection = (event) => {
        // console.log("selectedResume:", event.target.value);
        const id = event.target.value;
        setSelectedResume(id);
        setLocalWorkspaceId(id);
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
        setIsLoadingModal(true);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        console.log(file.name);

        if (!file) {
            setFileChosen(false);
            return;
        }
        if (!isSameAudioFile(file.name)){
            console.log("YOU SURE ABOUT THAT BOSS?");
        }
        setAudioFile(file);
        setAudioFileName(file.name);
        setFileChosen(true);
    }

    const isSameAudioFile = (audio_file_name) => {
        return workspacesIndex[localWorkspaceId].audio_file_name === audio_file_name;

    }

    const handleAudioCheckerModal = () => {
        setIsAudioCheckerModal(true);
    };

    const handleAudioCheckNo = () => {
        setIsAudioCheckerModal(false);
    };

    const handleAudioCheckYes = async () => {
        setIsAudioCheckerModal(false);
        try {
            handleLoadWorkSpace();
            await handleLoadObj();
            setExpanded(false);
        } catch (error) {
            console.log("Unable to load workspace:", error);
        }
    };

    const handleLoadObj = async () => {
        const workspaceRef = doc(db, 'users', user.uid, 'workspaces', localWorkspaceId);
        try {
            const workspaceObj = await getDoc(workspaceRef);
            setLoadWorkspaceByObj(workspaceObj.data());
            setWorkspaceExpanded(true);
        } catch (error) {
            setWorkspaceExpanded(false);
            console.log("Trouble fetching workspace,", error);
        }
    };

    useEffect(() => {
        setLocalWorkspaceId(workspaceId);
    }, [localWorkspaceId]);


    return (
        <Stack spacing={2}>
            <CorrectAudioFileChecker
                audioFileName={audioFileName}
                isModalOpen={isAudioCheckerModal}
                onYes={handleAudioCheckYes}
                onNo={handleAudioCheckNo} />
            <FormControl>
                <InputLabel>None</InputLabel>
                <Select
                    sx={{minWidth: '120px'}}
                    id={"resume-label"}
                    value={localWorkspaceId}
                    onChange={handleResumeSelection}
                >
                    <MenuItem value={'None'}>
                        <em>None</em>
                    </MenuItem>
                    {workspacesIndex &&
                        [...Object.entries(workspacesIndex)]
                            .sort(([, a], [, b]) => {
                                return b.creation_time.seconds - a.creation_time.seconds;
                            })
                            .map(([id, data], index) => {
                                    const time = formatTimestamp(data.creation_time); // Convert Firestore Timestamp to JavaScript Date
                                    return (
                                        <MenuItem key={index} value={id}>
                                            <Typography><strong>Name:</strong> {data.name}, <strong>Date Created:</strong> {time}</Typography>
                                        </MenuItem>
                                    );
                                }
                            )
                    }
                </Select>
            </FormControl>
            <Box>
                <Button
                    sx={{maxWidth: 135}}
                    variant={"outlined"}
                    disabled={selectedResume === 'None'}
                    onClick={(event) => {
                        event.currentTarget.blur();
                    }}
                    component={"label"}
                >
                    Link Audio File...
                    <input
                        type={"file"}
                        hidden
                        onChange={handleFileChange}
                    />
                </Button>
                <Typography variant={"body1"}>{audioFileName}</Typography>
            </Box>

            <Button variant={"contained"} disabled={!audioFileName || selectedResume === 'None'} onClick={handleAudioCheckerModal}>
                Load Workspace
            </Button>
        </Stack>
    );
};
export default ResumeAnalysisStepper;