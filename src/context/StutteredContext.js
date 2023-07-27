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
    const [audioFile, setAudioFile] = useState(null);
    // const [kiStutteredEventTimes, setkiStutteredEventTimes] = useState([]);
    const [kiStutteredRegions, setkiStutteredRegions] = useState([]);
    const [fileChosen, setFileChosen] = useState(false);
    const [longest3Durations, setLongest3Durations] = useState([1.1,2.2,3.3]);

    /*
        Repetition: 0
        Prolongation: 1
        Block: 2
        Interjection: 3

        stutteredEventList={1:{start: <>,end: <>}, {2:{start: <>,end: <>}}
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

    const longestDurations = (newRegions) => {
        setLongest3Durations(() => {
            let durations = [0,0,0];
            if (newRegions !== undefined) {
                durations = Object.values(newRegions).map(item => item.duration);
                while (durations.length < 3) {
                    durations.push(0);
                }
            }
            durations.sort((a,b) => b - a);
            durations = durations.slice(0,3).map(num => +num.toFixed(2));

            setAverageDuration(() => {
               let avg = 0
                Object.values(durations).map(duration => {
                   avg += duration;
               })
                return parseFloat((avg/3).toFixed(2));
            });
            return durations.slice(0,3).map(num => +num.toFixed(2));
        })

        // return values.slice(0,3).map(item => item.duration);
    };
    const handleWordUpdate = (index, newWord) => {
        setTranscriptionObj(prevTranscription => {
            const updatedTranscription = {...prevTranscription};
            updatedTranscription[index].text = newWord;
            return updatedTranscription;
        });
    };

    // const kiStutteredEventsToStutteredRegions = () => {
    //     let newRegions = [];
    //     for (let i = 0; i < kiStutteredEventTimes.length; i+=2){
    //         if (!((i+1) === kiStutteredEventTimes.length)) {
    //             const start = kiStutteredEventTimes[i];
    //             const end = kiStutteredEventTimes[i+1];
    //             const duration = end - start;
    //             newRegions.push({id: (i/2), start: start, end: end, duration: duration});
    //         }
    //     }
    //     setkiStutteredRegions(newRegions);
    //     longestDurations(newRegions);
    //
    // };

    const durationAverageRegions = useCallback(() => {
        let durations = [];
        if (kiStutteredRegions % 2 === 0) {
            for (let obj in kiStutteredRegions) {
                console.log("START:", obj.start, " END:", obj.end);
                durations.push(obj.end - obj.start);
            }
            console.log("DURATIONS:", durations);
        }
    }, [kiStutteredRegions]);


    useEffect(() => {
        console.log("Getting set in here");
        //Set Frequency and Physical concomitants
        if (stutteredEventCount > 0){
            const ssPercentage = Math.round((stutteredEventCount/totalSyllableCount)*1000)/10;
            setSS(ssPercentage);

            const new_list = Object.values(stutteredEventsList).map(obj => obj.ps);
            setPsList(new_list);
        }
        // kiStutteredEventsToStutteredRegions();

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
    }

    return (
        <StutteredContext.Provider value={contextValues}>
            {children}
        </StutteredContext.Provider>
    );
};
