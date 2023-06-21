import React, {useState, createContext, useCallback, useEffect} from "react";


export const StutteredContext = createContext();

export const StutteredProvider = ({children}) => {
    // VARIABLES
    const [stutteredEventCount, setStutteredEventCount] = useState(0);
    const [stutteredEventsList, setStutteredEventsList] = useState([]);
    const [totalSyllableCount, setTotalSyllableCount] = useState(0);
    const [transcriptionObj, setTranscriptionObj] = useState(null);
    const [currentWordIndex, setCurrentWordIndex] = useState(1);
    const [ss, setSS] = useState(0);
    const [averageDuration, setAverageDuration] = useState(0);
    const [psList, setPsList] = useState([]);
    const [loadingTranscription, setLoadingTranscription] = useState(false);
    const [mode, setMode] = useState('');
    const [audioFileName, setAudioFileName]= useState('');

/*
    Repetition: 0
    Prolongation: 1
    Block: 2
    Interjection: 3
 */
    //FUNCTIONS
    const handleStutteredChange = (change) => {
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

    const setAdjustedSyllableCount = (index, syllableCount) => {
        setTranscriptionObj(prevTranscription => {
           const updatedTranscription = {...prevTranscription};
           updatedTranscription[index].syllable_count = syllableCount;
           return updatedTranscription;
        });
    };
    const countTotalSyllables = () => {
        let sum = 0;
        for (let key in transcriptionObj) {
            sum += transcriptionObj[key].syllable_count;
        }
        setTotalSyllableCount(sum);
    };

    const calcAverageDuration = () => {
        console.log(stutteredEventsList);
        const values = Object.values(stutteredEventsList);
        values.sort((a,b) => b.duration - a.duration);

        const topThreeDurations = values.slice(0, 3).map(item=> item.duration);
        const total = topThreeDurations.reduce((a, b) => a + b, 0);

        return parseFloat((total / topThreeDurations.length).toFixed(2));

    };

    const handleWordUpdate = (index, newWord) => {
        setTranscriptionObj(prevTranscription => {
            const updatedTranscription = {...prevTranscription};
            updatedTranscription[index].text = newWord;
            return updatedTranscription;
        });
    };

    useEffect(() => {
        console.log("Event List:",stutteredEventsList)
        //Set Frequency and Physical concomitants
        if (stutteredEventCount > 0){
            const ssPercentage = Math.round((stutteredEventCount/totalSyllableCount)*1000)/10;
            setSS(ssPercentage);

            const new_list = Object.values(stutteredEventsList).map(obj => obj.ps);
            setPsList(new_list);
        }

        //Set Duration
        if (stutteredEventCount >= 3) {
            setAverageDuration(calcAverageDuration());
        }

    }, [totalSyllableCount, stutteredEventCount]);


    const contextValues = {
        averageDuration,
        transcriptionObj,
        totalSyllableCount,
        stutteredEventCount,
        stutteredEventsList,
        setTranscriptionObj,
        setStutteredEventCount,
        setTotalSyllableCount,
        ss,
        psList,
        loadingTranscription,
        setLoadingTranscription,
        setCurrentWordIndex,
        currentWordIndex,
        mode,
        setMode,
        audioFileName,
        setAudioFileName,
        handleWordUpdate,
        setAdjustedSyllableCount,
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
