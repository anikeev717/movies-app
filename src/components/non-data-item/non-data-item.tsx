import React from 'react';
import { Spin, Alert } from 'antd';

import { MoviesAppConsumer } from '../movies-app-context/movies-app-context';

type NonData = JSX.Element | null;

export const NonDataItem: React.FC<Record<string, never>> = () => (
  <MoviesAppConsumer>
    {({ loading, error, network, totalElements, requestLine }): JSX.Element => {
      const emptyAlert: NonData =
        !requestLine && !loading && !error && network ? (
          <Alert message="Info" description="The results of your queries will appear here!" type="info" showIcon />
        ) : null;

      const noData: boolean = !totalElements && !!requestLine && !error && !loading && network;
      const dataAlert: NonData = noData ? (
        <Alert message="Warning" description="There are no results for this request!" type="warning" showIcon />
      ) : null;
      const networkAlert: NonData =
        !network && !loading ? (
          <Alert message="Alert" description="No internet connection!" type="error" showIcon />
        ) : null;
      const errorAlert: NonData =
        error && !loading && network ? (
          <Alert message="Error" description="A server request error occurred!" type="error" showIcon />
        ) : null;
      const preloader: NonData = loading ? <Spin size="large" /> : null;

      return (
        <React.Fragment key="content">
          <div className="main-alert">
            {emptyAlert}
            {dataAlert}
            {errorAlert}
            {networkAlert}
            {preloader}
          </div>
        </React.Fragment>
      );
    }}
  </MoviesAppConsumer>
);
