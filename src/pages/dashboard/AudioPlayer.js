import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
    useMemo, useContext,
} from "react";
import {WaveSurfer, WaveForm, Region, Marker} from "wavesurfer-react";
import "./styles.css";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min";
import MarkersPlugin from "wavesurfer.js/src/plugin/markers";
import {Box, Button, FormControl, InputLabel, MenuItem, Select, Slider, Stack, Switch, Typography} from "@mui/material";
import MainCard from "../../components/MainCard";
import ZoomIn from '@mui/icons-material/ZoomIn';
import ZoomOut from '@mui/icons-material/ZoomOut';
import Speed from '@mui/icons-material/Speed';
import axios from 'axios';
import {CircularProgress} from "@mui/material";
import WordComponent from "./WordComponent";
import {StutteredContext} from "../../context/StutteredContext";
import ModeSwitch from "../../components/ModeSwitch";
/**
 * @param min
 * @param max
 * @returns {*}
 */

/**
 * @param distance
 * @param min
 * @param max
 * @returns {([*, *]|[*, *])|*[]}
 */

const AudioPlayer = ({setSS, setNSS}) => {
    // VARIABLES
    const [timelineVis, setTimelineVis] = useState(true);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [currentWordIndex, setCurrentWordIndex] = useState(1);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [markers, setMarkers] = useState([]);
    const wavesurferRef = useRef();
    const [audioFile, setAudioFile] = useState(null);
    const [loadingTranscription, setLoadingTranscription] = useState(false);
    const { countTotalSyllables, setTranscriptionObj, transcriptionObj } = useContext(StutteredContext);
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
                    timeInterval: .1
                }
            },
            {
                plugin: MarkersPlugin,
                options: {draggable: true}
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

    const handleUpdateWord = (index, newWord) => {
        setTranscriptionObj(prevTranscription => {
            const updatedTranscription = {...prevTranscription};
            updatedTranscription[index].text = newWord;
            return updatedTranscription;
        });
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
        setAudioFile(file);
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
            setTranscriptionObj(transcriptionObj);
            countTotalSyllables();
            setLoadingTranscription(false);

        }).catch(error => {
            console.log("ERROR handling get_transcription:", error);
            setLoadingTranscription(false);
        });
    };

    const handleKeyPress = (event)=>  {
        if (wavesurferRef.current) {
            if (event.key === 's') {
                setSS(prevValue => prevValue + 1);
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

    // USE EFFECT
    useEffect(() => {
        if (transcriptionObj) {
            wavesurferRef.current.on('audioprocess', function (time) {
                let newWordIndex = null;
                Object.keys(transcriptionObj).forEach((key) => {
                    if (time >= transcriptionObj[key].start && time <= transcriptionObj[key].end) {
                        newWordIndex = key;
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
                    Object.keys(transcriptionObj).map((key) => {
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

        if (transcriptionObj !== null){
            countTotalSyllables();
        }
        window.addEventListener('keypress', handleKeyPress);
        return () => {
            window.removeEventListener('keypress', handleKeyPress);
            if(wavesurferRef.current) {
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
                    {/*<Button variant={"contained"} onClick={generateMarker}>Generate Marker</Button>*/}
                    <Button variant={"contained"} onClick={(event) => {
                            play();
                            event.currentTarget.blur();
                        }}
                            disabled={!audioFile}>Play / Pause</Button>
                    <Button variant={"contained"} onClick={removeLastMarker} disabled={!audioFile}>Remove last
                        marker</Button>
                    <Button variant={"contained"} onClick={toggleTimeline} disabled={!audioFile}>Toggle
                        timeline</Button>
                    <Button variant={"contained"} component={"label"}>
                        Choose File
                        <input
                            type={"file"}
                            hidden
                            onChange={handleFileChange}
                        />
                    </Button>
                    <Button variant={"contained"}
                            onClick={get_transcription}
                            disabled={audioFile === null}>
                        Get Transcription
                    </Button>
                    <ZoomOut/>
                    <Box sx={{width: 100}}>
                        <Slider
                            aria-label="Zoom"
                            defaultValue={1}
                            // getAriaValueText={valuetext}
                            // valueLabelDisplay="auto"
                            // step={10} // Adjust the step according to your needs
                            min={0} // Adjust the minimum zoom level according to your needs
                            max={100} // Adjust the maximum zoom level according to your needs
                            value={zoomLevel}
                            onChange={zoomInHandler}
                            disabled={!audioFile}
                        />
                    </Box>
                    <ZoomIn/>
                </Stack>
                {loadingTranscription ? (
                    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', pt: 2}}>
                        <CircularProgress/>
                    </Box>
                ) : (
                    <Box sx={{pt: 2}}>
                        {transcriptionObj &&
                            <Typography variant={"h4"}>
                                {Object.keys(transcriptionObj).map((key) => (
                                    <React.Fragment key={key}>
                                        <WordComponent
                                            word={transcriptionObj[key].text}
                                            word_obj={transcriptionObj[key]}
                                            onUpdateWord={handleUpdateWord}
                                            index={key}
                                            style={{backgroundColor: currentWordIndex === key ? '#ADD8E6' : 'transparent'}}>
                                        </WordComponent>{" "}
                                    </React.Fragment>
                                ))}
                            </Typography>
                        }
                    </Box>
                )}
            </Stack>
        </MainCard>
    );
}

export default AudioPlayer;
