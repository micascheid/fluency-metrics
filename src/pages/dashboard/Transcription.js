import {Fragment, React, useContext, useEffect, useState} from "react";
import MainCard from "../../components/MainCard";
import {Box, CircularProgress, Stack, Typography} from "@mui/material";
import {StutteredContext} from "../../context/StutteredContext";
import WordComponent from "./WordComponent";
import TranscriptionAuto from "./TranscriptionAuto";
import TranscriptionManual from "./TranscriptionManual";
import {AUTO, MANUAL} from "../../constants";


const Transcription = () => {
    // variables
    const {
        mode,
        transcriptionObj,
        loadingTranscription,
        countTotalSyllables,
        audioFileDuration,
    } = useContext(StutteredContext);

    const transcriptionTimeEstimate = () => {
        const finalDur = Math.round(audioFileDuration / 60) * 6;
        const minutes = Math.floor(finalDur / 60);
        const seconds = finalDur % 60;
        let displayTime = '';
        if (minutes > 0) {
            displayTime += `${minutes} minute${minutes === 1 ? '' : 's'} and `
        }
        displayTime += `${seconds} second${seconds === 1 ? '' : 's'}`;
        return displayTime;
    };


    // FUNCTIONS
    useEffect(() => {
        if (transcriptionObj !== null) {
            countTotalSyllables();
        }
    }, [transcriptionObj]);

    const transcriptionEstimate = transcriptionTimeEstimate();

    return (
        <MainCard>
            {loadingTranscription ? (
                // <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', pt: 2}}>
                    <Stack alignItems={'center'}>
                        <CircularProgress/>
                        <Typography variant={"h4"} fontWeight={"light"}>Your transcription will be ready in</Typography>
                        <Typography variant={"h4"}>{transcriptionEstimate}</Typography>
                    </Stack>
            ) : (
                <Box>
                    {transcriptionObj && mode === AUTO &&
                        <TranscriptionAuto/>
                    }
                    {mode === MANUAL &&
                        <TranscriptionManual/>
                    }
                </Box>
            )}
        </MainCard>
    );

};
export default Transcription;
