import React, {useState} from 'react';
import MainCard from "../../components/MainCard";
import Help from "./Help";
import {Box, Collapse, IconButton, Stack, styled} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


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


const Workspace = (props) => {
    const {children, help} = props;
    const theme = useTheme();
    const [isExpanded, setIsExpanded] = useState(true);
    return (
        <MainCard title={
            <Stack direction={"row"} sx={{alignItems: 'center'}}>
                <ExpandMore
                    expand={isExpanded}
                    onClick={() => {
                        setIsExpanded(!isExpanded)
                    }}
                    aria-expanded={isExpanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon/>
                </ExpandMore>
            <Box flexGrow={1}>
                <Help title={"Workspace"}>
                    {help}
                </Help>
            </Box>
            </Stack>
        } sx={{backgroundColor: theme.palette.warning.lighter}}
        >
            <Collapse in={isExpanded} timout={"auto"}>
                {children}
            </Collapse>
        </MainCard>
    );
};

export default Workspace;