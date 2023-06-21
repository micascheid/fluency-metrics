import {Fragment, React, useContext, useEffect} from 'react';
import WordComponent from "./WordComponent";
import {Typography} from "@mui/material";
import {StutteredContext} from "../../context/StutteredContext";


const TranscriptionAuto = () => {
    const {transcriptionObj, handleWordUpdate, currentWordIndex} = useContext(StutteredContext);

    // console.log("CURRENT WORD INDEX: " + typeof currentWordIndex);

    return (
        <Typography variant={"h4"}>
            {Object.keys(transcriptionObj).map((key) => (
                <Fragment key={key}>
                    <WordComponent
                        word={transcriptionObj[key].text}
                        word_obj={transcriptionObj[key]}
                        onUpdateWord={handleWordUpdate}
                        index={key}
                        style={{backgroundColor: currentWordIndex === parseInt(key) ? '#ADD8E6' : 'transparent'}}
                    >
                    </WordComponent>{" "}
                </Fragment>
            ))}
        </Typography>
    );
};
export default TranscriptionAuto;