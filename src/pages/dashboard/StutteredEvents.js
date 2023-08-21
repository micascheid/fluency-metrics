import React, {useContext, useEffect} from 'react';
import MainCard from "../../components/MainCard";
import {Box, Typography} from "@mui/material";
import {StutteredContext} from "../../context/StutteredContext";
import { DataGrid } from '@mui/x-data-grid';

const StutteredEvents = () => {
    const { stutteredEvents } = useContext(StutteredContext);
    const columns = [
        {field: 'id', headerName: "Event #", flex: 1},
        {field: 'type', headerName: "Type", flex: 1},
        {field: 'syllable_count', headerName: "Syllables", flex: 1},
        {field: 'duration', headerName: "Duration", flex: 1, type: 'number', align: 'left', headerAlign: 'left'},
        {field: 'ps', headerName: "Phys Conc", flex: 1, type: 'number', align: 'left', headerAlign: 'left'},
        {field: 'text', headerName: "Text", flex: 1},
    ]

    useEffect(() => {
    }, [stutteredEvents]);

    return (
      <MainCard sx={{minHeight: '800px'}}>
          <Typography variant={"h4"} sx={{pb: 3}}>Disfluency Events</Typography>
          {Object.keys(stutteredEvents).length > 0 ? (
              <DataGrid
                  rows={Object.values(stutteredEvents)}
                  columns={columns}
                  initialState={{
                      pagination: {
                          paginationModel: {page: 0, pageSize: 5}
                      },
                  }}
                  sx={{borderColor: '#000'}}
                  pageSizeOptions={[5,10]}
                  checkboxSelection
              />
          ) : (
           <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
               <Typography variant={"h4"}>Disfluency events will show up here</Typography>
           </Box>
          )
          }

      </MainCard>
    );
};

export default StutteredEvents;