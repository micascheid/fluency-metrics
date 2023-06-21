import {Fragment, React, useContext, useEffect, useState} from "react";
import MainCard from "../../components/MainCard";
import {Box, CircularProgress, Typography} from "@mui/material";
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
    } = useContext(StutteredContext);

    // FUNCTIONS
    useEffect(() => {
        if (transcriptionObj !== null){
            countTotalSyllables();
        }
    }, [transcriptionObj]);

    return (
        <MainCard>
            {loadingTranscription ? (
                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', pt: 2}}>
                    <CircularProgress/>
                </Box>
            ) : (
                <Box>
                    {transcriptionObj && mode === AUTO &&
                        <TranscriptionAuto />
                    }
                    {mode === MANUAL &&
                        <TranscriptionManual />
                    }
                </Box>
            )}
        </MainCard>
    );

};
export default Transcription;
