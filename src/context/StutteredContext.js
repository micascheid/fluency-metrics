import React, {useState, createContext, useEffect} from "react";


export const StutteredContext = createContext();

export const StutteredProvider = ({children}) => {
    // VARIABLES
    const [stutteredEventCount, setStutteredEventCount] = useState(0);
    const [stutteredEventsList, setStutteredEventsList] = useState([]);
    const [totalSyllableCount, setTotalSyllableCount] = useState(0);
    const [transcriptionObj, setTranscriptionObj] = useState(null);
    const [currentWordIndex, setCurrentWordIndex] = useState(1);
    // const [ss, setSS] = useState(0);
    const [averageDuration, setAverageDuration] = useState(0);
    // const [psList, setPsList] = useState([]);
    const [loadingTranscription, setLoadingTranscription] = useState(false);
    const [mode, setMode] = useState('');
    const [audioFileName, setAudioFileName] = useState('');
    const [audioFile, setAudioFile] = useState(null);
    const [kiStutteredRegions, setkiStutteredRegions] = useState({});
    const [fileChosen, setFileChosen] = useState(false);
    const [longest3Durations, setLongest3Durations] = useState([0, 0, 0]);
    const [audioPlayerControl, setAudioPlayerControl] = useState(null);
    const [playBackSpeed, setPlayBackSpeed] = useState(1);

    /*
        Repetition: 0
        Prolongation: 1
        Block: 2
        Interjection: 3

        stutteredEventList={1:{start: <>,end: <>}, {2:{start: <>,end: <>}}
     */
    //FUNCTIONS

    const handleStutteredChange = (change) => {
        setStutteredEventCount(prevCount => prevCount + change);
    };

    const addStutteredEvent = (word_obj, type, ps, newWord, wordIndex) => {
        const duration = word_obj.end - word_obj.start;
        const eventItem = {type: type, duration: duration, ps: ps, text: newWord, uid: wordIndex};
        if (!stutteredEventsList.some((obj) => obj.uid === wordIndex)) {
            setStutteredEventsList(prevEvents => [...prevEvents, {...eventItem, id: prevEvents.length + 1}])
            setStutteredEventCount(prevCount => prevCount + 1);
        }
    };

    const removeStutteredEvent = (wordIndex) => {
        setStutteredEventsList(prevList => prevList.filter(word_obj => word_obj.uid !== wordIndex));
        setStutteredEventCount(prevCount => prevCount - 1);
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

    const configureDurations = () => {
        const durations = Object.entries(kiStutteredRegions).map(([key, value]) => {
            return Number((value.duration).toFixed(2));
        })
        durations.sort((a, b) => b - a);
        let topThree = durations.slice(0, 3);
        const average = Number((topThree.reduce((a, b) => a + b, 0) / topThree.length).toFixed(2));
        console.log("AVERAGE", average);
        setLongest3Durations(topThree);
        setAverageDuration(average)
    };

    const handleWordUpdate = (index, newWord) => {
        setTranscriptionObj(prevTranscription => {
            const updatedTranscription = {...prevTranscription};
            updatedTranscription[index].text = newWord;
            return updatedTranscription;
        });
    };

    useEffect(() => {
        console.log("Getting set in here");

        //Set Duration
        if (Object.keys(kiStutteredRegions).length >= 3) {
            configureDurations();
        }

        if (Object.keys(kiStutteredRegions).length > 0 && transcriptionObj) {
            transcriptError();
        }

    }, [totalSyllableCount, stutteredEventCount, kiStutteredRegions]);

    const transcriptError = () => {
        let transcriptionNew = JSON.parse(JSON.stringify(transcriptionObj));
        Object.keys(transcriptionNew).forEach((tKey) => {
            const wordStart = transcriptionNew[tKey].start;
            const wordEnd = transcriptionNew[tKey].end;
            transcriptionNew[tKey].stuttered = false;
            Object.keys(kiStutteredRegions).some((regionKey) => {
                const regionStart = kiStutteredRegions[regionKey].start;
                const regionEnd = kiStutteredRegions[regionKey].end;

                if ((wordEnd >= regionStart && wordEnd <= regionEnd) ||
                    (wordStart >= regionEnd && wordStart <= regionEnd)) {
                    transcriptionNew[tKey].stuttered = true;
                    return true;
                }
                return false;
            });
        });
        setTranscriptionObj(transcriptionNew);
    };


    const contextValues = {
        averageDuration,
        transcriptionObj,
        totalSyllableCount,
        stutteredEventCount,
        stutteredEventsList,
        setTranscriptionObj,
        setStutteredEventCount,
        setTotalSyllableCount,
        // ss,
        // psList,
        loadingTranscription,
        setLoadingTranscription,
        setCurrentWordIndex,
        currentWordIndex,
        kiStutteredRegions,
        setkiStutteredRegions,
        setFileChosen,
        fileChosen,
        mode,
        setMode,
        audioFileName,
        setAudioFileName,
        setAudioFile,
        audioFile,
        handleWordUpdate,
        setAdjustedSyllableCount,
        countTotalSyllables,
        handleStutteredChange,
        addStutteredEvent,
        removeStutteredEvent,
        longest3Durations,
        setAudioPlayerControl,
        audioPlayerControl,
        setPlayBackSpeed,
        playBackSpeed,
        transcriptError,
    }

    return (
        <StutteredContext.Provider value={contextValues}>
            {children}
        </StutteredContext.Provider>
    );
};
