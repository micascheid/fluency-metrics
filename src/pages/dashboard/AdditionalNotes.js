import react, {useCallback, useContext, useEffect, useState} from 'react';
import MainCard from "../../components/MainCard";
import {Box, Button, Stack, TextField, Typography} from "@mui/material";
import {StutteredContext} from "../../context/StutteredContext";
import {UPD_WS_STATUS} from "../../constants";
import {useTheme} from "@mui/material/styles";
import useStatusMessage from "./custom-hooks/useStatusMessage";
import Help from "./Help";
import React from "react";

const AdditionalNotes = (props) => {
    const {
        workspaceName,
        setCustomNotes,
        customNotes,
    } = useContext(StutteredContext);
    const {help} = props;
    const [localNotes, setLocalNotes] = useState(customNotes);
    const saveNotesDisabled = !workspaceName;
    const theme = useTheme();
    const statusMessage = useStatusMessage();


    const handleSaveNotes = () => {
        setCustomNotes(localNotes);
    }


    const handleChange = (event) => {
        const notes = event.target.value;
        setLocalNotes(notes);
    };

    useEffect(() => {
        setLocalNotes(customNotes);
    }, [customNotes]);

    return (
      <MainCard title={
          <Box flexGrow={1}>
              <Help title={"Additional Notes"}>
                  {help}
              </Help>
          </Box>
      }>
          <Stack spacing={1}>
              <TextField
                multiline
                minRows={5}
                maxRows={10}
                fullWidth
                placeholder={"Notes Here"}
                onKeyPress={(event) => {event.stopPropagation();}}
                onChange={handleChange}
                onBlur={handleSaveNotes}
                disabled={saveNotesDisabled}
                value={localNotes}
                // label={"Notes"}
              >Enter Your Notes Here</TextField>
              <Stack direction={"row"} sx={{alignItems: 'center'}} spacing={1}>
                  <Button
                      variant={"outlined"}
                      sx={{maxWidth: 105}}
                      onClick={handleSaveNotes}
                      disabled={saveNotesDisabled}
                  >Save Notes</Button>
                  <Typography
                      variant={"body"}
                      sx={{color: theme.palette.success.main}}
                  >{statusMessage}</Typography>
              </Stack>

          </Stack>
      </MainCard>
    );
};

export default AdditionalNotes;