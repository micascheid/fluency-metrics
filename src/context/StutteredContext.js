import React, {useState, createContext, useEffect, useContext} from "react";
import {
    addDoc,
    collection,
    doc,
    getDocs,
    serverTimestamp,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import {db} from "../FirebaseConfig";
import {UserContext} from "./UserContext";
import axios from "axios";
import {BASE_URL, ENDPOINTS, UPD_WS_STATUS} from "../constants";
import {ToolContext} from "./ToolContext";

export const StutteredContext = createContext();



export const StutteredProvider = ({children}) => {
    // VARIABLES
    const {
        expanded,
        setExpanded,
        mode,
        setMode,
        speechSampleContext,
        setSpeechSampleContext,
        fileChosen,
        setFileChosen,
        audioFileName,
        setAudioFileName,
        workspaceName,
        setWorkspaceName,
        workspaceId,
        setWorkspaceId,
        audioFile,
        setAudioFile,
        isCreateNewWorkspace,
        setIsGetTranscription,
        isGetTranscription,
        setIsCreateNewWorkspace,
        setIsUpdateWorkspace,
        isUpdateWorkspace,
        setLoadWorkspaceByObj,
        loadWorkspaceByObj,
        setAudioFileDuration,
        audioFileDuration,
        loadingTranscription,
        setLoadingTranscription,
        setWorkspaceExpanded,
    } = useContext(ToolContext);

    const initialState = {
        percentSS: 0,
        stutteredEventsCount: 0,
        stutteredEvents: {},
        totalSyllableCount: 0,
        transcriptionObj: null,
        currentWordIndex: 1,
        averageDuration: 0,
        loadingTranscription: false,
        mode: mode,
        audioFileName: audioFileName,
        audioFile: audioFile,
        kiStutteredRegions: {},
        fileChosen: false,
        longest3Durations: [0, 0, 0],
        audioPlayerControl: null,
        playBackSpeed: 1,
        workspaceId: workspaceId,
        globalYesNo: false,
        customNotes: '',
        speechSampleContext: ''
    }

    const [stutteredEventsCount, setStutteredEventsCount] = useState(initialState.stutteredEventsCount);
    const [stutteredEvents, setStutteredEvents] = useState({});
    const [totalSyllableCount, setTotalSyllableCount] = useState(initialState.totalSyllableCount);
    const [transcriptionObj, setTranscriptionObj] = useState(initialState.transcriptionObj);
    const [currentWordIndex, setCurrentWordIndex] = useState(initialState.currentWordIndex);
    const [averageDuration, setAverageDuration] = useState(initialState.averageDuration);
    const [kiStutteredRegions, setkiStutteredRegions] = useState(initialState.kiStutteredRegions);
    const [longest3Durations, setLongest3Durations] = useState(initialState.longest3Durations);
    const [audioPlayerControl, setAudioPlayerControl] = useState(initialState.audioPlayerControl);
    const [playBackSpeed, setPlayBackSpeed] = useState(initialState.playBackSpeed);
    const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(false);
    const [percentSS, setPercentSS] = useState(0);
    const [customNotes, setCustomNotes] = useState(initialState.customNotes);
    const [wsSaveStatus, setWsSaveStatus] = useState(UPD_WS_STATUS.IDLE);
    const {user, setWorkspacesIndex} = useContext(UserContext);

    //FUNCTIONS
    const resetTransAndSE = async () => {
        setStutteredEventsCount(initialState.stutteredEventsCount);
        setPercentSS(initialState.percentSS);
        setStutteredEvents(initialState.stutteredEvents);
        setTotalSyllableCount(initialState.totalSyllableCount);
        setTranscriptionObj(initialState.transcriptionObj);
        setCurrentWordIndex(initialState.currentWordIndex);
        setAverageDuration(initialState.averageDuration);
        setLoadingTranscription(initialState.loadingTranscription);
        setkiStutteredRegions(initialState.kiStutteredRegions);
        setLongest3Durations(initialState.longest3Durations);
        setCustomNotes(initialState.customNotes);
    }

    const stateSetters = {
        audioFile: setAudioFile,
        audioFileName: setAudioFileName,
        audioPlayerControl: setAudioPlayerControl,
        averageDuration: setAverageDuration,
        customNotes: setCustomNotes,
        currentWordIndex: setCurrentWordIndex,
        fileChosen: setFileChosen,
        kiStutteredRegions: setkiStutteredRegions,
        loadingTranscription: setLoadingTranscription,
        longest3Durations: setLongest3Durations,
        mode: setMode,
        percentSS: setPercentSS,
        playBackSpeed: setPlayBackSpeed,
        speechSampleContext: setSpeechSampleContext,
        stutteredEvents: setStutteredEvents,
        stutteredEventsCount: setStutteredEventsCount,
        totalSyllableCount: setTotalSyllableCount,
        transcriptionObj: setTranscriptionObj,
        workspaceName: setWorkspaceName,
    };


    const updateStateFromObject = (dbWorkspaceObj) => {
        for (let key in dbWorkspaceObj) {
            if (stateSetters[key]) {
                stateSetters[key](dbWorkspaceObj[key]);
            }
        }
    };

    const updateWorkspace = async (name) => {
        const workspaceColDocRef = doc(db, 'users', user.uid, 'workspaces', workspaceId);
        const workspaceIndexDocRef = doc(db, 'users', user.uid, 'workspaces_index', workspaceId);
        const workspaceObject = {
            workspaceName: name,
            stutteredEventsCount: stutteredEventsCount,
            percentSS: percentSS,
            stutteredEvents: stutteredEvents,
            totalSyllableCount: totalSyllableCount,
            transcriptionObj: transcriptionObj,
            currentWordIndex: currentWordIndex,
            averageDuration: averageDuration,
            loadingTranscription: loadingTranscription,
            mode: mode,
            speechSampleContext: speechSampleContext,
            audioFileName: audioFileName,
            kiStutteredRegions: kiStutteredRegions,
            fileChosen: fileChosen,
            longest3Durations: longest3Durations,
            playBackSpeed: playBackSpeed,
            customNotes: customNotes,
        }
        try {
            setWorkspaceName(name);
            await updateDoc(workspaceColDocRef, workspaceObject);
            await updateDoc(workspaceIndexDocRef, {name: name});
            setWsSaveStatus(UPD_WS_STATUS.SUCCESS);
            const timer = setTimeout(() => {
                setWsSaveStatus(UPD_WS_STATUS.IDLE);
            }, 1000);

            return () => clearTimeout(timer);
        } catch (e) {
            setWsSaveStatus(UPD_WS_STATUS.ERROR);
            console.log("trouble updating doc:", e);
        }

    };

    const createNewWorkspace = async (name, transcriptionObj) => {
        //db references
        const workspacesColRef = collection(db, 'users', user.uid, 'workspaces');
        const workspacesIndexColRef = collection(db, 'users', user.uid, 'workspaces_index');
        const firestoreTime = serverTimestamp();
        //handle workspaces collections
        const data = {
            name: name,
            creation_time: firestoreTime,
            audio_file_name: audioFileName,
            speechSampleContext: speechSampleContext,
        };
        const workspaceObject = {
            workspaceName: name,
            stutteredEventsCount: stutteredEventsCount,
            stutteredEvents: stutteredEvents,
            totalSyllableCount: totalSyllableCount,
            transcriptionObj: transcriptionObj,
            currentWordIndex: currentWordIndex,
            averageDuration: averageDuration,
            loadingTranscription: loadingTranscription,
            mode: mode,
            speechSampleContext: speechSampleContext,
            audioFileName: audioFileName,
            kiStutteredRegions: kiStutteredRegions,
            fileChosen: fileChosen,
            longest3Durations: longest3Durations,
            playBackSpeed: playBackSpeed,
            customNotes: '',
        }
        //add workspace first then if successful add workspace_index doc
        try {
            const docData = await addDoc(workspacesColRef, workspaceObject)
            const docRef = doc(workspacesIndexColRef, docData.id);
            await setDoc(docRef, data);
            setWorkspaceId(docData.id);
            setWorkspaceName(name);
            setExpanded(false);
            setWorkspaceExpanded(true);
        } catch (error) {
            console.log("Trouble with workspaces or workspaces index:", error)
        }

    };

    const handleStutteredChange = (change) => {
        setStutteredEventsCount(prevCount => {
            const newCount = prevCount + change;
            const syllables = countTotalSyllables();
            const percent = (newCount/syllables)*100
            setPercentSS(parseFloat(Number(percent).toFixed(2)));
        });

    };

    const addStutteredEvent = (word_obj, type, syllable_count, ps, newWord, wordIndex) => {
        const duration = word_obj.end - word_obj.start;
        const eventItem = {type: type, duration: duration, ps: ps, text: newWord, uid: wordIndex};
        if (!stutteredEvents.some((obj) => obj.uid === wordIndex)) {
            setStutteredEvents(prevEvents => [...prevEvents, {...eventItem, id: prevEvents.length + 1}])
            handleStutteredChange(1)
        }
    };


    const addStutteredEventWaveForm = (region, syllableCount, ps, text, type) => {
        const duration = region.end - region.start;
        const eventItem = {
            duration: duration,
            syllable_count: syllableCount,
            ps: ps,
            text: text,
            type: type,
            id: region.id
        };
        if (!stutteredEvents[region.id]) {
            setStutteredEvents(prevEvents => ({...prevEvents, [region.id]: eventItem}));
            handleStutteredChange(1)
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

    const removeStutteredEvent = (wordIndex) => {
        setStutteredEvents(prevList => prevList.filter(word_obj => word_obj.id !== wordIndex));
        if (stutteredEvents) {
            handleStutteredChange(-1);
        }
    };

    const removeStutteredEventsWaveForm = (region) => {
        setStutteredEvents(prevEvents => {
            const newEvents = {...prevEvents};
            delete newEvents[region.id];
            return newEvents;
        });
        handleStutteredChange(-1);
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
        return sum;
    };

    const configureDurations = () => {
        const durations = Object.entries(kiStutteredRegions).map(([key, value]) => {
            return Number((value.duration).toFixed(2));
        })
        durations.sort((a, b) => b - a);
        let topThree = durations.slice(0, 3);
        const average = Number((topThree.reduce((a, b) => a + b, 0) / topThree.length).toFixed(2));
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


    const get_transcription = async () => {
        setLoadingTranscription(true);
        const formData = new FormData();
        formData.append('file', audioFile);

        try {
            const response = await axios.post(`${BASE_URL}/${ENDPOINTS.AUTO_TRANSCRIPTION}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const transcriptionObj = response.data.transcription_obj;
            setTranscriptionObj(transcriptionObj);
            countTotalSyllables();
            setLoadingTranscription(false);

            return transcriptionObj;
        } catch (error) {
            console.log("ERROR handling get_transcription:", error);
            setLoadingTranscription(false);
            return null;
        }
    };

    useEffect(() => {
        //Set Duration
        if (Object.keys(kiStutteredRegions).length >= 1) {
            configureDurations();
        }

        if (Object.keys(kiStutteredRegions).length >= 0 && transcriptionObj) {
            transcriptError();
            const percent = (stutteredEventsCount/totalSyllableCount)*100
        }

    }, [totalSyllableCount, stutteredEventsCount, kiStutteredRegions]);


    useEffect(() => {
        setStutteredEventsCount(Object.keys(stutteredEvents).length);
    }, [stutteredEvents]);

    const updateWorkspacesIndex = async () => {
        const workspacesIndexTemp = {};
        const workspacesIndexRef = collection(db, 'users', user.uid, 'workspaces_index');
        const workspacesIndexDocs = await getDocs(workspacesIndexRef);
        workspacesIndexDocs.docs.forEach((doc) => {
            workspacesIndexTemp[doc.id] = doc.data();
        });

        setWorkspacesIndex(workspacesIndexTemp);
    }

    useEffect(() => {
        if (workspaceName){
            const update = async () => {
                try {
                    await updateWorkspace(workspaceName);
                } catch (error) {
                    console.log("Unable to save notes to db");
                }
            }

            update().then();
        }

    }, [customNotes]);

    useEffect(() => {
        (async () => {
            if (isCreateNewWorkspace) {
                try {
                    setStutteredEventsCount(initialState.stutteredEventsCount);
                    setStutteredEvents(initialState.stutteredEvents);
                    setTotalSyllableCount(initialState.totalSyllableCount);
                    setTranscriptionObj(initialState.transcriptionObj);
                    setCurrentWordIndex(initialState.currentWordIndex);
                    setAverageDuration(initialState.averageDuration);
                    setLoadingTranscription(initialState.loadingTranscription);
                    setkiStutteredRegions(initialState.kiStutteredRegions);
                    setLongest3Durations(initialState.longest3Durations);
                    setCustomNotes(initialState.customNotes);

                    const transcriptObj = await get_transcription();
                    await createNewWorkspace(workspaceName, transcriptObj);
                    await updateWorkspacesIndex();
                    setIsCreateNewWorkspace(false);
                    setWorkspaceExpanded(true);
                } catch (error) {
                    console.log("TROUBLE CREATING WORKSPACE", error);
                }

            }
        })();
    }, [isCreateNewWorkspace]);

    useEffect(() => {
        if (loadWorkspaceByObj) {
            updateStateFromObject(loadWorkspaceByObj);
        }
    }, [loadWorkspaceByObj])


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
                    (wordEnd >= regionStart && wordEnd <= regionEnd)) {
                    transcriptionNew[tKey].stuttered = true;
                    return true;
                }
                return false;
            });
        });
        setTranscriptionObj(transcriptionNew);
    };

    const contextValues = {
            addStutteredEvent,
            addStutteredEventWaveForm,
            audioFile,
            audioFileName,
            audioPlayerControl,
            averageDuration,
            countTotalSyllables,
            currentWordIndex,
            fileChosen,
            get_transcription,
            handleStutteredChange,
            handleWordUpdate,
            kiStutteredRegions,
            loadingTranscription,
            longest3Durations,
            mode,
            playBackSpeed,
            removeStutteredEvent,
            removeStutteredEventsWaveForm,
            resetTransAndSE,
            setAdjustedSyllableCount,
            setAudioFile,
            setAudioFileName,
            setAudioPlayerControl,
            setCurrentWordIndex,
            setFileChosen,
            setLoadingTranscription,
            setkiStutteredRegions,
            setMode,
            setPlayBackSpeed,
            setStutteredEventsCount,
            setTotalSyllableCount,
            setTranscriptionObj,
            setWorkspaceName,
            stutteredEvents,
            stutteredEventsCount,
            totalSyllableCount,
            transcriptionObj,
            transcriptError,
            updateStutteredEventWaveForm,
            updateStateFromObject,
            updateWorkspace,
            workspaceName,
            createNewWorkspace,
            isLoadingWorkspace,
            setIsLoadingWorkspace,
            workspaceId,
            percentSS,
            setCustomNotes,
            customNotes,
            wsSaveStatus,
            setAudioFileDuration,
            audioFileDuration,
            speechSampleContext
        }
        return (
            <StutteredContext.Provider value={contextValues}>
                {children}
            </StutteredContext.Provider>
        );
    }
;
