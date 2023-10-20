import React from 'react';
import { Spin, Alert } from 'antd';

import { MoviesAppConsumer } from '../movies-app-context/movies-app-context';

type NonData = null | JSX.Element;

export const NonDataItem: React.FC<Record<string, never>> = () => (
  <MoviesAppConsumer>
    {({ loading, error, network, totalElements, requestLine }): JSX.Element => {
      const emptyAlert: NonData =
        !totalElements && !loading && !error && network ? (
          <Alert message="Подсказка" description="Здесь появятся результаты ваших запросов!" type="info" showIcon />
        ) : null;

      const noData: boolean = !totalElements && !!requestLine && !error && !loading && network;
      const dataAlert: NonData = noData ? (
        <Alert message="Внимание" description="По данному запросу нет результатов!" type="warning" showIcon />
      ) : null;
      const networkAlert: NonData =
        !network && !loading ? (
          <Alert message="Ошибка" description="Отсутствует интернет соединение!" type="error" showIcon />
        ) : null;
      const errorAlert: NonData =
        error && !loading && network ? (
          <Alert message="Ошибка" description="Произошла ошибка запроса к серверу!" type="error" showIcon />
        ) : null;
      const preloader: NonData = loading ? <Spin size="large" /> : null;

      return (
        <React.Fragment key="content">
          {emptyAlert}
          {dataAlert}
          {errorAlert}
          {networkAlert}
          {preloader}
        </React.Fragment>
      );
    }}
  </MoviesAppConsumer>
);
