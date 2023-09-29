import React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { styled } from '@mui/material/styles';

const StyledPulseLoadingButton = styled(LoadingButton)`
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.7;
    }
    50% {
      transform: scale(1.05);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0.7;
    }
  }

  ${({ shouldPulse }) =>
          shouldPulse && `
      &:not([disabled]) {
        animation: pulse 1.5s infinite;
      }
    `
  }
`;

const PulsingLoadingButton = ({shouldPulse, ...props}) => {
    return <StyledPulseLoadingButton shouldPulse={shouldPulse}{...props} />;
}

export default PulsingLoadingButton;
