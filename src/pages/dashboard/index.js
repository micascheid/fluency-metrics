import {React, useState} from 'react';
import {Grid} from "@mui/material";
import Waveform from "./Waveform";
import AudioPlayer from "./AudioPlayer";
import AudioPlayer2 from "./AudioPlayer2";
import MainCard from "../../components/MainCard";
import FluencyCounts from "./FluencyCounts";

const DefaultDashboard = () => {
    const [ss, setSS] = useState(0);
    const [nss, setNSS] = useState(0);

    console.log("SS Index: ", ss);


    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <AudioPlayer2 ss={ss} nss={nss} setSS={setSS} setNSS={setNSS}/>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
                <FluencyCounts ss={ss} nss={nss}/>
            </Grid>
        </Grid>
    );
};

export default DefaultDashboard;