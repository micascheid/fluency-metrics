import React, {useContext, useEffect, useState} from 'react';
import {Grid, Stack} from "@mui/material";
import AudioPlayer from "./AudioPlayer";
import FluencyCounts from "./FluencyCounts";
import KeyboardLegend from "./KeyboardLegend";
import StutteredEvents from "./StutteredEvents";
import Mode from "./Mode";
import Transcription from "./Transcription";
import SaveWorkspace from "./SaveWorkspace";
import {UserContext} from "../../context/UserContext";
import LoadingOverlay from "./LoadingOverlay";
import {StutteredProvider} from "../../context/StutteredContext";
import HelpMode from "./help-components/HelpMode";
import CustomNotes from "./CustomNotes";
import CreateSummary from "./CreateSummary";


const DefaultDashboard = () => {
    const {
        isLoading,
    } = useContext(UserContext);

    const [mode, setMode] = useState('');
    const [speechSampleContext, setSpeechSampleContext] = useState('');
    const [audioFile, setAudioFile] = useState(null)
    const [fileChosen, setFileChosen] = useState('');
    const [audioFileName, setAudioFileName] = useState('');
    const [audioFileDuration, setAudioFileDuration] = useState(0);
    const [workspaceName, setWorkspaceName] = useState('');
    const [isGetTranscription, setIsGetTranscription] = useState(false);
    const [isCreateNewWorkspace, setIsCreateNewWorkspace] = useState(false);
    const [isUpdateWorkspace, setIsUpdateWorkspace] = useState(false);
    const [loadWorkspaceByObj, setLoadWorkspaceByObj] = useState(null);
    const [workspaceId, setWorkspaceId] = useState('None');
    const [expanded, setExpanded] = useState(true);


    const propValues = {
        expanded: expanded,
        setExpanded: setExpanded,
        mode: mode,
        setMode: setMode,
        speechSampleContext,
        setSpeechSampleContext,
        fileChosen: fileChosen,
        setFileChosen: setFileChosen,
        audioFileName: audioFileName,
        setAudioFileName: setAudioFileName,
        workspaceName: workspaceName,
        setWorkspaceName: setWorkspaceName,
        workspaceId: workspaceId,
        setWorkspaceId: setWorkspaceId,
        audioFile: audioFile,
        setAudioFile: setAudioFile,
        isCreateNewWorkspace: isCreateNewWorkspace,
        setIsGetTranscription: setIsGetTranscription,
        isGetTranscription: isGetTranscription,
        setIsCreateNewWorkspace: setIsCreateNewWorkspace,
        setIsUpdateWorkspace: setIsUpdateWorkspace,
        isUpdateWorkspace: isUpdateWorkspace,
        setLoadWorkspaceByObj: setLoadWorkspaceByObj,
        loadWorkspaceByObj: loadWorkspaceByObj,
        setAudioFileDuration: setAudioFileDuration,
        audioFileDuration: audioFileDuration,
    }

    useEffect(() => {
        const beforeUnloadListenter =(event) => {
            event.preventDefault();
            event.returnValue = 'Refreshing will result in loss of unsaved work';
        };

        window.addEventListener('beforeunload', beforeUnloadListenter);

        return () => {
            window.removeEventListener('beforeunload', beforeUnloadListenter);
        }
    }, []);

    //call data in here to get

    return (
        <React.Fragment>
            {isLoading ? (
                <LoadingOverlay isOpen={isLoading}/>
            ) : (
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Mode {...propValues} help={<HelpMode/>}/>
                    </Grid>
                    <StutteredProvider {...propValues}>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <AudioPlayer/>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Transcription/>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            <StutteredEvents/>
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            <Stack spacing={2}>
                                <FluencyCounts/>
                                <CustomNotes />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <CreateSummary />
                        </Grid>
                    </StutteredProvider>
                </Grid>
            )}
        </React.Fragment>

    );
};

export default DefaultDashboard;