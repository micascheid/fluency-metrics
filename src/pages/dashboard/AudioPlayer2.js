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
import { WaveSurfer, WaveForm, Region, Marker } from "wavesurfer-react";
import "./styles.css";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min";
import MarkersPlugin from "wavesurfer.js/src/plugin/markers";
import {Button, Stack} from "@mui/material";

const Buttons = styled.div`
  display: inline-block;
`;

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

function AudioPlayer2() {
    const [timelineVis, setTimelineVis] = useState(true);



    const plugins = useMemo(() => {
        return [
            {
                plugin: RegionsPlugin,
                options: { dragSelection: true }
            },
            timelineVis && {
                plugin: TimelinePlugin,
                options: {
                    container: "#timeline"
                }
            },
            {
                plugin: MarkersPlugin,
                options: { draggable: true }
            },
        ].filter(Boolean);
    }, [timelineVis]);

    const toggleTimeline = useCallback(() => {
        setTimelineVis(prevTimelineVis => !prevTimelineVis);
    }, []);
    const [markers, setMarkers] = useState([
        {
            time: 5.5,
            label: "V1",
            color: "#ff990a",
            draggable: true
        },
        {
            time: 10,
            label: "V2",
            color: "#00ffcc",
            position: "top"
        },
        {
            time: 90,
            label: "V3",
            color: "#00ffcc",
            position: "top",
            draggable: true
        }
    ]);
    const [regions, setRegions] = useState([
        {
            id: "region-1",
            start: 0.5,
            end: 10,
            color: "rgba(0, 0, 0, .5)",
            data: {
                systemRegionId: 31
            }
        },
        {
            id: "region-2",
            start: 5,
            end: 25,
            color: "rgba(225, 195, 100, .5)",
            data: {
                systemRegionId: 32
            }
        },
        {
            id: "region-3",
            start: 15,
            end: 35,
            color: "rgba(25, 95, 195, .5)",
            data: {
                systemRegionId: 33
            }
        }
    ]);

    // use regions ref to pass it inside useCallback
    // so it will use always the most fresh version of regions list
    // const regionsRef = useRef(regions);

    // useEffect(() => {
    //     regionsRef.current = regions;
    // }, [regions]);

    // const regionCreatedHandler = useCallback(
    //     (region) => {
    //         console.log("region-created --> region:", region);
    //
    //         if (region.data.systemRegionId) return;
    //         console.log("BEING CALLED?");
    //         setRegions([
    //             ...regionsRef.current,
    //             { ...region, data: { ...region.data, systemRegionId: -1 } }
    //         ]);
    //     },
    //     [regionsRef]
    // );

    const wavesurferRef = useRef();
    const handleWSMount = useCallback(
        (waveSurfer) => {
            if (waveSurfer.markers) {
                waveSurfer.clearMarkers();
            }

            wavesurferRef.current = waveSurfer;

            if (wavesurferRef.current) {
                // wavesurferRef.current.load("");

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
        const minTimestampInSeconds = 0;
        const maxTimestampInSeconds = wavesurferRef.current.getDuration();
        const distance = generateNum(0, 10);
        const [min] = generateTwoNumsWithDistance(
            distance,
            minTimestampInSeconds,
            maxTimestampInSeconds
        );

        const r = generateNum(0, 255);
        const g = generateNum(0, 255);
        const b = generateNum(0, 255);
        console.log(wavesurferRef.current.getDuration());

        setMarkers((prevMarkers) => {
            const newMarker = {
                label: `custom-${generateNum(0, 9999)}`,
                time: min,
                color: `rgba(${r}, ${g}, ${b}, 0.5)`
            }
            return [...prevMarkers, newMarker];
        });
    }, [wavesurferRef]);

    const removeLastRegion = useCallback(() => {
        setRegions(prevRegions => {
            let nextRegions = [...prevRegions];
            nextRegions.pop();
            return nextRegions;
        });
    }, []);
    const removeLastMarker = useCallback(() => {
        setMarkers(prevMarkers => {
            let nextMarkers = [...prevMarkers];
            nextMarkers.pop();
            return nextMarkers;
        });
    }, []);

    const shuffleLastMarker = useCallback(() => {
        setMarkers((prev) => {
            const next = [...prev];
            let lastIndex = next.length - 1;

            const minTimestampInSeconds = 0;
            const maxTimestampInSeconds = wavesurferRef.current.getDuration();
            const distance = generateNum(0, 10);
            const [min] = generateTwoNumsWithDistance(
                distance,
                minTimestampInSeconds,
                maxTimestampInSeconds
            );

            next[lastIndex] = {
                ...next[lastIndex],
                time: min
            };

            return next;
        });
    }, []);

    const play = useCallback(() => {
        wavesurferRef.current.playPause();
    }, []);

    // const handleRegionUpdate = useCallback((region, smth) => {
    //     console.log("region-update-end --> region:", region);
    //     console.log(smth);
    // }, []);

    const handleFileChange = (event) => {
        const file =event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            if (wavesurferRef.current) {
                wavesurferRef.current.loadBlob(new Blob([reader.result]));
            }
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div className="App">
            <WaveSurfer plugins={plugins} onMount={handleWSMount}>
                <WaveForm id="waveform" cursorColor="transparent">
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
                <div id="timeline" />
            </WaveSurfer>
            <Stack spacing={1} direction={"row"}>
                <Button variant={"contained"} onClick={generateRegion}>Generate region</Button>
                <Button variant={"contained"} onClick={generateMarker}>Generte Marker</Button>
                <Button variant={"contained"} onClick={play}>Play / Pause</Button>
                <Button variant={"contained"} onClick={removeLastRegion}>Remove last region</Button>
                <Button variant={"contained"} onClick={removeLastMarker}>Remove last marker</Button>
                <Button variant={"contained"} onClick={shuffleLastMarker}>Shuffle last marker</Button>
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
            </Stack>
        </div>
    );
}

export default AudioPlayer2;
