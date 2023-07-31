import {react, useState, useEffect, useRef} from 'react';
import MainCard from "../../components/MainCard";
import {Box} from "@mui/material";
import WaveSurfer from 'wavesurfer';
import { Wavesurfer } from 'wavesurfer-react';
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min";

const Waveform = () => {
    const waveformRef = useRef(null);
    const timelineRef = useRef(null);
    const wavesurferRef = useRef(null);

    useEffect(() => {

        wavesurferRef.current.on('ready', function () {
            // Assuming 30 seconds of audio fits within 1000 pixels
            const duration = wavesurferRef.current.getDuration();
            const pixelsPerSecond = 1000 / 30;
            const zoomLevel = pixelsPerSecond / (duration / 30);
            wavesurferRef.current.zoom(zoomLevel);
        });

        return () => {
            if (wavesurferRef.current) {
                wavesurferRef.current.destroy();
            }
        };
    }, []);

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

    const handlePlay = () => {
        if (wavesurferRef.current) {
            wavesurferRef.current.playPause();
        }
    };

    return (
        <div>
            <div id="waveform" ref={waveformRef} />
            <div id="timeline" ref={timelineRef} />
            <input type="file" onChange={handleFileChange} />
            <button onClick={handlePlay}>Play/Pause</button>
        </div>
    );
};

export default Waveform;