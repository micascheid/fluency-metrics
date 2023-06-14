import {Fragment, React, useContext, useEffect, useState} from "react";
import MainCard from "../../components/MainCard";
import {Box, CircularProgress, Typography} from "@mui/material";
import {StutteredContext} from "../../context/StutteredContext";
import WordComponent from "./WordComponent";


const Transcription = () => {
    // variables
    const {
        countTotalSyllable,
        setTranscriptionObj,
        transcriptionObj,
        loadingTranscription,
        currentWordIndex,
    } = useContext(StutteredContext);

    // FUNCTIONS
    const handleWordUpdate = (index, newWord) => {
        setTranscriptionObj(prevTranscription => {
            const updatedTranscription = {...prevTranscription};
            updatedTranscription[index].text = newWord;
            return updatedTranscription;
        });
    };

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
                <Box sx={{pt: 2}}>
                    {transcriptionObj &&
                        <Typography variant={"h4"}>
                            {Object.keys(transcriptionObj).map((key) => (
                                <Fragment key={key}>
                                    <WordComponent
                                        word={transcriptionObj[key].text}
                                        word_obj={transcriptionObj[key]}
                                        onUpdateWord={handleWordUpdate}
                                        index={key}
                                        style={{backgroundColor: currentWordIndex === key ? '#ADD8E6' : 'transparent'}}>
                                    </WordComponent>{" "}
                                </Fragment>
                            ))}
                        </Typography>
                    }
                </Box>
            )}
        </MainCard>
    );

};
export default Transcription;
