import React, {useState, createContext, useEffect, useContext} from "react";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where
} from "firebase/firestore";
import {db} from "../FirebaseConfig";
import {UserContext} from "./UserContext";
import axios from "axios";
import {BASE_URL} from "../constants";

export const StutteredContext = createContext();



export const StutteredProvider = ({children}) => {
        // VARIABLES
    const initialState = {
        stutteredEventsCount: 0,
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
        playBackSpeed: 1,
        workspaceId: null,
        globalYesNo: false,
    }
        const [workspaceName, setWorkspaceName] = useState('');
        const [stutteredEventsCount, setStutteredEventsCount] = useState(initialState.stutteredEventsCount);
        const [stutteredEvents, setStutteredEvents] = useState({});
        const [totalSyllableCount, setTotalSyllableCount] = useState(initialState.totalSyllableCount);
        const [transcriptionObj, setTranscriptionObj] = useState(initialState.transcriptionObj);
        const [currentWordIndex, setCurrentWordIndex] = useState(initialState.currentWordIndex);
        const [averageDuration, setAverageDuration] = useState(initialState.averageDuration);
        const [loadingTranscription, setLoadingTranscription] = useState(initialState.loadingTranscription);
        const [mode, setMode] = useState(initialState.mode);
        const [audioFileName, setAudioFileName] = useState(initialState.audioFileName);
        const [audioFile, setAudioFile] = useState(initialState.audioFile);
        const [kiStutteredRegions, setkiStutteredRegions] = useState(initialState.kiStutteredRegions);
        const [fileChosen, setFileChosen] = useState(initialState.fileChosen);
        const [longest3Durations, setLongest3Durations] = useState(initialState.longest3Durations);
        const [audioPlayerControl, setAudioPlayerControl] = useState(initialState.audioPlayerControl);
        const [playBackSpeed, setPlayBackSpeed] = useState(initialState.playBackSpeed);
        const [workspaceId, setWorkspaceId] = useState(initialState.workspaceId);
        const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(false);
        // const [globalYesNo, setGlobalYesNo] = useState(initialState.globalYesNo);
        const {user} = useContext(UserContext);
        //FUNCTIONS
        const resetTransAndSE = async () => {
            setStutteredEventsCount(initialState.stutteredEventsCount);
            setStutteredEvents(initialState.stutteredEvents);
            setTotalSyllableCount(initialState.totalSyllableCount);
            setTranscriptionObj(initialState.transcriptionObj);
            setCurrentWordIndex(initialState.currentWordIndex);
            setAverageDuration(initialState.averageDuration);
            setLoadingTranscription(initialState.loadingTranscription);
            setkiStutteredRegions(initialState.kiStutteredRegions);
            setLongest3Durations(initialState.longest3Durations);
        }

        const stateSetters = {
            workspaceName: setWorkspaceName,
            stutteredEventsCount: setStutteredEventsCount,
            stutteredEvents: setStutteredEvents,
            totalSyllableCount: setTotalSyllableCount,
            transcriptionObj: setTranscriptionObj,
            currentWordIndex: setCurrentWordIndex,
            averageDuration: setAverageDuration,
            loadingTranscription: setLoadingTranscription,
            mode: setMode,
            audioFileName: setAudioFileName,
            audioFile: setAudioFile,
            kiStutteredRegions: setkiStutteredRegions,
            fileChosen: setFileChosen,
            longest3Durations: setLongest3Durations,
            audioPlayerControl: setAudioPlayerControl,
            playBackSpeed: setPlayBackSpeed,
        }

        const updateStateFromObject = (dbWorkspaceObj) => {
            for (let key in dbWorkspaceObj) {
                if (stateSetters[key]) {
                    stateSetters[key](dbWorkspaceObj[key]);
                }
            }
        };

        const updateWorkspace = async (name) => {
            console.log("updating workspace: ", name);
            const workspaceColDocRef = doc(db, 'users', user.uid, 'workspaces', workspaceId);
            const workspaceIndexDocRef = doc(db, 'users', user.uid, 'workspaces_index', workspaceId);
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
                audioFileName: audioFileName,
                kiStutteredRegions: kiStutteredRegions,
                fileChosen: fileChosen,
                longest3Durations: longest3Durations,
                playBackSpeed: playBackSpeed
            }
            try {
                await updateDoc(workspaceColDocRef, workspaceObject);
                await updateDoc(workspaceIndexDocRef, {name: name});
            } catch (e) {
                console.log("trouble updating doc:", e);
            }

            //update workspace data


            //update workspace_index
        };

        const createNewWorkspace = async (name) => {
            //db references
            const workspacesColRef = collection(db, 'users', user.uid, 'workspaces');
            const workspacesIndexColRef = collection(db, 'users', user.uid, 'workspaces_index');
            const firestoreTime = serverTimestamp();
            //handle workspaces collections
            const data = {name: name, creation_time: firestoreTime};
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
                audioFileName: audioFileName,
                kiStutteredRegions: kiStutteredRegions,
                fileChosen: fileChosen,
                longest3Durations: longest3Durations,
                playBackSpeed: playBackSpeed
            }
            //add workspace first then if successful add workspace_index doc
            addDoc(workspacesColRef, workspaceObject).then((docData) => {
                //handle workspaced_index
                const docRef = doc(db, "users", user.uid, "workspaces_index", docData.id);
                setDoc(docRef, data).then(() => {
                    setWorkspaceId(docData.id);
                    console.log("NAME:", name);
                    setWorkspaceName(name);
                }).catch(e => {
                    alert("trouble saving" + e);
                });
            });
        };

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
                setStutteredEventsCount(prevCount => prevCount - 1)
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

        const get_transcription = async () => {
            setLoadingTranscription(true);
            const formData = new FormData();
            formData.append('file', audioFile);
            const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
            await delay(1500);
            axios.post(`${BASE_URL}/get_transcription2`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then(response => {
                const transcriptionObj = response.data.transcription_obj;
                setTranscriptionObj(transcriptionObj);
                countTotalSyllables();
                setLoadingTranscription(false);

            }).catch(error => {
                console.log("ERROR handling get_transcription:", error);
                setLoadingTranscription(false);
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
            setStutteredEventsCount(Object.keys(stutteredEvents).length);
        }, [stutteredEvents]);

        //This use Effect handles the updating of a workspace when user manually saves
        useEffect(() => {
            (async () => {
                try {
                    await updateWorkspace(workspaceName);
                } catch (error) {
                    console.log("TROUBLE UPDATING WORKSPACE:", error);
                }
            })();
        }, [workspaceName]);

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
            randomFunction,
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
            workspaceName,
            createNewWorkspace,
            isLoadingWorkspace,
            setIsLoadingWorkspace,
            setWorkspaceId,
            workspaceId,
        }

        return (
            <StutteredContext.Provider value={contextValues}>
                {children}
            </StutteredContext.Provider>
        );
    }
;
