import React, {useContext} from 'react';
import MainCard from "../../components/MainCard";
import {Box, Typography} from "@mui/material";
import {StutteredContext} from "../../context/StutteredContext";
import { DataGrid } from '@mui/x-data-grid';

const StutteredEvents = () => {
    const { stutteredCount, stutteredEventsList } = useContext(StutteredContext);
    const columns = [
        {field: 'id', headerName: "Event #", flex: 1},
        {field: 'type', headerName: "Type", flex: 1},
        {field: 'duration', headerName: "Duration", flex: 1, type: 'number', align: 'left', headerAlign: 'left'},
        {field: 'ps', headerName: "Phys Conc", flex: 1, type: 'number', align: 'left', headerAlign: 'left'},
        {field: 'text', headerName: "Text", flex: 1},
    ]

    const rows = [
        {id: 1, type: "Prolongation", duration: 4, ps: 1, text: "asdf..."},
        {id: 2, type: "Interjection", duration: 2, ps: 0, text: "um"},
        {id: 3, type: "Repetition", duration: 2.5, ps: 2, text: "tw-tw-tw"},
    ]


    return (
      <MainCard sx={{minHeight: '400px'}}>
          <Typography variant={"h4"} sx={{pb: 3}}>Disfluency Events</Typography>
          {stutteredEventsList.length > 0 ? (
              <DataGrid
                  rows={stutteredEventsList}
                  columns={columns}
                  initiaState={{
                      pagination: {
                          paginationModel: {page: 0, pageSize: 2}
                      },
                  }}
                  sx={{borderColor: '#000'}}
                  pageSizeOptions={[2,10]}
                  checkboxSelection
              />
          ) : (
           <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
               <Typography variant={"h4"}>Get or provide transcription and mark disfluency events to get started</Typography>
           </Box>
          )
          }

      </MainCard>
    );
};

export default StutteredEvents;