import {Fragment, React, useContext} from 'react';
import WordComponent from "./WordComponent";
import {Typography} from "@mui/material";
import {StutteredContext} from "../../context/StutteredContext";


const TranscriptionAuto = () => {
    const {transcriptionObj, handleWordUpdate, currentWordIndex} = useContext(StutteredContext);


    return (
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
    );
};
export default TranscriptionAuto;