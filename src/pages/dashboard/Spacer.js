import {useState} from 'react';
import AddTextPopover from "./popovers/AddTextPopover";



const Spacer = ({leftId, rightId, onClick}) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOnClick = (event) => {
        setAnchorEl(event.currentTarget);
    }
    return (
        <span
            style={{cursor: 'cell', backgroundColor: 'transparent', display: 'inline-block', width: '10px', height: '15px'}}
            onClick={handleOnClick}
        >
            <AddTextPopover leftId={leftId} rightId={rightId} setAnchorEl={setAnchorEl} anchorEl={anchorEl}/>
        </span>
    );
};

export default Spacer;