import {Fragment, React, useContext, useEffect, useState} from "react";
import MainCard from "../../components/MainCard";
import {Box, CircularProgress, Stack, Typography, Link} from "@mui/material";
import {StutteredContext} from "../../context/StutteredContext";
import WordComponent from "./WordComponent";
import TranscriptionAuto from "./TranscriptionAuto";
import TranscriptionManual from "./TranscriptionManual";
import {AUTO, MANUAL} from "../../constants";
import Help from "./Help";
import {useNavigate} from "react-router-dom";
import SupportModal from "./modals/SupportModal";


const Transcription = (props) => {
    // variables
    const {
        mode,
        transcriptionObj,
        loadingTranscription,
        countTotalSyllables,
        audioFileDuration,
        failedTranscription,
    } = useContext(StutteredContext);
    const {help} = props;
    const navigate = useNavigate();
    const [showSupport, setShowSupport] = useState(false);

    const transcriptionTimeEstimate = () => {
        const finalDur = Math.round((audioFileDuration / 60) * 10);
        const minutes = Math.floor(finalDur / 60);
        const seconds = finalDur % 60;
        let displayTime = '';
        if (minutes > 0) {
            displayTime += `${minutes} minute${minutes === 1 ? '' : 's'} and `
        }
        displayTime += `${seconds} second${seconds === 1 ? '' : 's'}`;
        return displayTime;
    };

    const handleSupport = () => {
        setShowSupport(true);
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
        >
            {loadingTranscription ? (
                    <Stack alignItems={'center'} spacing={1}>
                        <CircularProgress/>
                        <Typography variant={"h4"} fontWeight={"light"}>Hang tight! Processing time is:</Typography>
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
            {failedTranscription &&
                <Box>
                    <Typography variant={"h3"} fontWeight={"light"} align={'center'}>
                        We're currently experiencing issues processing the transcription. We apologize for the inconvenience. Please contact&nbsp;
                        <Link
                            component={"button"}
                            variant={"h3"}
                            fontWeight={"light"}
                            onClick={handleSupport}
                        >
                            support.
                        </Link>
                    </Typography>

                    <SupportModal isShow={showSupport} setIsShow={setShowSupport}/>
                </Box>
            }
        </MainCard>
    );

};
export default Transcription;
