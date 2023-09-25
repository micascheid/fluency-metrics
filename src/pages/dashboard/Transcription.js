import {Fragment, React, useContext, useEffect, useState} from "react";
import MainCard from "../../components/MainCard";
import {Box, CircularProgress, Stack, Typography} from "@mui/material";
import {StutteredContext} from "../../context/StutteredContext";
import WordComponent from "./WordComponent";
import TranscriptionAuto from "./TranscriptionAuto";
import TranscriptionManual from "./TranscriptionManual";
import {AUTO, MANUAL} from "../../constants";
import Help from "./Help";


const Transcription = (props) => {
    // variables
    const {
        mode,
        transcriptionObj,
        loadingTranscription,
        countTotalSyllables,
        audioFileDuration,
    } = useContext(StutteredContext);
    const {help, cardColor} = props;

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
        <MainCard title={
            <Box flexGrow={1}>
                <Help title={"Transcription"}>
                    {help}
                </Help>
            </Box>
        }
        // sx={{backgroundColor: cardColor}}
        >
            {loadingTranscription ? (
                    <Stack alignItems={'center'}>
                        <CircularProgress/>
                        <Typography variant={"h4"} fontWeight={"light"}>Hang tight! Transcription processing time is:</Typography>
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
