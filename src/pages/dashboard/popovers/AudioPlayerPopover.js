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
import {repSyllable, repWholeWord, block, prolongation, interjection} from "../../../constants";



const AudioPlayerPopover = ({anchorEl, setAnchorEl, popoverOpen, setPopoverOpen, stutteredWords, region, exists, setPopoverColor}) => {
    const {
        transcriptionObj,
        setTranscriptionObj,
        kiStutteredRegions,
        setkiStutteredRegions,
        addStutteredEventWaveForm,
        updateStutteredEventWaveForm,
        stutteredEvents,
        removeStutteredEventsWaveForm,
    } = useContext(StutteredContext);

    const stutteredEvent = exists ? stutteredEvents[region.id] : null;
    const [stutterType, setStutterType] = useState(exists ? stutteredEvent["type"] : 'None');
    const [pcVal, setPcVal] = useState(exists ? stutteredEvent["ps"] : '');
    const [syllableCount, setSyllableCount] = useState(exists ? stutteredEvent["syllable_count"] : 0);
    const typeList = [repWholeWord, repSyllable, prolongation, block, interjection];
    const pcList = [0, 1, 2, 3, 4, 5];
    const doneDisabled = !(syllableCount > 0 && stutterType !== 'None');
    const stutteredWordsDisplay = (words) => {
        return Object.values(words).map(word_obj => word_obj.punctuated_word).join(' ');
    };
    const [localStutteredWords, setLocalStutteredWords] = useState('');


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

        newTranscriptionObj[insertKey] = {
            confidence: 1,
            end: end,
            start: start,
            stuttered: true,
            syllable_count: syllableCount,
            punctuated_word: localStutteredWords
        }
        newTranscriptionObj = reIndexKeys(newTranscriptionObj);
        setTranscriptionObj(newTranscriptionObj);
    };

    const handleDonePopoverClose = () => {
        updateTranscriptionObj();
        const wordKeys = Object.keys(stutteredWords);
        const insertKey = wordKeys[0];
        if (!(stutteredEvents.length === 0) && stutteredEvents[region.id]){
            updateStutteredEventWaveForm(region, syllableCount, pcVal, localStutteredWords, stutterType);
        } else {
            addStutteredEventWaveForm(region, syllableCount, pcVal, localStutteredWords, stutterType, insertKey);
            let changeRegion = kiStutteredRegions[region.id];
            changeRegion.color = "rgba(255, 153, 10, .5)";
            changeRegion.resize = false;
            changeRegion.drag = false;
            setkiStutteredRegions(prevRegions => {
                return {
                    ...prevRegions,
                    [region.id]: changeRegion
                }
            });
        }
        setPopoverOpen(false);
        setAnchorEl(null);
    };

    const handleChange = (event) => {
        const words = event.target.value;
        if (words !== localStutteredWords) {
            setLocalStutteredWords(words);
        }
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
        removeStutteredEventsWaveForm(region);
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
            transitionDuration={0}
        >
            <Box sx={{minWidth: 200}}>
                <Stack direction={"column"} sx={{pl: 1, pr: 1}}>
                    <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                        <IconButton onClick={handlePopoverClose}>
                            <CloseIcon/>
                        </IconButton>
                        <IconButton onClick={(event) => {
                            handleRegionDelete();
                            handlePopoverClose(event);
                        }}
                        >
                            <DeleteForeverIcon sx={{color: 'red'}}/>
                        </IconButton>
                    </Box>
                    <Divider textAlign={"left"} sx={dividerStyles}>Stuttered Text</Divider>
                    <Box sx={{display: 'flex', alignItems: "center", justifyContent: "left"}}>
                        <CustomWordInput
                            value={localStutteredWords}
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                            style={{width: "100%"}}
                        />
                    </Box>
                    <Divider textAlign={"left"} sx={dividerStyles}>Syllables and Type</Divider>
                    <Stack direction={"row"} spacing={1}>
                        <CustomSyllableInput
                            type={"number"}
                            value={syllableCount}
                            onChange={handleSyllableChange}
                            inputProps={{min: 0}}
                        />
                        <Box>
                            <FormControl sx={{minWidth: 100}}>
                                {/*<InputLabel id={"stutter-type-select-label"}>Type</InputLabel>*/}
                                <Select
                                    labelId={"stutter-type-select-label"}
                                    id={"select-stutter"}
                                    value={stutterType}
                                    onChange={handleStutterTypeChange}
                                    // label={"type"}
                                >
                                    <MenuItem value={'None'}>
                                        <em>None</em>
                                    </MenuItem>
                                    {typeList.map((type, ind) => (
                                        <MenuItem key={ind} value={type}>{type}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Stack>
                    <Divider textAlign={"left"} sx={dividerStyles}>Physical Concomitants</Divider>
                    <Box>
                        <FormControl sx={{minWidth: 100}}>
                            <InputLabel id={"pc-type-select-label"}>P. Conc.</InputLabel>
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
                    <Button
                        variant={"contained"}
                        disabled={doneDisabled}
                        sx={{width: '40px', mb: 1, mt: 1}}
                            onClick={handleDonePopoverClose}>Confirm</Button>
                </Stack>
            </Box>
        </Popover>
    );
};

export default AudioPlayerPopover;