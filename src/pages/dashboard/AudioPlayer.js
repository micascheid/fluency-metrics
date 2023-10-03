import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
    useMemo, useContext,
} from "react";
import {WaveSurfer, WaveForm, Marker, Region} from 'wavesurfer-react';
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min";
import MarkersPlugin from "wavesurfer.js/src/plugin/markers";
import {Box, Button, IconButton, Slider, Stack, Typography} from "@mui/material";
import MainCard from "../../components/MainCard";
import ZoomIn from '@mui/icons-material/ZoomIn';
import ZoomOut from '@mui/icons-material/ZoomOut';
import Speed from '@mui/icons-material/Speed';
import {StutteredContext} from "../../context/StutteredContext";
import AudioPlayerPopover from "./popovers/AudioPlayerPopover";
import SaveWorkspace from "./SaveWorkspace";
import Help from "./Help";
import {useTheme} from "@mui/material/styles";
import {styled} from "@mui/material";


const StyledRegion = styled('div')({
    '& .wavesurfer-region': {
        borderRadius: '15px',
    },
    '& .wavesurfer-handle': {
        borderRadius: '25%',
    },
});

const AudioPlayer = (props) => {
    // VARIABLES
    const {
        transcriptionObj,
        setCurrentWordIndex,
        currentWordIndex,
        audioFile,
        kiStutteredRegions,
        setkiStutteredRegions,
        setAudioPlayerControl,
        setPlayBackSpeed,
        playBackSpeed,
        stutteredEvents,
        workspaceName,
        setAudioFileDuration,
    } = useContext(StutteredContext);

    const {help, cardColor} = props;
    const theme = useTheme();
    const [minZoomLevel, setMinZoomLevel] = useState(0);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [timeLineInterval, setTimeLineInterval] = useState(5);
    const [markers, setMarkers] = useState([]);
    const [creatingRegion, setCreatingRegion] = useState(null);
    const [isCreatingRegion, setIsCreatingRegion] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const wavesurferRef = useRef();
    const [currentRegion, setCurrentRegion] = useState(null);
    const [stutteredWords, setStutteredWords] = useState({});
    const [popoverKey, setPopoverKey] = useState(null);
    const [isFlashing, setIsFlashing] = useState(false);
    const [waveSurferReady, setWavesurferReady] = useState(false);
    const isDisabled = transcriptionObj === null;
    const timeLineIntervalRef = useRef();


    const waveformProps = {
        id: "waveform",
        cursorColor: "#000",
        cursorWidth: 2,
        scrollParent: true,
        fillParent: true,
        barWidth: 1,
    }

    //FUNCTIONS
    const plugins = useMemo(() => {
        return [
            {
                plugin: RegionsPlugin,
                options: {enableDragSelection: false}
            },
            {
                plugin: TimelinePlugin,
                options: {
                    container: "#timeline",
                    timeInterval: 1, //this is an initial sec per tick as the timelineIntervalREf will update it once audio is loaded
                    height: 20,
                }
            },
            {
                plugin: MarkersPlugin,
                options: {draggable: false}
            },
        ].filter(Boolean);
    }, []);

    const changeZoom = useCallback((zoom) => {
        if (wavesurferRef.current) {
            wavesurferRef.current.zoom(zoom);
        }
    }, [zoomLevel])

    const calculateTimeInterval = (duration) => {
        return Math.round((duration/60)*10)/10;
    }

    const timelineIntervalRedraw = (zoomLevel) => {
        if (wavesurferRef.current) {
            const width = document.getElementById('waveform').offsetWidth;
            const seconds_displayed = width / zoomLevel;
            const secondsPerTick = Math.round((seconds_displayed / 60)*10)/10;

            timeLineIntervalRef.current = wavesurferRef.current.timeline;
            timeLineIntervalRef.current.params.timeInterval = secondsPerTick;
            timeLineIntervalRef.current._onRedraw();
        }
    }


    const handleWSMount = useCallback(
        (waveSurfer) => {
            if (waveSurfer.markers) {
                waveSurfer.clearMarkers();
            }
            wavesurferRef.current = waveSurfer;

            if (wavesurferRef.current) {

                wavesurferRef.current.on("ready", () => {
                    // 1. Get the width of the waveform container
                    const waveformContainerWidth = document.getElementById('waveform').offsetWidth;

                    // 2. Get the duration of the audio in seconds
                    const audioDurationInSeconds = wavesurferRef.current.getDuration();
                    const timeInterval = calculateTimeInterval(audioDurationInSeconds);


                    // 3. Calculate the minimum zoom level
                    const minimumZoomLevel = waveformContainerWidth / audioDurationInSeconds;
                    // Set this zoom level to the waveform
                    wavesurferRef.current.zoom(minimumZoomLevel);

                    timelineIntervalRedraw(minimumZoomLevel);

                    setAudioFileDuration(Math.round(audioDurationInSeconds));
                    setMinZoomLevel(minimumZoomLevel);
                    setZoomLevel(minimumZoomLevel);
                    // setTimeLineInterval(timeInterval);

                });

                wavesurferRef.current.on("region-removed", (region) => {
                    // console.log("region-removed --> ", region);
                });

                wavesurferRef.current.on("loading", (data) => {
                    // console.log("loading --> ", data);
                });
                if (window) {
                    window.surferidze = wavesurferRef.current;
                }
            }
        },
        [wavesurferRef]
    );

    const handlePopoverOpen = (region, smth) => {
        const anchorElement = smth.currentTarget;
        if (anchorElement) {
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
        setPlayBackSpeed(value);
        if (wavesurferRef.current) {
            wavesurferRef.current.setPlaybackRate(value);
        }
    }, [playBackSpeed]);

    const playPause = () => {
        if (wavesurferRef.current !== null) {
            wavesurferRef.current.playPause();
        }
    }

    const isAudioCursorInsideAnyRegion = (cursorTime) => {
        return Object.values(kiStutteredRegions).some((region) => {
            return cursorTime >= region.start && cursorTime <= region.end;
        })
    }

    const handleMarkStutter = () => {
        const audioTime = wavesurferRef.current.getCurrentTime();
        if (!isAudioCursorInsideAnyRegion(audioTime)) {
            if (!isCreatingRegion) {
                const newRegionTemp = {start: audioTime};
                setIsCreatingRegion(true);
                setCreatingRegion(newRegionTemp);
            } else {
                const duration = audioTime - creatingRegion.start;
                const region = {
                    start: creatingRegion.start,
                    end: audioTime,
                    duration: duration,
                    color: "rgba(255, 0, 0, .2)",
                };
                const id = Object.keys(kiStutteredRegions).length;
                setkiStutteredRegions(prevRegions => ({
                    ...prevRegions,
                    [id]: region
                }));

                setCreatingRegion(null);
                setIsCreatingRegion(false);
            }
        } else {
            setIsFlashing(true);
        }
    };

    const handleMarkStutterClick = () => {
        if (wavesurferRef.current && !isDisabled) {
            handleMarkStutter();
        }
    };
    const handleKeyPress = (event) => {
        if (wavesurferRef.current && !isDisabled) {
            const audioTime = wavesurferRef.current.getCurrentTime();
            if (event.key === 's') {
                if (!isAudioCursorInsideAnyRegion(audioTime)) {
                    if (!isCreatingRegion) {
                        const newRegionTemp = {start: audioTime};
                        setIsCreatingRegion(true);
                        setCreatingRegion(newRegionTemp);
                    } else {
                        const duration = audioTime - creatingRegion.start;
                        const region = {
                            start: creatingRegion.start,
                            end: audioTime,
                            duration: duration,
                            color: "rgba(255, 0, 0, .2)",
                        };
                        const id = Object.keys(kiStutteredRegions).length;
                        setkiStutteredRegions(prevRegions => ({
                            ...prevRegions,
                            [id]: region
                        }));

                        setCreatingRegion(null);
                        setIsCreatingRegion(false);
                    }
                } else {
                    setIsFlashing(true);
                }
            }

            if (event.key === " ") {
                event.preventDefault();
                playPause();
            }
        }
    };

    const handleRegionUpdate = useCallback((region, smth) => {
        let changeRegion = kiStutteredRegions[region.id];
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

    const handleOnOver = () => {
        // console.log("on over");
    }

    const handleUpdate = useCallback((region, smth) => {
        // console.log("updating");
    }, [kiStutteredRegions])


    const getStutteredWordsFromRegion = (region) => {
        const words = Object.keys(transcriptionObj).filter(key => {
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
        if (isFlashing && wavesurferRef.current) {
            wavesurferRef.current.setBackgroundColor('rgba(255,0,0,.2)')
            const timer = setTimeout(() => {
                wavesurferRef.current.setBackgroundColor(null);
                setIsFlashing(false);
            }, 200);

            return () => clearTimeout(timer);
        }
    }, [isFlashing])

    useEffect(() => {
        if (transcriptionObj) {
            wavesurferRef.current.on('audioprocess', function (time) {
                if (isCreatingRegion && isAudioCursorInsideAnyRegion(time)) {
                    const duration = time - creatingRegion.start;
                    const region = {
                        start: creatingRegion.start,
                        end: time,
                        duration: duration,
                        color: "rgba(0, 0, 0, .2)",
                    };
                    const id = Object.keys(kiStutteredRegions).length;
                    setkiStutteredRegions(prevRegions => ({
                        ...prevRegions,
                        [id]: region
                    }));

                    setCreatingRegion(null);
                    setIsCreatingRegion(false);
                }

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
    }, [wavesurferRef, transcriptionObj, handleKeyPress, playBackSpeed, kiStutteredRegions]);

    const handleZoomIn = (event) => {
        event.currentTarget.blur();
        if (zoomLevel+10 >= 100){
            setZoomLevel(100);
            changeZoom(100);
            timelineIntervalRedraw(100);
        } else
            setZoomLevel(prevState => {
                changeZoom(prevState+10);
                timelineIntervalRedraw(prevState+10);
                return prevState+10
            });
    }

    const handleZoomOut = (event) => {
        event.currentTarget.blur();
        if (zoomLevel-10 <= minZoomLevel){
            setZoomLevel(minZoomLevel);
            changeZoom(minZoomLevel);
            timelineIntervalRedraw(minZoomLevel);
        } else
            setZoomLevel(prevState => {
                changeZoom(prevState-10);
                timelineIntervalRedraw(prevState-10);
                return prevState-10;
            });
    }



    return (
        <MainCard
            title={
                <Box flexGrow={1} sx={{justifyContent: 'space-between'}}>
                    <Help title={"Audio Player"}>
                        {help}
                    </Help>
                </Box>
            }
        >
            <Stack>
                {audioFile ? (
                    <React.Fragment>
                        <SaveWorkspace sx={{mb: 3}} name={workspaceName}/>
                        <StyledRegion>
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
                                                onUpdate={handleUpdate}
                                                onClick={handlePopoverOpen}
                                                onOver={handleOnOver}

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
                                        />
                                    )}

                                </WaveForm>
                                <div id="timeline" />
                            </WaveSurfer>
                        </StyledRegion>
                    </React.Fragment>
                ) : (
                    <Box sx={{height: 128, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <Typography variant={"h2"} fontWeight={"light"}>Start or load a new Analysis to get
                            started!</Typography>
                    </Box>
                )}

                <Box sx={{height: 10}}/>
                <Stack spacing={2} direction={"row"} sx={{alignItems: 'center'}}>
                    <Speed/>
                    <Box sx={{width: 100, pt: 1}}>
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
                                playbackSpeedHandler(event, value);
                            }}
                            disabled={isDisabled}
                            sx={{width: 90, mr: 10}}
                        />
                    </Box>
                    <Box sx={{width: '20px', pr: 3}}>
                        <Typography>{playBackSpeed}x</Typography>
                    </Box>
                    <Button variant={"outlined"} onClick={(event) => {
                        play();
                        event.currentTarget.blur();
                    }}
                            disabled={isDisabled}>
                        Play / Pause
                    </Button>
                    <Button variant={"outlined"}
                            onClick={(event) => {
                                handleMarkStutterClick()
                                event.currentTarget.blur();
                            }}
                            disabled={isDisabled}
                    >
                        Mark Stutter
                    </Button>
                    <IconButton disabled={isDisabled} color={"primary"} onClick={handleZoomOut}>
                        <ZoomOut fontSize={"large"}/>
                    </IconButton>
                    <IconButton disabled={isDisabled} color={"primary"} onClick={handleZoomIn}>
                        <ZoomIn fontSize={"large"}/>
                    </IconButton>
                </Stack>
            </Stack>
        </MainCard>
    )
};

export default AudioPlayer;
