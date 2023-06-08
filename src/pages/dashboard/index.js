import React, {useContext, useEffect, useState} from 'react';
import {Grid} from "@mui/material";
import AudioPlayer from "./AudioPlayer";
import FluencyCounts from "./FluencyCounts";
import KeyboardLegend from "./KeyboardLegend";
import {StutteredProvider, StutteredContext} from "../../context/StutteredContext";
import StutteredEvents from "./StutteredEvents";


const DefaultDashboard = () => {
    const [se, setSS] = useState(0);
    const [nss, setNSS] = useState(0);


    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <AudioPlayer ss={se} nss={nss} setSS={setSS} setNSS={setNSS}/>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <StutteredEvents />
            </Grid>
            {/*<Grid item xs={12} sm={12} md={6} lg={6}>*/}
            {/*    <KeyboardLegend />*/}
            {/*</Grid>*/}
            <Grid item xs={12} sm={12} md={6} lg={6}>
                <FluencyCounts />
            </Grid>
        </Grid>
    );
};

export default DefaultDashboard;