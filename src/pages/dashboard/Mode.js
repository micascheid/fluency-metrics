import {Button, FormControl, Grid, InputLabel, MenuItem, Select, Stack, Typography} from "@mui/material";
import React, {useContext, useState} from "react";
import MainCard from "../../components/MainCard";
import {StutteredContext} from "../../context/StutteredContext";


const Mode = () => {
    const {mode, setMode, setFileChosen, setAudioFile, setAudioFileName, audioFileName} = useContext(StutteredContext);
    const autoModeText = "Some text about auto mode";
    const manualModeText = "Some text about manual mode";
    const handleMode = (event) => {
        setMode(event.target.value);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) {
            setFileChosen(false);
            return;
        }
        setAudioFile(file);
        setAudioFileName(file.name);
        setFileChosen(true);
    };
    return (
        <MainCard>
            <Grid container spacing={2}>
                <Grid item xs={2} sm={2} md={2} lg={2}>
                    <Stack style={{maxWidth: "120px"}} >
                        <FormControl>
                            <InputLabel>Mode</InputLabel>
                            <Select
                                sx={{minWidth: 100}}
                                label={"Mode"}
                                value={mode}
                                onChange={handleMode}
                            >
                                <MenuItem value={"manual"}>Manual</MenuItem>
                                <MenuItem value={"auto"}>Auto</MenuItem>
                            </Select>
                        </FormControl>
                        <Button sx={{mt: 2}} disabled={mode === ''} variant={"contained"} component={"label"} onClick={(event) => {
                            event.currentTarget.blur();
                        }}>
                            Choose File
                            <input
                                type={"file"}
                                hidden
                                onChange={handleFileChange}
                            />
                        </Button>
                        <Typography variant={"body1"}>{audioFileName}</Typography>
                    </Stack>
                </Grid>
                <Grid item xs={5} sm={5} md={5} lg={5}>
                    <Typography>{autoModeText}</Typography>
                </Grid>
                <Grid item xs={5} sm={5} md={5} lg={5}>
                    <Typography>{manualModeText}</Typography>
                </Grid>
            </Grid>
        </MainCard>

    );
};

export default Mode;