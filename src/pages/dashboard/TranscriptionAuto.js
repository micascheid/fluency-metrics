import {Fragment, React, useContext, useEffect} from 'react';
import WordComponent from "./WordComponent";
import {Typography} from "@mui/material";
import {StutteredContext} from "../../context/StutteredContext";


const TranscriptionAuto = () => {
    const {
        transcriptionObj,
        handleWordUpdate,
        currentWordIndex,
        kiStutteredRegions,
    } = useContext(StutteredContext);

    useEffect(() => {

    },[kiStutteredRegions]);
    // console.log("HEY GETTING RE RENDERED HERE:", transcriptionObj);
    // console.log("CURRENT WORD INDEX: " + typeof currentWordIndex);

    return (
        <Typography variant={"h4"}>
            {Object.keys(transcriptionObj).map((key) => (
                <Fragment key={key}>
                    <WordComponent
                        word={transcriptionObj[key].punctuated_word}
                        word_obj={transcriptionObj[key]}
                        onUpdateWord={handleWordUpdate}
                        index={key}
                        style={{textDecoration: currentWordIndex === parseInt(key) ? 'underline' : 'none',
                                backgroundColor: transcriptionObj[key].stuttered ? "#ADD8E6" : 'transparent'}}
                    >
                    </WordComponent>{" "}
                </Fragment>
            ))}
        </Typography>
    );
};
export default TranscriptionAuto;