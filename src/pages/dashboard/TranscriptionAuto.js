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
    } = useContext(StutteredContext);
    const keys = Object.keys(transcriptionObj);

    const handleSpacerClick = (leftId, rightId) => {
        console.log("Clicked between", leftId, " and ", rightId);
    }

    useEffect(() => {

    },[kiStutteredRegions]);
    // console.log("HEY GETTING RE RENDERED HERE:", transcriptionObj);
    // console.log("CURRENT WORD INDEX: " + typeof currentWordIndex);
    return (
        <Typography variant={"h4"}>
            {Object.keys(transcriptionObj).map((key, index) => (
                <Fragment key={key}>
                    <WordComponent
                        word={transcriptionObj[key].punctuated_word}
                        word_obj={transcriptionObj[key]}
                        index={key}
                        style={{textDecoration: currentWordIndex === parseInt(key) ? 'underline' : 'none',
                                backgroundColor: transcriptionObj[key].stuttered ? "#ADD8E6" : 'transparent'}}
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
    );
};
export default TranscriptionAuto;