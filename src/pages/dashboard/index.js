import React, {useContext, useEffect, useState} from 'react';
import {Grid} from "@mui/material";
import AudioPlayer from "./AudioPlayer";
import FluencyCounts from "./FluencyCounts";
import KeyboardLegend from "./KeyboardLegend";
import StutteredEvents from "./StutteredEvents";
import Mode from "./Mode";
import Transcription from "./Transcription";
import SaveWorkspace from "./SaveWorkspace";
import {UserContext} from "../../context/UserContext";
import LoadingOverlay from "./LoadingOverlay";


const DefaultDashboard = () => {
    const {
        isLoading,
    } = useContext(UserContext);

    return (
        <React.Fragment>
            {isLoading ? (
                <LoadingOverlay isOpen={isLoading}/>
            ) : (
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Mode/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <AudioPlayer/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Transcription/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={8} lg={8}>
                        <StutteredEvents/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <FluencyCounts/>
                    </Grid>
                </Grid>
            )}
        </React.Fragment>

    );
};

export default DefaultDashboard;