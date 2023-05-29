import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
    useMemo,
    StrictMode
} from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import {WaveSurfer, WaveForm, Region, Marker} from "wavesurfer-react";
import "./styles.css";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min";
import MarkersPlugin from "wavesurfer.js/src/plugin/markers";
import {Box, Button, Slider, Stack, Typography} from "@mui/material";
import MainCard from "../../components/MainCard";

// const Buttons = styled.div`
//   display: inline-block;
// `;

// const Button = styled.button``;

/**
 * @param min
 * @param max
 * @returns {*}
 */
function generateNum(min, max) {
    return Math.random() * (max - min + 1) + min;
}

/**
 * @param distance
 * @param min
 * @param max
 * @returns {([*, *]|[*, *])|*[]}
 */
function generateTwoNumsWithDistance(distance, min, max) {
    const num1 = generateNum(min, max);
    const num2 = generateNum(min, max);
    // if num2 - num1 < 10
    if (num2 - num1 >= 10) {
        return [num1, num2];
    }
    return generateTwoNumsWithDistance(distance, min, max);
}

const AudioPlayer2 = ({transcript, ss, nss, setSS, setNSS}) => {
    const [timelineVis, setTimelineVis] = useState(true);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [currentWordIndex, setCurrentWordIndex] = useState(1);
    // const wordMap = JSON.stringify(transcript);
    const wordMap = {"10": {"text": "My", "start": 0.3, "end": 0.54, "confidence": 0.784}, "11": {"text": "name", "start": 0.54, "end": 0.82, "confidence": 0.996}, "12": {"text": "is", "start": 0.82, "end": 2.38, "confidence": 0.993}, "13": {"text": "Ray", "start": 2.38, "end": 3.84, "confidence": 0.59}, "14": {"text": "Remnitz.", "start": 3.84, "end": 4.7, "confidence": 0.293}, "20": {"text": "I'm", "start": 4.78, "end": 8.64, "confidence": 0.248}, "21": {"text": "20", "start": 8.64, "end": 10.14, "confidence": 0.78}};
    const wordKeys = Object.keys(wordMap).sort((a, b) => wordMap[a].start - wordMap[b].start);
    console.log("wordkeys", wordKeys);
    const plugins = useMemo(() => {
        return [
            {
                plugin: RegionsPlugin,
                options: {dragSelection: true}
            },
            timelineVis && {
                plugin: TimelinePlugin,
                options: {
                    container: "#timeline"
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
    const [markers, setMarkers] = useState([]);
    const [regions, setRegions] = useState([]);
    const waveformProps = {
        id: "waveform",
        cursorColor: "#000000",
        cursorWidth: 2,
    }
    // use regions ref to pass it inside useCallback
    // so it will use always the most fresh version of regions list
    // const regionsRef = useRef(regions);


    const wavesurferRef = useRef();
    const handleWSMount = useCallback(
        (waveSurfer) => {
            if (waveSurfer.markers) {
                waveSurfer.clearMarkers();
            }

            wavesurferRef.current = waveSurfer;

            if (wavesurferRef.current) {
                wavesurferRef.current.load("/stutter_testing.mp3");

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
        []
    );

    const generateRegion = useCallback(() => {
        if (!wavesurferRef.current) return;
        const minTimestampInSeconds = 0;
        const maxTimestampInSeconds = wavesurferRef.current.getDuration();
        const distance = generateNum(0, 10);
        const [min, max] = generateTwoNumsWithDistance(
            distance,
            minTimestampInSeconds,
            maxTimestampInSeconds
        );

        const r = generateNum(0, 255);
        const g = generateNum(0, 255);
        const b = generateNum(0, 255);
        setRegions(prevRegions => [
            ...prevRegions,
            {
                id: `custom-${generateNum(0, 9999)}`,
                start: min,
                end: max,
                color: `rgba(${r}, ${g}, ${b}, 0.5)`
            }
        ]);
    }, [regions, wavesurferRef]);
    const generateMarker = useCallback(() => {
        if (!wavesurferRef.current) return;

        const time = wavesurferRef.current.getCurrentTime();
        const r = generateNum(0, 255);
        const g = generateNum(0, 255);
        const b = generateNum(0, 255);
        setMarkers((prevMarkers) => {
            const newMarker = {
                label: `custom-${generateNum(0, 9999)}`,
                time: time,
                color: `rgba(${r}, ${g}, ${b}, 0.5)`
            }
            return [...prevMarkers, newMarker];
        });
    }, [wavesurferRef]);

    const removeLastRegion = useCallback(() => {
        let nextRegions = [...regions];

        nextRegions.pop();

        setRegions(nextRegions);
    }, [regions]);
    const removeLastMarker = useCallback(() => {
        setMarkers(prevMarkers => {
            let nextMarkers = [...prevMarkers];
            nextMarkers.pop();
            return nextMarkers;
        });
    }, []);

    const play = useCallback(() => {
        wavesurferRef.current.playPause();
        wavesurferRef.current.setPlaybackRate(playbackSpeed);
        if (wavesurferRef.current) {
            wavesurferRef.current.setPlaybackRate(playbackSpeed);
        }
    }, [playbackSpeed]);


    const handleFileChange = (event) => {
        const file = event.target.files[0];
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




    // useEffect(() => {
    //     console.log(wordKeys);
    //     if (wavesurferRef.current) {
    //         wavesurferRef.current.on('audioprocess', () => {
    //             const currentTime = wavesurferRef.current.getCurrentTime();
    //             // Check if the current time of the audio is within the start and end time of the current word.
    //             const key = currentWordIndex.toString();
    //             if (key in wordMap &&
    //                 currentTime >= wordMap[key].start &&
    //                 currentTime <= wordMap[key].end
    //             ) {
    //                 setCurrentWordIndex((prevIndex) => prevIndex + 1);
    //             }
    //         });
    //     }
    //     // console.log("Word Map:" + wordMap[key].start);
    //     const handleKeyPress = (event) => {
    //         if (event.key === 's') {
    //             console.log("SS:", ss);
    //             setSS(prevValue => prevValue + 1);
    //         }
    //         if (event.key === 'n') {
    //             setNSS(prevValue => prevValue + 1);
    //         }
    //     };
    //     window.addEventListener('keypress', handleKeyPress);
    //     return () => {
    //         window.removeEventListener('keypress', handleKeyPress);
    //     }
    // }, [wavesurferRef, wordKeys, currentWordIndex, transcript]);

    useEffect(() => {

        wavesurferRef.current.on('audioprocess', function(time) {
            let newWordIndex = null;
            Object.keys(transcript).forEach((key) => {
                if (time >= transcript[key].start && time <= transcript[key].end) {
                    newWordIndex = key;
                }
            });

            if (newWordIndex !== currentWordIndex) {
                setCurrentWordIndex(newWordIndex);
            }
        });

        const handleKeyPress = (event) => {
                    if (event.key === 's') {
                        console.log("SS:", ss);
                        setSS(prevValue => prevValue + 1);
                    }
                    if (event.key === 'n') {
                        setNSS(prevValue => prevValue + 1);
                    }
                };

        return () => {
            // wavesurferRef.current.destroy();
            window.removeEventListener('keypress', handleKeyPress);
        }
    }, [wavesurferRef, currentWordIndex]);


    return (
        <MainCard>
            <Stack>
                <WaveSurfer plugins={plugins} onMount={handleWSMount}>
                    <WaveForm {...waveformProps}>
                        {regions.map((regionProps) => (
                            <Region
                                // onUpdateEnd={handleRegionUpdate}
                                key={regionProps.id}
                                {...regionProps}
                            />
                        ))}
                        {markers.map((marker) => (
                            <Marker
                                key={marker.label}
                                {...marker}
                            />
                        ))}
                    </WaveForm>
                    <div id="timeline"/>
                </WaveSurfer>
                <Box sx={{height: 10}}/>
                <Stack spacing={1} direction={"row"}>
                    <Box sx={{width: 120, mr: 2}}>
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
                        />
                    </Box>
                    <Button variant={"contained"} onClick={generateMarker}>Generate Marker</Button>
                    <Button variant={"contained"} onClick={play}>Play / Pause</Button>
                    <Button variant={"contained"} onClick={removeLastRegion}>Remove last region</Button>
                    <Button variant={"contained"} onClick={removeLastMarker}>Remove last marker</Button>
                    <Button variant={"contained"} onClick={toggleTimeline}>Toggle timeline</Button>
                    <Button
                        variant={"contained"}
                        component={"label"}
                    >
                        Choose File
                        <input
                            type={"file"}
                            hidden
                            onChange={handleFileChange}
                        />
                    </Button>
                    <Button variant={"contained"} onClick={() => setSS(ss + 1)}>SS</Button>
                    <Button variant={"contained"} onClick={() => setNSS(nss + 1)}>NSS</Button>
                </Stack>
                <Box>
                    <Typography variant={"h4"}>
                        {Object.keys(transcript).map((key) => (
                            <span key={key} style={{backgroundColor: currentWordIndex === key ? 'yellow' : 'transparent'}}>
                                {transcript[key].text + ' '}
                            </span>
                        ))}
                    </Typography>
                </Box>
            </Stack>
        </MainCard>
    );
}

export default AudioPlayer2;
