import React, {useState, createContext, useCallback} from "react";


export const StutteredContext = createContext();

export const StutteredProvider = ({children}) => {
    // VARIABLES
    const [stutteredEventCount, setStutteredEventCount] = useState(0);
    const [stutteredEventsList, setStutteredEventsList] = useState([]);
    const [totalSyllables, setTotalSyllables] = useState(0);
    const [transcriptionObj, setTranscriptionObj] = useState(null);
    // const [stutteredEvent, setStutteredEvent] = useState(0);

    //FUNCTIONS
    const handleStutteredChange = (change) => {
        console.log("CHANGE:", change);
        setStutteredEventCount(prevCount =>  prevCount+change);
    };

    const addStutteredEvent = (word_obj, type, ps, newWord, wordIndex) => {
        const duration = word_obj.end - word_obj.start;
        const eventItem = {type: type, duration: duration, ps: ps, text: newWord, uid: wordIndex};
        if (!stutteredEventsList.some((obj) => obj.uid === wordIndex)){
            setStutteredEventsList(prevEvents => [...prevEvents, {...eventItem, id: prevEvents.length+1}])
            setStutteredEventCount(prevCount => prevCount+1);
        }
    };

    const removeStutteredEvent = (wordIndex) => {
        setStutteredEventsList(prevList => prevList.filter(word_obj => word_obj.uid !== wordIndex));
        setStutteredEventCount(prevCount => prevCount-1);
    };

    const setAdjustedSyllables = (index, syllableCount) => {
        setTranscriptionObj(prevTranscription => {
           const updatedTranscription = {...prevTranscription};
           updatedTranscription[index].syllable_count = syllableCount;
           return updatedTranscription;
        });
    };
    const countTotalSyllables = () => {
        console.log("COUNTING THEM SYLLABLES YALL");
        let sum = 0;
        for (let key in transcriptionObj) {
            sum += transcriptionObj[key].syllable_count;
        }
        setTotalSyllables(sum);
    };


    const contextValues = {
        transcriptionObj,
        totalSyllables,
        stutteredEventCount,
        stutteredEventsList,
        setTranscriptionObj,
        setStutteredEventCount,
        setAdjustedSyllables,
        countTotalSyllables,
        handleStutteredChange,
        addStutteredEvent,
        removeStutteredEvent,
    }

    return (
        <StutteredContext.Provider value={contextValues}>
            {children}
        </StutteredContext.Provider>
    );
};
