import { React } from 'react';
import {Grid} from "@mui/material";
import Waveform from "./Waveform";
import AudioPlayer from "./AudioPlayer";
import AudioPlayer2 from "./AudioPlayer2";
import MainCard from "../../components/MainCard";

const DefaultDashboard = () => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <MainCard>
                    <AudioPlayer2 />
                </MainCard>

            </Grid>
        </Grid>
    );
};

export default DefaultDashboard;