import React, {useState, createContext, useEffect} from "react";
export const StutteredContext = createContext();
const initialState = {
    stutteredEventsCounts: 0,
    stutteredEvents: {},
    totalSyllableCount: 0,
    transcriptionObj: null,
    currentWordIndex: 1,
    averageDuration: 0,
    loadingTranscription: false,
    mode: '',
    audioFileName: '',
    audioFile: null,
    kiStutteredRegions: {},
    fileChosen: false,
    longest3Durations: [0, 0, 0],
    audioPlayerControl: null,
    playBackSpeed: 1
}

export const StutteredProvider = ({children}) => {
    // VARIABLES
    const [stutteredEventsCount, setStutteredEventsCount] = useState(0);
    const [stutteredEvents, setStutteredEvents] = useState({});
    const [totalSyllableCount, setTotalSyllableCount] = useState(0);
    const [transcriptionObj, setTranscriptionObj] = useState(null);
    const [currentWordIndex, setCurrentWordIndex] = useState(1);
    const [averageDuration, setAverageDuration] = useState(0);
    const [loadingTranscription, setLoadingTranscription] = useState(false);
    const [mode, setMode] = useState('');
    const [audioFileName, setAudioFileName] = useState('');
    const [audioFile, setAudioFile] = useState(null);
    const [kiStutteredRegions, setkiStutteredRegions] = useState({});
    const [fileChosen, setFileChosen] = useState(false);
    const [longest3Durations, setLongest3Durations] = useState([0, 0, 0]);
    const [audioPlayerControl, setAudioPlayerControl] = useState(null);
    const [playBackSpeed, setPlayBackSpeed] = useState(1);

    //FUNCTIONS
    const resetTransAndSE = () => {
        setStutteredEventsCount(initialState.stutteredEventsCounts);
        setStutteredEvents(initialState.stutteredEvents);
        setTotalSyllableCount(initialState.totalSyllableCount);
        setTranscriptionObj(initialState.transcriptionObj);
        setCurrentWordIndex(initialState.currentWordIndex);
        setAverageDuration(initialState.averageDuration);
        setLoadingTranscription(initialState.loadingTranscription);
        setkiStutteredRegions(initialState.kiStutteredRegions);
        setLongest3Durations(initialState.longest3Durations);

    }
    const handleStutteredChange = (change) => {
        setStutteredEventsCount(prevCount => prevCount + change);
    };

    const addStutteredEvent = (word_obj, type, syllable_count, ps, newWord, wordIndex) => {
        const duration = word_obj.end - word_obj.start;
        const eventItem = {type: type, duration: duration, ps: ps, text: newWord, uid: wordIndex};
        if (!stutteredEvents.some((obj) => obj.uid === wordIndex)) {
            setStutteredEvents(prevEvents => [...prevEvents, {...eventItem, id: prevEvents.length + 1}])
            setStutteredEventsCount(prevCount => prevCount + 1);
        }
    };


    const addStutteredEventWaveForm = (region, syllableCount, ps, text, type) => {
        const duration = region.end - region.start;
        const eventItem = {duration: duration, syllable_count: syllableCount, ps: ps, text: text, type: type, id: region.id};
        if (!stutteredEvents[region.id]) {
            setStutteredEvents(prevEvents => ({...prevEvents, [region.id]: eventItem}));
            setStutteredEventsCount(prevCount => prevCount + 1);
        }
        let changeRegion = kiStutteredRegions[region.id];
        changeRegion.color = "rgba(255, 153, 10, .5)";
        setkiStutteredRegions(prevRegions => {
            return {
                ...prevRegions,
                [region.id]: changeRegion
            }
        });

    };

    const updateStutteredEventWaveForm = (region, syllable_count, ps, text, type) => {
        setStutteredEvents(prevEvents => {
                    const duration = region.end - region.start;
                    const eventItem = {
                        duration: duration,
                        syllable_count: syllable_count,
                        ps: ps,
                        text: text,
                        type: type,
                        id: region.id
                    };
                    return {
                        ...prevEvents,
                        [region.id]: eventItem
                    };
            });
    };

    const randomFunction = () => {
      console.log("RANDOM FUNCTION");
    };

    const removeStutteredEvent = (wordIndex) => {
        console.log(stutteredEvents);
        setStutteredEvents(prevList => prevList.filter(word_obj => word_obj.id !== wordIndex));
        if (stutteredEvents) {
            setStutteredEventsCount(prevCount => prevCount-1)
        }
    };

    const removeStutteredEventsWaveForm = (region) => {
        setStutteredEvents(prevEvents => {
            const newEvents = {...prevEvents};
            delete newEvents[region.id];
            return newEvents;
        });
        setStutteredEventsCount(preCount => preCount - 1);
    }

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
            updatedTranscription[index].punctuated_word = newWord;
            return updatedTranscription;
        });
    };

    useEffect(() => {
        //Set Duration
        if (Object.keys(kiStutteredRegions).length >= 3) {
            configureDurations();
        }

        if (Object.keys(kiStutteredRegions).length >= 0 && transcriptionObj) {
            transcriptError();
        }

    }, [totalSyllableCount, stutteredEventsCount, kiStutteredRegions]);

    useEffect(() => {
       setStutteredEventsCount(stutteredEvents.length);
    }, [stutteredEvents]);

    const transcriptError = () => {
        let transcriptionNew = JSON.parse(JSON.stringify(transcriptionObj));
        Object.keys(transcriptionNew).forEach((tKey) => {
            const wordStart = transcriptionNew[tKey].start;
            const wordEnd = transcriptionNew[tKey].end;
            transcriptionNew[tKey].stuttered = false;
            Object.keys(kiStutteredRegions).some((regionKey) => {
                const regionStart = kiStutteredRegions[regionKey].start;
                const regionEnd = kiStutteredRegions[regionKey].end;
                if ((wordStart >= regionStart && wordStart <= regionEnd) ||
                    (wordEnd >= regionStart && wordEnd <= regionEnd)){
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
        stutteredEventsCount,
        stutteredEvents,
        setTranscriptionObj,
        setStutteredEventsCount,
        setTotalSyllableCount,
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
        updateStutteredEventWaveForm,
        removeStutteredEvent,
        longest3Durations,
        setAudioPlayerControl,
        audioPlayerControl,
        setPlayBackSpeed,
        playBackSpeed,
        transcriptError,
        randomFunction,
        addStutteredEventWaveForm,
        removeStutteredEventsWaveForm,
        resetTransAndSE,
    }

    return (
        <StutteredContext.Provider value={contextValues}>
            {children}
        </StutteredContext.Provider>
    );
};
