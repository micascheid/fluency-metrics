import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
    useMemo,
} from "react";
import {WaveSurfer, WaveForm, Region, Marker} from "wavesurfer-react";
import "./styles.css";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min";
import MarkersPlugin from "wavesurfer.js/src/plugin/markers";
import {Box, Button, Slider, Stack, Typography} from "@mui/material";
import MainCard from "../../components/MainCard";
import ZoomIn from '@mui/icons-material/ZoomIn';
import ZoomOut from '@mui/icons-material/ZoomOut';
import Speed from '@mui/icons-material/Speed';

// const Buttons = styled.div`
//   display: inline-block;
// `;

// const Button = styled.button``;

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

const AudioPlayer2 = ({transcript, ss, nss, setSS, setNSS}) => {
    const [timelineVis, setTimelineVis] = useState(true);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [currentWordIndex, setCurrentWordIndex] = useState(1);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [markers, setMarkers] = useState([]);
    const wavesurferRef = useRef();

    const waveformProps = {
        id: "waveform",
        cursorColor: "#000000",
        cursorWidth: 2,
    }
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

    const zoomInHandler = (event, value) => {
        setZoomLevel(value);
        if (wavesurferRef.current) {
            wavesurferRef.current.zoom(value);
        }
    };


    // use regions ref to pass it inside useCallback
    // so it will use always the most fresh version of regions list
    // const regionsRef = useRef(regions);

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

                wavesurferRef.current.on("seek", () => {
                    const time = wavesurferRef.current.getCurrentTime();
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

                if (window) {
                    window.surferidze = wavesurferRef.current;
                }
            }
        },
        []
    );

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

    useEffect(() => {

        wavesurferRef.current.on('audioprocess', function (time) {
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
            if (event.key === ' ') {
                wavesurferRef.current.playPause();
            }
        };
        window.addEventListener('keypress', handleKeyPress);
        return () => {
            window.removeEventListener('keypress', handleKeyPress);
        }
    }, [wavesurferRef, currentWordIndex]);


    return (
        <MainCard>
            <Stack>
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
                            sx={{width: 90, mr: 10}}
                        />
                    </Box>
                    {/*<Button variant={"contained"} onClick={generateMarker}>Generate Marker</Button>*/}
                    <Button variant={"contained"} onClick={play}>Play / Pause</Button>
                    {/*<Button variant={"contained"} onClick={removeLastRegion}>Remove last region</Button>*/}
                    <Button variant={"contained"} onClick={removeLastMarker}>Remove last marker</Button>
                    <Button variant={"contained"} onClick={toggleTimeline}>Toggle timeline</Button>
                    {/*<Button variant={"contained"} onClick={zoomIn}>Zoom In</Button>*/}
                    {/*<Button variant={"contained"} onClick={zoomReset}>Zoom Out</Button>*/}
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
                    {/*<Button variant={"contained"} onClick={() => setSS(ss + 1)}>SS</Button>*/}
                    {/*<Button variant={"contained"} onClick={() => setNSS(nss + 1)}>NSS</Button>*/}
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
                        />
                    </Box>
                    <ZoomIn/>
                </Stack>
                <Box>
                    <Typography variant={"h4"}>
                        {Object.keys(transcript).map((key) => (
                            <React.Fragment>
                                <span key={key}
                                      style={{backgroundColor: currentWordIndex === key ? '#ADD8E6' : 'transparent'}}>
                                    {transcript[key].text}
                                </span>{" "}
                            </React.Fragment>
                        ))}
                    </Typography>
                </Box>
            </Stack>
        </MainCard>
    );
}

export default AudioPlayer2;
