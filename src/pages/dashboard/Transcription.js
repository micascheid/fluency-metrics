import { React } from 'react';
import MainCard from "../../components/MainCard";
import {Typography} from "@mui/material";
import {StutteredContext} from "../../context/StutteredContext";


const Transcription = () => {
    // variables
    const { countTotalSyllable, setTranscriptionObj, transcriptionObj } = useContext(StutteredContext);

    // FUNCTIONS


    return (
        <MainCard>
            <Typography>
                Some super cool text
            </Typography>
        </MainCard>
    );

};
export default Transcription;
