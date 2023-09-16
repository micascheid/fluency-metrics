import react, {useCallback, useContext, useEffect, useState} from 'react';
import MainCard from "../../components/MainCard";
import {Button, Stack, TextField} from "@mui/material";
import {StutteredContext} from "../../context/StutteredContext";

const CustomNotes = () => {
    const {
        workspaceName,
        setCustomNotes,
        customNotes,
    } = useContext(StutteredContext);
    const [localNotes, setLocalNotes] = useState(customNotes);
    const saveNotesDisabled = !workspaceName;

    const handleSaveNotes = () => {
        setCustomNotes(localNotes);
    }


    const handleChange = (event) => {
        const notes = event.target.value;
        setLocalNotes(notes);
    };

    useEffect(() => {
        console.log("CUSTOM NOTES Local:", customNotes);
        setLocalNotes(customNotes);
    }, [customNotes]);

    return (
      <MainCard title={"Custom Notes"}>
          <Stack spacing={1}>
              <TextField
                multiline
                minRows={5}
                maxRows={15}
                fullWidth
                placeholder={"Custom Notes Here"}
                onKeyPress={(event) => {event.stopPropagation();}}
                onChange={handleChange}
                onBlur={handleSaveNotes}
                disabled={saveNotesDisabled}
                value={localNotes}
                // label={"Notes"}
              >Enter Your Custom Notes Here</TextField>
              <Button
                  variant={"contained"}
                  sx={{maxWidth: 105}}
                  onClick={handleSaveNotes}
                  disabled={saveNotesDisabled}
              >Save Notes</Button>
          </Stack>
      </MainCard>
    );
};

export default CustomNotes;