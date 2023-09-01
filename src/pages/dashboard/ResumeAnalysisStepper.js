import react, {useContext, useEffect, useState} from 'react';
import {Button, FormControl, InputLabel, MenuItem, Select, Stack} from "@mui/material";
import React from "react";
import UserContext from "../../context/UserContext";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../../FirebaseConfig";

const ResumeAnalysisStepper = () => {
    const { user } = useContext(UserContext);
    const workspacesColRef = collection(db, 'users', user.uid, 'workspaces');
    const [selectedResume, setSelectedResume] = useState('None');
    const [workspacesIndex, setWorkspacesIndex] = useState();
    const handleResumeSelection = (event) => {
        setSelectedResume(event.target.value);
    };

    useEffect(() => {
        getDocs(workspacesColRef).then((docs) => {
            console.log(typeof docs);
            docs.forEach((doc) => {
                // console.log(doc);
            });
            setWorkspacesIndex(docs);
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

                    <MenuItem value={10}>Analysis 1</MenuItem>
                    <MenuItem value={20}>Analysis 2</MenuItem>
                    <MenuItem value={30}>Analysis 3</MenuItem>
                </Select>
                <Button
                    sx={{mt: 2, maxWidth: 125}}
                    variant={"contained"}
                    disabled={selectedResume === 'None'}
                >
                    Load
                </Button>
            </FormControl>
        </Stack>
    );
};
export default ResumeAnalysisStepper;