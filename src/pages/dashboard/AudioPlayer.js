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
import {Box, Button, Slider, Stack, Typography} from "@mui/material";
import MainCard from "../../components/MainCard";
import ZoomIn from '@mui/icons-material/ZoomIn';
import ZoomOut from '@mui/icons-material/ZoomOut';
import Speed from '@mui/icons-material/Speed';
import {StutteredContext} from "../../context/StutteredContext";
import AudioPlayerPopover from "./popovers/AudioPlayerPopover";
import SaveWorkspace from "./SaveWorkspace";
import ReactToPrint from "react-to-print";
import PrintIcon from '@mui/icons-material/Print';
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
    // console.log("AUDIO FILE NAME", audioFile);
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
    const [isFlashing, setIsFlashing] = useState(false);
    const isDisabled = transcriptionObj === null;


    const waveformProps = {
        id: "waveform",
        cursorColor: "#000",
        cursorWidth: 2,
        scrollParent: true,
        fillParent: true,
    }

    //FUNCTIONS
    const plugins = useMemo(() => {
        return [
            {
                plugin: RegionsPlugin,
                options: {enableDragSelection: false}
            },
            timelineVis && {
                plugin: TimelinePlugin,
                options: {
                    container: "#timeline",
                    timeInterval: .5,
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
                    setAudioFileDuration(Math.round(wavesurferRef.current.getDuration()));

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
        console.log("Stuttered words:",)
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

    const handleKeyPress = (event) => {
        if (wavesurferRef.current && !isDisabled) {
            console.log("WAVESURFER: ", wavesurferRef.current);
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

            if (event.key === 'r') {
                console.log("r");
                wavesurferRef.current.setBackgroundColor('rgba(255,0,0,.5)');
                setIsFlashing(true);
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
        console.log("Load file");
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

    useEffect(() => {
        if (wavesurferRef.current) {
            const timelineElem = document.getElementById('timeline');

            const handleTimelineClick = (event) => {
                const clickPosition = event.offsetX / timelineElem.offsetWidth;
                // const clickTime = clickPosition * wavesurferRef.current.getDuration();
                wavesurferRef.current.seekTo(clickPosition);
            };

            timelineElem.addEventListener('click', handleTimelineClick);

            return () => {
                timelineElem.removeEventListener('click', handleTimelineClick);
            };
        }
    }, [wavesurferRef]);


    return (
        <MainCard title={
            <Box flexGrow={1}>
                <Help title={"Audio Player"}>
                    {help}
                </Help>
            </Box>
        }
            // sx={{backgroundColor: theme.palette.grey[300]}}
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
                                        // setPopoverColor={setPopoverColor}
                                    />
                                )}

                            </WaveForm>
                            <div id="timeline"/>
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
                            disabled={isDisabled}
                            sx={{width: 90, mr: 10}}
                        />
                    </Box>
                    <Button variant={"outlined"} onClick={(event) => {
                        play();
                        event.currentTarget.blur();
                    }}
                            disabled={isDisabled}>Play / Pause</Button>
                    <ZoomOut/>
                    <Box sx={{width: 100}}>
                        <Slider
                            aria-label="Zoom"
                            defaultValue={1}
                            min={0} // Adjust the minimum zoom level according to your needs
                            max={100} // Adjust the maximum zoom level according to your needs
                            value={zoomLevel}
                            onChange={zoomInHandler}
                            disabled={isDisabled}
                        />
                    </Box>
                    <ZoomIn/>
                </Stack>
            </Stack>
        </MainCard>
    )
};

export default AudioPlayer;
