import react, {useContext, useEffect, useState} from 'react';
import {Button, FormControl, InputLabel, MenuItem, Select, Stack, Typography} from "@mui/material";
import React from "react";
import UserContext from "../../context/UserContext";
import {collection, doc, getDoc, getDocs} from "firebase/firestore";
import {db} from "../../FirebaseConfig";
import {StutteredContext} from "../../context/StutteredContext";
import Loader from "../../components/Loader";
import LoadPreviousAudioFile from "./LoadPreviousAudioFile";

const ResumeAnalysisStepper = () => {
    const { user } = useContext(UserContext);
    const {
        updateStateFromObject,
    } = useContext(StutteredContext);
    const workspacesColRef = collection(db, 'users', user.uid, 'workspaces');
    const workspacesIndexRef = collection(db, 'users', user.uid, 'workspaces_index');
    const [selectedResume, setSelectedResume] = useState('None');
    const [workspacesIndex, setWorkspacesIndex] = useState();
    const [workspaceId, setWorkspaceId] = useState();
    const [isLoadingModal, setIsLoadingModal] = useState(false);
    const handleResumeSelection = (event) => {
        console.log()
        setSelectedResume(event.target.value);

    };

    const formatTimestamp =(timestamp) => {
      const date = timestamp.toDate();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');

      const amOrPm = hours >=12 ? 'PM' : 'AM';

      hours = hours % 12;
      hours = hours || 12;
      hours = String(hours).padStart(2, '0');
      return `${month}/${day}/${year} ${hours}:${minutes} ${amOrPm}`;
    };

    const handleLoadWorkSpace = () => {
        //load in workspace dock from db
        console.log("Workspace ID:", workspaceId);
        // const docRef = doc(workspacesColRef, workspaceId);
        // getDoc(docRef).then((doc) => {
        //     console.log("Data: ", doc.data());
        //     updateStateFromObject(doc.data());
        // })

        setIsLoadingModal(true);
    };

    useEffect(() => {
        getDocs(workspacesIndexRef).then((docs) => {
            const docsObject = {};
            docs.forEach((doc) => {
                docsObject[doc.id] = doc.data();
            });
            setWorkspacesIndex(docsObject);
        });
    },[]);

    return (
        <Stack>
            <FormControl>
                <InputLabel>Resume...</InputLabel>
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
                                    <MenuItem key={index} value={id} onClick={()=>setWorkspaceId(id)}>
                                        <Typography><strong>Name:</strong> {data.name}, <strong>Date Created:</strong> {time} </Typography>
                                    </MenuItem>
                                )
                            }
                        )
                    }
                </Select>
                <LoadPreviousAudioFile open={isLoadingModal} setIsLoadingModal={setIsLoadingModal}/>
                <Button
                    sx={{mt: 2, maxWidth: 125}}
                    variant={"contained"}
                    disabled={selectedResume === 'None'}
                    onClick={handleLoadWorkSpace}
                >
                    Load
                </Button>
            </FormControl>
        </Stack>
    );
};
export default ResumeAnalysisStepper;