import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
    useMemo, useContext,
} from "react";
import {WaveSurfer, WaveForm, Marker, Region} from "wavesurfer-react";
import "./styles.css";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min";
import MarkersPlugin from "wavesurfer.js/src/plugin/markers";
import {Box, Button, Slider, Stack, Typography} from "@mui/material";
import MainCard from "../../components/MainCard";
import ZoomIn from '@mui/icons-material/ZoomIn';
import ZoomOut from '@mui/icons-material/ZoomOut';
import Speed from '@mui/icons-material/Speed';
import axios from 'axios';
import {StutteredContext} from "../../context/StutteredContext";
import {MANUAL} from "../../constants";

const AudioPlayer = ({setSS, setNSS}) => {
    // VARIABLES
    const [timelineVis, setTimelineVis] = useState(true);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [markers, setMarkers] = useState([]);
    const wavesurferRef = useRef();
    const [audioFile, setAudioFile] = useState(null);

    const {
        countTotalSyllables,
        setTranscriptionObj,
        transcriptionObj,
        setLoadingTranscription,
        setCurrentWordIndex,
        currentWordIndex,
        mode,
        setAudioFileName,
        kiStutteredRegions,
        setkiStutteredEventTimes,
        setFileChosen,
    } = useContext(StutteredContext);

    const waveformProps = {
        id: "waveform",
        cursorColor: "#000",
        cursorWidth: 2,
    }

    //FUNCTIONS
    const plugins = useMemo(() => {
        return [
            {
                plugin: RegionsPlugin,
                options: {dragSelection: false}
            },
            timelineVis && {
                plugin: TimelinePlugin,
                options: {
                    container: "#timeline",
                    timeInterval: 1
                }
            },
            {
                plugin: MarkersPlugin,
                options: {draggable: false}
            },
        ].filter(Boolean);
    }, [timelineVis]);

    const toggleTimeline = useCallback(() => {
        setTimelineVis(prevTimelineVis => !prevTimelineVis);
    }, []);

    const zoomInHandler = (event, value) => {
        setZoomLevel(value);
        if (wavesurferRef.current) {
            wavesurferRef.current.zoom(value);
        }
    };

    const handleWSMount = useCallback(
        (waveSurfer) => {
            if (waveSurfer.markers) {
                waveSurfer.clearMarkers();
            }
            console.log("WS MOUNT");
            wavesurferRef.current = waveSurfer;

            if (wavesurferRef.current) {
                // wavesurferRef.current.on("region-created", regionCreatedHandler);

                wavesurferRef.current.on("ready", () => {
                    console.log("WaveSurfer is ready");
                });

                wavesurferRef.current.on("region-removed", (region) => {
                    console.log("region-removed --> ", region);
                });

                wavesurferRef.current.on("loading", (data) => {
                    console.log("loading --> ", data);
                });
                if (window) {
                    window.surferidze = wavesurferRef.current;
                }
            }
        },
        [wavesurferRef]
    );

    const removeLastMarker = useCallback(() => {
        setMarkers(prevMarkers => {
            let nextMarkers = [...prevMarkers];
            nextMarkers.pop();
            return nextMarkers;
        });
    }, []);

    const play = useCallback(() => {
        if (wavesurferRef.current) {
            wavesurferRef.current.playPause();
            wavesurferRef.current.setPlaybackRate(playbackSpeed);
        }
    }, [playbackSpeed]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) {
            setFileChosen(false);
            return;
        }
        setAudioFile(file);
        setAudioFileName(file.name);
        setFileChosen(true);
        const reader = new FileReader();
        reader.onloadend = () => {
            if (wavesurferRef.current) {
                wavesurferRef.current.loadBlob(new Blob([reader.result]));
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const valuetext = (value) => {
        return value;
    };

    const playbackSpeedHandler = (event, value) => {
        console.log("Playback Speed", value);
        console.log(wavesurferRef.current.getCurrentTime());
        wavesurferRef.current.setPlaybackRate(value);
        setPlaybackSpeed(value);
    };

    // BACKEND CALLS
    const get_transcription = () => {
        setLoadingTranscription(true);
        const formData = new FormData();
        console.log(audioFile.name);
        formData.append('file', audioFile);
        axios.post('http://127.0.0.1:5000/get_transcription', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(response => {
            const transcriptionObj = response.data.transcription_obj;
            console.log("TRANSCRIPTION OBJ: ", transcriptionObj);
            setTranscriptionObj(transcriptionObj);
            countTotalSyllables();
            setLoadingTranscription(false);

        }).catch(error => {
            console.log("ERROR handling get_transcription:", error);
            setLoadingTranscription(false);
        });
    };

    const handleKeyPress = (event) => {
        if (wavesurferRef.current) {
            if (event.key === 's') {
                const time  = wavesurferRef.current.getCurrentTime();
                setSS(prevValue => prevValue + 1);
                addStutteredTime(time);
            }
            if (event.key === 'n') {
                setNSS(prevValue => prevValue + 1);
            }
            if (event.key === " ") {
                event.preventDefault();
                wavesurferRef.current.playPause();
            }
        }
    };

    const addStutteredTime = (time) => {
        setkiStutteredEventTimes(prevTimes => {
            const newList = [...prevTimes, time];
            newList.sort((a, b) => a - b);
            return newList;
        })
    };

    const handleRegionUpdate = useCallback((region, smth) => {
      console.log("Dragging Region", region);
        console.log(smth);
    },[]);
    // USE EFFECT
    useEffect(() => {
        if (transcriptionObj) {
            wavesurferRef.current.on('audioprocess', function (time) {
                let newWordIndex = null;
                Object.keys(transcriptionObj).forEach((key) => {
                    if (time >= transcriptionObj[key].start && time <= transcriptionObj[key].end) {
                        newWordIndex = parseInt(key);
                    }
                });

                if (newWordIndex !== currentWordIndex) {
                    setCurrentWordIndex(newWordIndex);
                }
            });
        }

        if (transcriptionObj && wavesurferRef.current) {
            wavesurferRef.current.on("seek", () => {
                const time = wavesurferRef.current.getCurrentTime();
                let newWordIndex = null;
                if (transcriptionObj) {
                    Object.keys(transcriptionObj).forEach((key) => {
                        if (time >= transcriptionObj[key].start && time <= transcriptionObj[key].end) {
                            newWordIndex = key;
                        }
                    });
                    if (newWordIndex !== currentWordIndex) {
                        setCurrentWordIndex(newWordIndex);
                    }
                }
            });
        }

        window.addEventListener('keypress', handleKeyPress);
        return () => {
            window.removeEventListener('keypress', handleKeyPress);
            if (wavesurferRef.current) {
                wavesurferRef.current.un('audioprocess');
                if (transcriptionObj && wavesurferRef.current) {
                    wavesurferRef.current.un("seek");
                }
            }
        }
    }, [wavesurferRef, transcriptionObj]);

    return (
        <MainCard>
            <Stack>
                {audioFile ? (
                    <WaveSurfer plugins={plugins} onMount={handleWSMount}>
                        <WaveForm {...waveformProps}>
                            {markers.map((marker) => (
                                <Marker
                                    key={marker.label}
                                    {...marker}
                                />
                            ))}
                            {kiStutteredRegions.map((regionProps) => (
                                <Region
                                    key={regionProps.id}
                                    {...regionProps}
                                    onUpdateEnd={handleRegionUpdate}
                                />
                            ))}
                        </WaveForm>
                        <div id="timeline"/>
                    </WaveSurfer>
                ) : (
                    <Box sx={{height: 128, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <Typography variant={"h2"}>Upload an audio file to get started!</Typography>
                    </Box>
                )}

                <Box sx={{height: 10}}/>
                <Stack spacing={1} direction={"row"}>
                    <Speed/>
                    <Box sx={{width: 100}}>
                        <Slider
                            aria-label="playbackspeed"
                            defaultValue={1}
                            getAriaValueText={valuetext}
                            valueLabelDisplay="auto"
                            step={.1}
                            marks
                            min={.3}
                            max={1}
                            value={playbackSpeed}
                            onChange={playbackSpeedHandler}
                            disabled={!audioFile}
                            sx={{width: 90, mr: 10}}
                        />
                    </Box>
                    <Button variant={"contained"} onClick={(event) => {
                        play();
                        event.currentTarget.blur();
                    }}
                            disabled={!audioFile}>Play / Pause</Button>
                    <Button variant={"contained"} onClick={(event)=>{
                        removeLastMarker();
                        event.currentTarget.blur();
                    }} disabled={!audioFile}>Remove last
                        marker</Button>
                    <Button variant={"contained"} onClick={(event)=>{
                        toggleTimeline();
                        event.currentTarget.blur();
                    }} disabled={!audioFile}>
                        Toggle
                        timeline</Button>
                    <Button disabled={mode===''} variant={"contained"} component={"label"} onClick={(event) => {
                    event.currentTarget.blur();
                    }}>
                        Choose File
                        <input
                            type={"file"}
                            hidden
                            onChange={handleFileChange}
                        />
                    </Button>
                    <Button variant={"contained"}
                            onClick={(event)=> {
                                get_transcription();
                                event.currentTarget.blur();
                            }}
                            disabled={audioFile === null || mode === MANUAL}>
                        Get Transcription
                    </Button>
                    <ZoomOut/>
                    <Box sx={{width: 100}}>
                        <Slider
                            aria-label="Zoom"
                            defaultValue={1}
                            min={0} // Adjust the minimum zoom level according to your needs
                            max={100} // Adjust the maximum zoom level according to your needs
                            value={zoomLevel}
                            onChange={zoomInHandler}
                            disabled={!audioFile}
                        />
                    </Box>
                    <ZoomIn/>
                </Stack>
            </Stack>
        </MainCard>
    );
}

export default AudioPlayer;
