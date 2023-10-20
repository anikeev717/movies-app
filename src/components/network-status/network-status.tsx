import React from 'react';

type NetworkStatusProps = {
  networkSetState: () => void;
};

export const NetworkStatus: React.FC<NetworkStatusProps> = ({ networkSetState }): JSX.Element => {
  window.ononline = (): void => {
    networkSetState();
  };
  window.onoffline = (): void => {
    networkSetState();
  };
  return <div />;
};
