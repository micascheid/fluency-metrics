import { React } from 'react';
import {CardContent, Grid, Typography} from "@mui/material";
import MainCard from "../../components/MainCard";


const ResultCard = ({ timeBetweenWords, avgStutteringEventTime, totalSyllableCount, totalStutteringEvents }) => {
    return (
        <MainCard>
            <CardContent>
                <Typography variant="h5" component="div">
                    Final Results
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6">Time Between Each Word:</Typography>
                        <Typography variant="subtitle1">{timeBetweenWords}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6">Average Length of Three Longest Stuttering Events:</Typography>
                        <Typography variant="subtitle1">{avgStutteringEventTime}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6">Total Syllable Count:</Typography>
                        <Typography variant="subtitle1">{totalSyllableCount}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6">Total Stuttering Events:</Typography>
                        <Typography variant="subtitle1">{totalStutteringEvents}</Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </MainCard>
    );
};

export default ResultCard;