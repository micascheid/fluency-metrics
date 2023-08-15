import {
    Box, Button,
    Divider,
    FormControl,
    IconButton, InputLabel, MenuItem,
    Popover, Select,
    Stack,
} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {dividerStyles, CustomSyllableInput, CustomWordInput} from "../../../components/PopoverStyling";
import {StutteredContext} from "../../../context/StutteredContext";



const AudioPlayerPopover = ({anchorEl, setAnchorEl, popoverOpen, setPopoverOpen, stutteredWords, region}) => {
    const [stutterType, setStutterType] = useState('');
    const [pcVal, setPcVal] = useState('');
    const [syllableCount, setSyllableCount] = useState(0);
    const typeList = ["Repetition", "Prolongation", "Block", "Interjection"];
    const pcList = [0, 1, 2, 3, 4, 5];
    const [localStutteredWords, setLocalStutteredWords] = useState('');

    const {
        transcriptionObj,
        setTranscriptionObj,
        setkiStutteredRegions,
        addStutteredEventWaveForm,
        updateStutteredEventWaveForm,
        stutteredEventsList,
    } = useContext(StutteredContext);

    const handlePopoverClose = () => {
        setPopoverOpen(false);
        setAnchorEl(null);
    };

    const handleStutterTypeChange = (event) => {
        setStutterType(event.target.value);
    };

    const handlePcTypeChange = (event) => {
        setPcVal(event.target.value);
    };

    const handleSyllableChange = (event) => {
        const value = parseInt(event.target.value);
        if (!Number.isNaN(value)){
            setSyllableCount(value);
        }
    }

    const reIndexKeys = (obj) => {
      return Object.keys(obj).reduce((newObj, currentObj, index) => {
          const val = obj[currentObj];
          newObj[index+1] = val;
          return newObj;
        }, {});
    };

    const updateTranscriptionObj = () => {
        const wordKeys = Object.keys(stutteredWords);
        const insertKey = wordKeys[0];
        let newTranscriptionObj = {...transcriptionObj};


        wordKeys.forEach(key => {
            delete newTranscriptionObj[key];
        });

        const duration = region.end - region.start;
        const start = region.start;
        const end = region.end;

        // TODO: ensure syllable count gets set correctly
        newTranscriptionObj[insertKey] = {
            confidence: 1,
            end: end,
            start: start,
            stuttered: true,
            syllable_count: 1,
            text: localStutteredWords
        }
        newTranscriptionObj = reIndexKeys(newTranscriptionObj);
        setTranscriptionObj(newTranscriptionObj);
    };

    const handleDonePopoverClose = () => {
        updateTranscriptionObj();
        const wordKeys = Object.keys(stutteredWords);
        const insertKey = wordKeys[0];
        console.log("STUTTERED EVENT LIST:", stutteredEventsList);
        console.log("REGION ID: ", region.id + stutteredEventsList.some(eventItem => {
            console.log("eventID:",eventItem.id);
        }));
        let found = false;

        stutteredEventsList.some(eventItem => {
            const r = Number(region.id);
            if (Number(eventItem.id) === Number(region.id)) {
                found = true;
            }
        })
        if (!(stutteredEventsList.length === 0) && found){
            console.log("MAKING UPDATE");
            updateStutteredEventWaveForm(region, syllableCount, pcVal, localStutteredWords, stutterType);
        } else {
            addStutteredEventWaveForm(region, syllableCount, pcVal, localStutteredWords, stutterType, insertKey);
        }
        setPopoverOpen(false);
        setAnchorEl(null);
    };

    const handleChange = (event) => {
        const words = event.target.value;
        setLocalStutteredWords(event.target.value);
    };

    const handleKeyPress = (event) => {
        event.stopPropagation();
        event.stopPropagation();
    };

    const handleRegionDelete = () => {
        setkiStutteredRegions(prevRegion => {
            let newRegion = {...prevRegion};
            delete newRegion[region.id];
            return newRegion;
        })
    };

    const stutteredWordsDisplay = (words) => {
        return Object.values(words).map(word_obj => word_obj.text).join(' ');
    };

    useEffect(() => {
        setLocalStutteredWords(stutteredWordsDisplay(stutteredWords));
    }, [stutteredWords]);

    return (
        <Popover
            open={popoverOpen}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{vertical: 'center', horizontal: 'center'}}
        >
            <Box sx={{minWidth: 200}}>
                <Stack direction={"column"} sx={{pl: 1}}>
                    <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                        <IconButton sx={{mb: '-1'}} onClick={handlePopoverClose}>
                            <CloseIcon/>
                        </IconButton>
                        <IconButton onClick={(event) => {
                            handleRegionDelete();
                            handlePopoverClose(event);
                        }
                        }>
                            <DeleteForeverIcon sx={{color: 'red'}}/>
                        </IconButton>
                    </Box>
                    <Divider textAlign={"left"} sx={dividerStyles}>Stuttered Text</Divider>
                    <Box sx={{display: 'flex', alignItems: "center", justifyContent: "left"}}>
                        <CustomWordInput
                            value={localStutteredWords}
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                            sx={{mb: 1}}
                        />
                    </Box>
                    <Divider textAlign={"left"} sx={dividerStyles}>Syllables</Divider>
                    <CustomSyllableInput
                        type={"number"}
                        value={syllableCount}
                        onChange={handleSyllableChange}
                        inputProps={{min: 0}}
                    />
                    <Divider textAlign={"left"} sx={dividerStyles}>Type</Divider>
                    <Box>
                        <FormControl sx={{minWidth: 100}}>
                            <InputLabel id={"stutter-type-select-label"}>Type</InputLabel>
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
                            <InputLabel id={"pc-type-select-label"}>Phys. Conc.</InputLabel>
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
                    <Button variant={"contained"} sx={{width: '40px', mb: 1, mt: 1}}
                            onClick={handleDonePopoverClose}>Done</Button>
                </Stack>
            </Box>
        </Popover>
    );
};

export default AudioPlayerPopover;