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
import {Box, Button, Popover, Slider, Stack, Typography} from "@mui/material";
import MainCard from "../../components/MainCard";
import ZoomIn from '@mui/icons-material/ZoomIn';
import ZoomOut from '@mui/icons-material/ZoomOut';
import Speed from '@mui/icons-material/Speed';
import axios from 'axios';
import {StutteredContext} from "../../context/StutteredContext";
import {MANUAL} from "../../constants";
import AudioPlayerPopover from "./popovers/AudioPlayerPopover";

const AudioPlayer = () => {
    // VARIABLES
    const [timelineVis, setTimelineVis] = useState(true);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [markers, setMarkers] = useState([]);
    const [creatingRegion, setCreatingRegion] = useState(null);
    const [isCreatingRegion, setIsCreatingRegion] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const wavesurferRef = useRef();
    const [currentRegion, setCurrentRegion] = useState(null);
    const [stutteredWords, setStutteredWords] = useState({});
    const [popoverKey, setPopoverKey] = useState(null);
    const [popoverColor, setPopoverColor] = useState(false);

    const {
        countTotalSyllables,
        setTranscriptionObj,
        transcriptionObj,
        setLoadingTranscription,
        setCurrentWordIndex,
        currentWordIndex,
        mode,
        audioFile,
        kiStutteredRegions,
        setkiStutteredRegions,
        setAudioPlayerControl,
        setPlayBackSpeed,
        playBackSpeed,
        stutteredEvents
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
                    timeInterval: .1
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

    const handlePopoverOpen = (region, smth) => {
        console.log("Stuttered words:", )
        const anchorElement = smth.currentTarget;
        if (anchorElement) {
            console.log("REGION", region);
            setPopoverOpen(true);
            setAnchorEl(anchorElement);
            setCurrentRegion(region);
            setPopoverKey(region.id);
        }
        setStutteredWords(getStutteredWordsFromRegion(region));
    }

    const play = useCallback(() => {
        if (wavesurferRef.current) {
            wavesurferRef.current.playPause();
            wavesurferRef.current.setPlaybackRate(playBackSpeed);
        }
    }, [playBackSpeed]);

    const loadAudioFile = (file) => {
        console.log("Setting Audio File");
        if (file && wavesurferRef.current) {
            const reader = new FileReader();
            reader.onloadend = () => {
                wavesurferRef.current.loadBlob(new Blob([reader.result]));
            }
            reader.readAsArrayBuffer(file)
        }
    };

    const valuetext = (value) => {
        return value;
    };

    const playbackSpeedHandler = useCallback((event, value) => {
        console.log("Playback Speed", value);
        console.log(wavesurferRef.current.getCurrentTime());
        wavesurferRef.current.setPlaybackRate(value);
        setPlayBackSpeed(value);
    }, [playBackSpeed]);

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
            // console.log("TRANSCRIPTION OBJ: ", transcriptionObj);
            setTranscriptionObj(transcriptionObj);
            countTotalSyllables();
            setLoadingTranscription(false);

        }).catch(error => {
            console.log("ERROR handling get_transcription:", error);
            setLoadingTranscription(false);
        });
    };

    const playPause = () => {
        if (wavesurferRef.current !== null) {
            wavesurferRef.current.playPause();
        }
    }

    const handleKeyPress = (event) => {
        if (wavesurferRef.current) {
            if (event.key === 's') {
                const time = wavesurferRef.current.getCurrentTime();
                if (!isCreatingRegion) {
                    const newRegionTemp = {start: time};
                    setIsCreatingRegion(true);
                    setCreatingRegion(newRegionTemp);
                } else {
                    const duration = time - creatingRegion.start;
                    const region = {
                        start: creatingRegion.start,
                        end: time,
                        duration: duration,
                        color: "rgba(0, 0, 0, .2)"
                    };
                    const id = Object.keys(kiStutteredRegions).length;
                    setkiStutteredRegions(prevRegions => ({
                        ...prevRegions,
                        [id]: region
                    }));

                    setCreatingRegion(null);
                    setIsCreatingRegion(false);
                }
            }

            if (event.key === " ") {
                event.preventDefault();
                playPause();
            }
        }
    };

    const handleRegionUpdate = useCallback((region, smth) => {
        console.log("Dragging Region", region.id);
        let changeRegion = kiStutteredRegions[region.id];
        console.log("Change regions", changeRegion);
        const duration = region.end - region.start;
        changeRegion.start = region.start;
        changeRegion.end = region.end;
        changeRegion.duration = duration;
        setkiStutteredRegions(prevRegions => {
            return {
                ...prevRegions,
                [region.id]: changeRegion
            }
        });
    }, [kiStutteredRegions]);


    const getStutteredWordsFromRegion = (region) => {
        const words =  Object.keys(transcriptionObj).filter(key => {
            const regionStart = region.start;
            const regionEnd = region.end;
            const word = transcriptionObj[key];
            return (word.start >= regionStart && word.start <= regionEnd) ||
                (word.end >= regionStart && word.end <= regionEnd);
        }).reduce((result, key) => {
            result[key] = transcriptionObj[key];
            return result;
        }, {})
        return words;
    };


    // USE EFFECTS
    useEffect(() => {
        loadAudioFile(audioFile);
        if (wavesurferRef.current !== null) {
            setAudioPlayerControl({
                playPause: playPause
            });
        }
    }, [audioFile]);

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

        if (wavesurferRef.current) {
            wavesurferRef.current.setPlaybackRate(playBackSpeed);
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
    }, [wavesurferRef, transcriptionObj, handleKeyPress, playBackSpeed, kiStutteredRegions]);

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
                            {Object.entries(kiStutteredRegions).map(([id, regionProps]) => {
                                return (
                                    <Region
                                        key={id}
                                        id={id}
                                        {...regionProps}
                                        onUpdateEnd={handleRegionUpdate}
                                        onClick={handlePopoverOpen}

                                    />
                                )
                            })}
                            {anchorEl && currentRegion && (
                                <AudioPlayerPopover
                                    key={popoverKey}
                                    anchorEl={anchorEl}
                                    setAnchorEl={setAnchorEl}
                                    popoverOpen={Boolean(anchorEl)}
                                    setPopoverOpen={setPopoverOpen}
                                    stutteredWords={stutteredWords}
                                    region={currentRegion}
                                    exists={stutteredEvents[currentRegion.id]}
                                    // setPopoverColor={setPopoverColor}
                                />
                            )}

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
                            min={.4}
                            max={1}
                            value={playBackSpeed}
                            onChange={(event, value) => {
                                console.log("Getting hit here?");
                                playbackSpeedHandler(event, value);
                            }}
                            disabled={!audioFile}
                            sx={{width: 90, mr: 10}}
                        />
                    </Box>
                    <Button variant={"contained"} onClick={(event) => {
                        play();
                        event.currentTarget.blur();
                    }}
                            disabled={!audioFile}>Play / Pause</Button>
                    <Button variant={"contained"} onClick={(event) => {
                        toggleTimeline();
                        event.currentTarget.blur();
                    }} disabled={!audioFile}>
                        Toggle
                        timeline</Button>
                    <Button variant={"contained"}
                            onClick={(event) => {
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
