import {
    Box,
    Divider,
    FormControl,
    FormControlLabel,
    IconButton, InputLabel, MenuItem,
    Popover, Select,
    Stack,
    styled,
    TextField,
    Typography
} from "@mui/material";
import React, {useState} from "react";
import CloseIcon from "@mui/icons-material/Close";
import {dividerStyles, CustomSyllableInput, CustomWordInput} from "../../../components/PopoverStyling";
import {CheckBox} from "@mui/icons-material";


const AudioPlayerPopover = ({anchorEl, setAnchorEl, popoverOpen, setPopoverOpen}) => {
    const [stutterType, setStutterType] = useState('');
    const [pcVal, setPcVal] = useState('');

    const typeList = ["Repetition", "Prolongation", "Block", "Interjection"];
    const pcList = [0, 1, 2, 3, 4, 5];
    const handlePopoverClose = () => {
        setPopoverOpen(false);
        setAnchorEl(null);
    }

    const handleStutterTypeChange = (event) => {
        setStutterType(event.target.value);
    }

    const handlePcTypeChange = (event) => {
        setPcVal(event.target.value);
    }

    return (
        <Popover
            open={popoverOpen}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{vertical: 'center', horizontal: 'center'}}
        >
            {/*<Typography>POPOVER!</Typography>*/}
            <Box sx={{minWidth: 400}}>
                <Stack direction={"column"} sx={{pl: 1, pb: 1}}>
                    <IconButton sx={{mb: '-1'}} onClick={handlePopoverClose}>
                        <CloseIcon/>
                    </IconButton>
                    <Divider textAlign={"left"} sx={dividerStyles}>Stuttered Text</Divider>
                    <Box sx={{display: 'flex', alignItems: "center", justifyContent: "left"}}>
                        <CustomWordInput
                            value={"test for now"}
                            // onChange={handleChange}
                            // onKeyDown={handleKeyDown}
                            // onKeyPress={handleKeyPress}
                            sx={{mb: 1}}
                        />
                    </Box>
                    <Divider textAlign={"left"} sx={dividerStyles}>Syllables</Divider>
                    <CustomSyllableInput
                        type={"number"}
                        // value={syllableCount}
                        // onChange={handleSyllableChange}
                        inputProps={{min: 0}}
                    />
                    <Divider textAlign={"left"} sx={dividerStyles}>Type</Divider>
                    <Box>
                        <FormControl sx={{minWidth: 100}}>
                            <InputLabel id={"stutter-type-select-label"}>None</InputLabel>
                            <Select
                                labelId={"stutter-type-select-label"}
                                id={"select-stutter"}
                                value={stutterType}
                                onChange={handleStutterTypeChange}
                            >
                                {typeList.map((type, ind) => (
                                    <MenuItem key={ind} value={type}>{type}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Divider textAlign={"left"} sx={dividerStyles}>Physical Concomitants</Divider>
                    <Box>
                        <FormControl sx={{minWidth: 100}}>
                            <InputLabel id={"pc-type-select-label"}>None</InputLabel>
                            <Select
                                labelId={"pc-type-select-label"}
                                id={"select-pc"}
                                value={pcVal}
                                onChange={handlePcTypeChange}
                            >
                                {pcList.map((type, ind) => (
                                    <MenuItem key={ind} value={type}>{type}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Stack>
            </Box>
        </Popover>
    );
};

export default AudioPlayerPopover;