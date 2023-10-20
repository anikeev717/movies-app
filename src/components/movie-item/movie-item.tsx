import React from 'react';
import { Rate, Tooltip, Spin } from 'antd';

import { MoviesAppConsumer } from '../movies-app-context/movies-app-context';
import { trimText } from '../../services/trim-text-function/trim-text-function';
import { GetMovieItem } from '../../types/type';

type ItemProps = { loading: boolean };

export class MovieItem extends React.Component<GetMovieItem, ItemProps> {
  constructor(props: GetMovieItem) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  render() {
    const { src, title, date, genres, overview, rateValue, rateColor, rating, id } = this.props;

    const trimTitle: string = trimText(title, 18);
    const titleToolip: string | null = title.length > trimTitle.length ? title : null;
    const trimOverview: string = trimText(overview, 200);

    return (
      <MoviesAppConsumer>
        {({ guestSessionId, genresList, rateMovie, localRating }): JSX.Element => {
          const updateRating = (guestId: string, movieId: number, value: number): void => {
            this.setState({
              loading: true,
            });
            rateMovie(guestId, movieId, value).then(() => {
              this.setState({ loading: false });
            });
          };

          const genresItems = genres.map((item) => (
            <li key={item} className="genre-item">
              {genresList[item]}
            </li>
          ));

          const { loading } = this.state;
          const showRating: number = rating || localRating[id];
          const preloader: JSX.Element = <Spin size="large" />;

          if (loading) return preloader;

          return (
            <div className="card-content">
              <div className="image-wrapper">
                <img className="image" src={src} alt="pic" />
              </div>
              <div className="info">
                <Tooltip title={titleToolip}>
                  <h4 className="title">{trimTitle}</h4>
                </Tooltip>
                <span className="rate" style={{ borderColor: rateColor }}>
                  {rateValue}
                </span>
                <span className="date">{date}</span>
                <ul className="genre-list">{genresItems}</ul>
                <p className="description">{trimOverview}</p>
                <Rate
                  allowHalf
                  allowClear={false}
                  defaultValue={showRating}
                  count={10}
                  onChange={(value: number) => updateRating(guestSessionId, id, value)}
                />
              </div>
            </div>
          );
        }}
      </MoviesAppConsumer>
    );
  }
}
