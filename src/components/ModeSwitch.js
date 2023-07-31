import {styled} from "@mui/material/styles";
import {Switch} from "@mui/material";
import ModeIcon from '@mui/icons-material/Mode';
import AutoModeIcon from '@mui/icons-material/AutoMode';

const ModeSwitch = styled((props) => {
    const { ...other } = props;
    return (
        <Switch
            icon={<AutoModeIcon />}
            checkedIcon={<ModeIcon />}
            {...other}
        />
    );
})(({ theme }) => ({
    // Remove the previous SVG-related style code.
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
        width: 32,
        height: 32,
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        borderRadius: 20 / 2,
    },
}));


export default ModeSwitch;
