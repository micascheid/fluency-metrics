import {FormControl, Grid, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import React, {useContext, useState} from "react";
import MainCard from "../../components/MainCard";
import {StutteredContext} from "../../context/StutteredContext";


const Mode = () => {
    const {mode, setMode} = useContext(StutteredContext);
    const handleMode = (event) => {
        setMode(event.target.value);
    };
    return (
        <MainCard>
            <Grid container spacing={2}>
                <Grid item xs={2} sm={2} md={2} lg={2}>
                    <FormControl>
                        <InputLabel>Mode</InputLabel>
                        <Select
                            sx={{minWidth: 100}}
                            label={"Mode"}
                            value={mode}
                            onChange={handleMode}
                        >
                            <MenuItem value={"auto"}>Auto</MenuItem>
                            <MenuItem value={"manual"}>Manual</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={5} sm={5} md={5} lg={5}>
                    <Typography>-Some text about auto mode here</Typography>
                </Grid>
                <Grid item xs={5} sm={5} md={5} lg={5}>
                    <Typography>-Some text about manual mode here</Typography>
                </Grid>
            </Grid>
        </MainCard>

    );
};

export default Mode;