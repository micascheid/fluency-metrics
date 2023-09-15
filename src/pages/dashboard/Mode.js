import {
    Box,
    Divider,
    Grid,
    Tab,
    Tabs,
} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import MainCard from "../../components/MainCard";
import axios from "axios";
import AreYouSure from "./modals/AreYouSure";
import * as PropTypes from "prop-types";
import NewAnalysisStepper from "./NewAnalysisStepper";
import ResumeAnalysisStepper from "./ResumeAnalysisStepper";
import InstructionsAutoMode from "./InstructionsAutoMode";
import Help from "./Help";
import HelpMode from "./help-components/HelpMode";


const Mode = (props) => {
    const {
        help,
        setAudioFileName,
        setAudioFile,
        setFileChosen,
        isCreateNewWorkspace,
    } = props;
    const [showAreYouSure, setShowAreYouSure] = useState(false);
    const [tabValue, setTabValue] = useState(0);


    useEffect(() => {
        console.log("MODE CREATE NEW WORKSPACE:", isCreateNewWorkspace);
    },[isCreateNewWorkspace])

    const CustomTabPanel = (props) => {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ pt: 0 }}>
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

    return (
        <MainCard sx={{minHeight: "335px", maxHeight: "400pxs"}} title={
            <Help title={"Start/Resume Analysis"}>
                <HelpMode />
            </Help>
        }>
            {showAreYouSure && <AreYouSure setAreYouSure={setShowAreYouSure}/>}
            <Grid container spacing={2}>
                <Grid item xs={5} sm={5} md={5} lg={5}>
                    <Box width={"100%"}>
                        <Box sx={{mb: 2}} >
                            <Tabs value={tabValue} onChange={handleTabChange} variant={'fullWidth'} sx={{boxShadow: '0px 2px 4px rgba(0,0,0,0.2)'}}>
                                <Tab  label={"New Analysis"}/>
                                <Tab label={"Resume Analysis"}/>
                            </Tabs>
                        </Box>
                        <Box>
                            <CustomTabPanel value={tabValue} index={0}>
                                <NewAnalysisStepper {...props}/>
                            </CustomTabPanel>
                            <CustomTabPanel value={tabValue} index={1}>
                                <ResumeAnalysisStepper {...props}/>
                            </CustomTabPanel>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={7} sm={7} md={7} lg={7}>
                    <Grid container style={{height: '100%'}} spacing={2}>
                        <Grid item xs={1} sm={1} md={1} lg={1}>
                            <Divider orientation={"vertical"} style={{borderColor: "darkgray"}}/>
                        </Grid>
                        <Grid item xs={11} sm={11} md={11} lg={11}>
                            <Box style={{ overflowY: 'scroll', maxHeight: '335px' }}>
                                <InstructionsAutoMode />
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </MainCard>

    );
};

export default Mode;