import {
    Box, Collapse,
    Divider,
    Grid, IconButton, Stack, styled,
    Tab,
    Tabs,
} from "@mui/material";
import React, {Fragment, useContext, useEffect, useState} from "react";
import MainCard from "../../components/MainCard";
import axios from "axios";
import AreYouSure from "./modals/AreYouSure";
import * as PropTypes from "prop-types";
import NewAnalysisStepper from "./NewAnalysisStepper";
import ResumeAnalysisStepper from "./ResumeAnalysisStepper";
import InstructionsAutoMode from "./InstructionsAutoMode";
import Help from "./Help";
import HelpMode from "./help-components/HelpMode";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import {useTheme} from "@mui/material/styles";


const ExpandMore = styled((props) => {
    const {expand, ...other} = props;
    return <IconButton {...other} />;
})(({theme, expand}) => ({
    transform: !expand ? 'rotate(-90deg)' : 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const Mode = (props) => {
    const {
        expanded,
        help,
        setExpanded,
        setAudioFileName,
        setAudioFile,
        setFileChosen,
        isCreateNewWorkspace,
    } = props;

    const theme = useTheme();
    const [showAreYouSure, setShowAreYouSure] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [autoInstuctionsHasOverflow, setAutoInstuctHasOverflow] = useState();


    useEffect(() => {
    }, [isCreateNewWorkspace])

    const CustomTabPanel = (props) => {
        const {children, value, index, ...other} = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{pt: 0}}>
                        {children}
                    </Box>
                )}
            </div>
        );
    }

    CustomTabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
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

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleScroll = (event) => {
        const element = event.target;
        if (element.scrollHeight - element.scrollTop === element.clientHeight) {
            // User has scrolled to the bottom
            setAutoInstuctHasOverflow(false);
        } else {
            setAutoInstuctHasOverflow(true);
        }
    }

    return (
        <MainCard title={
            <Stack direction={"row"} sx={{alignItems: 'center'}}>
                <ExpandMore
                    expand={expanded}
                    onClick={() => {
                        setExpanded(!expanded)
                    }}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon/>
                </ExpandMore>
                <Box flexGrow={1}>
                    <Help title={"Start/Resume Workspace"}>
                        {help}
                    </Help>
                </Box>
            </Stack>
        }
        >
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                {showAreYouSure && <AreYouSure setAreYouSure={setShowAreYouSure}/>}
                <Grid container spacing={2}>
                    <Grid item xs={5}>
                        <Box width={"100%"}>
                            <Box sx={{mb: 2}}>
                                <Tabs value={tabValue} onChange={handleTabChange} variant={'fullWidth'}
                                      sx={{boxShadow: '0px 2px 4px rgba(0,0,0,0.2)'}}>
                                    <Tab label={"New Workspace"}/>
                                    <Tab label={"Resume Workspace"}/>
                                </Tabs>
                            </Box>
                            <Box>
                                <CustomTabPanel value={tabValue} index={0}>
                                    <NewAnalysisStepper {...props} setExpanded={setExpanded} expanded={expanded}/>
                                </CustomTabPanel>
                                <CustomTabPanel value={tabValue} index={1}>
                                    <ResumeAnalysisStepper {...props} setExpanded={setExpanded}/>
                                </CustomTabPanel>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={7}>
                        <Grid container style={{height: '100%'}} spacing={2}>
                            <Grid item xs={1}>
                                <Divider orientation={"vertical"} style={{borderColor: "darkgray"}}/>
                            </Grid>
                            <Grid item xs={11} style={{position: 'relative'}}>

                                <Box style={{overflowY: 'scroll', maxHeight: '335px'}}
                                     onScroll={handleScroll}>
                                    <InstructionsAutoMode setOverflow={setAutoInstuctHasOverflow}/>
                                </Box>
                                {autoInstuctionsHasOverflow &&
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <ArrowDropDownCircleIcon color={"primary"}/>
                                    </Box>
                                }

                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Collapse>
        </MainCard>
    );
};

export default Mode;