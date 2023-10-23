import {Fragment, React, useContext, useEffect} from 'react';
import WordComponent from "./WordComponent";
import {Typography} from "@mui/material";
import {StutteredContext} from "../../context/StutteredContext";
import Spacer from "./Spacer";


const TranscriptionAuto = () => {
    const {
        transcriptionObj,
        handleWordUpdate,
        currentWordIndex,
        kiStutteredRegions,
        failedTranscription,
    } = useContext(StutteredContext);
    const keys = Object.keys(transcriptionObj);

    const handleSpacerClick = (leftId, rightId) => {

    }

    useEffect(() => {

    },[kiStutteredRegions]);
    return (
        <Fragment>
            {failedTranscription ? (
                <Typography variant={"h3"} fontWeight={"light"}>We apologize for the inconvienence. But we are having issues grabbing your transcription at this time.</Typography>
            ) : (
            <Typography variant={"h4"}>
                {Object.keys(transcriptionObj).map((key, index) => (
                    <Fragment key={key}>
                        <WordComponent
                            word={transcriptionObj[key].punctuated_word}
                            word_obj={transcriptionObj[key]}
                            index={key}
                            style={{textDecoration: currentWordIndex === parseInt(key) ? 'underline' : 'none',
                                backgroundColor: transcriptionObj[key].stuttered ? "#ADD8E6" : 'transparent',
                                borderRadius: '5px',
                            }}
                        >
                        </WordComponent>
                        {index !== keys.length - 1 && (
                            <Spacer
                                leftId={key}
                                rightId={keys[index+1]}
                                onClick={handleSpacerClick}
                            />
                        )}
                    </Fragment>
                ))}
            </Typography>
            )
            }
        </Fragment>

    );
};
export default TranscriptionAuto;