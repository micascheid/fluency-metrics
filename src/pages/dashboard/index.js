import React, {useContext, useEffect, useState} from 'react';
import {Backdrop, Grid, Stack} from "@mui/material";
import AudioPlayer from "./AudioPlayer";
import FluencyCounts from "./FluencyCounts";
import StutteredEvents from "./StutteredEvents";
import Mode from "./Mode";
import Transcription from "./Transcription";
import {UserContext} from "../../context/UserContext";
import LoadingOverlay from "./LoadingOverlay";
import {StutteredProvider} from "../../context/StutteredContext";
import HelpMode from "./help-components/HelpMode";
import AdditionalNotes from "./AdditionalNotes";
import HelpAudioPlayer from "./help-components/HelpAudioPlayer";
import HelpTranscription from "./help-components/HelpTranscription";
import HelpDisfluencyEvents from "./help-components/HelpDisfluencyEvents";
import HelpFluencyCounts from "./help-components/HelpFluencyCounts";
import HelpAdditionalNotes from "./help-components/HelpAdditionalNotes";
import HelpWorkspace from "./help-components/HelpWorkspace";
import Workspace from "./Workspace";
import HighLevelSummary from "./HighLevelSummary";
import {useTheme} from "@mui/material/styles";
import DashboardBlocked from "./modals/DashboardBlocked";
import badHealth from "./modals/BadHealth";
import BadHealth from "./modals/BadHealth";
import {doc} from "firebase/firestore";
import {db} from "../../FirebaseConfig";
import HelpHighLevelSummary from "./help-components/HelpHighLevelSummary";
import {DashboardContext, ToolContext} from "../../context/ToolContext";


const DefaultDashboard = () => {
    const {
        user,
        isLoading,
        isBlocked,
        badHealth,
    } = useContext(UserContext);

    const {
        mode, setMode,
        speechSampleContext, setSpeechSampleContext,
        audioFile, setAudioFile,
        fileChosen, setFileChosen,
        audioFileName, setAudioFileName,
        workspaceName, setWorkspaceName,
        workspaceId, setWorkspaceId,
        audioFileDuration, setAudioFileDuration,
        isGetTranscription, setIsGetTranscription,
        isCreateNewWorkspace, setIsCreateNewWorkspace,
        isUpdateWorkspace, setIsUpdateWorkspace,
        loadWorkspaceByObj, setLoadWorkspaceByObj,
        expanded, setExpanded,
        workspaceExpanded, setWorkspaceExpanded,
        loadingTranscription, setLoadingTranscription
    } = useContext(ToolContext);
    const theme = useTheme();


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
        loadingTranscription: loadingTranscription,
        setLoadingTranscription: setLoadingTranscription,
        setWorkspaceExpanded: setWorkspaceExpanded,
    }



    useEffect(() => {
        const beforeUnloadListener = (event) => {
            // setIsUpdateWorkspace(true)
            event.preventDefault();
            event.returnValue = 'Refreshing will result in loss of unsaved work';
        };

        window.addEventListener('beforeunload', beforeUnloadListener);

        return () => {
            console.log("Get called here?");
            window.removeEventListener('beforeunload', beforeUnloadListener);
        }
    }, []);


    return (
        <React.Fragment>
            {isLoading ? (
                <LoadingOverlay isOpen={isLoading}/>
            ) : (
                <React.Fragment>
                    {badHealth ? (
                        <BadHealth reason={badHealth} open={!!badHealth}/>
                    ) : isBlocked ? (
                        <DashboardBlocked isBlocked={isBlocked}/>
                    ) : (
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Mode {...propValues} help={<HelpMode/>}/>
                            </Grid>
                                <Grid item xs={12}>
                                    <Workspace expanded={workspaceExpanded} help={<HelpWorkspace/>}>
                                        <Grid item container xs={12} spacing={2}>
                                            <Grid item xs={12}>
                                                <AudioPlayer help={<HelpAudioPlayer/>}
                                                             cardColor={theme.palette.grey[300]}/>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Transcription help={<HelpTranscription/>}
                                                               cardColor={theme.palette.grey[300]}/>
                                            </Grid>
                                        </Grid>
                                    </Workspace>
                                </Grid>

                                <Grid item xs={12}>
                                    <HighLevelSummary expanded={workspaceExpanded} help={<HelpHighLevelSummary/>}>
                                        <Grid item container xs={12} spacing={2}>
                                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                                <StutteredEvents help={<HelpDisfluencyEvents/>}/>
                                            </Grid>

                                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                                <Stack spacing={2}>
                                                    <FluencyCounts help={<HelpFluencyCounts/>}/>
                                                    <AdditionalNotes help={<HelpAdditionalNotes/>}/>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </HighLevelSummary>
                                </Grid>
                        </Grid>
                    )}
                </React.Fragment>

            )}
        </React.Fragment>

    );
};

export default DefaultDashboard;