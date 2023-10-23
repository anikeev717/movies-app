import React from 'react';
import { Rate, Tooltip, Spin } from 'antd';

import { MoviesAppConsumer } from '../movies-app-context/movies-app-context';
import { trimText } from '../../services/trim-text-function/trim-text-function';
import { GetMovieItem } from '../../types/type';
import defaultSrc from '../../assets/img/movie-item-default-image.jpg';

type MovieItemState = { loading: boolean; imgError: boolean };

export class MovieItem extends React.Component<GetMovieItem, MovieItemState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps: GetMovieItem = {
    src: defaultSrc,
    title: 'Title not specified',
    date: 'Date not specified',
    overview: `Description not specified`,
    rateValue: '0',
    rateColor: '#66E900',
    rating: 0,
    genres: [-1],
    id: 0,
  };

  constructor(props: GetMovieItem) {
    super(props);
    this.state = {
      loading: false,
      imgError: false,
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

          const onImgError = (): void => {
            this.setState({ imgError: true });
          };

          const genresItems: JSX.Element[] = genres.map(
            (item: number): JSX.Element => (
              <li key={item} className="genre-item">
                {genresList[item]}
              </li>
            )
          );

          const { loading, imgError } = this.state;
          const showRating: number = rating || localRating[id];
          const preloader: JSX.Element = <Spin size="large" />;
          const defaultImage: JSX.Element | null = imgError ? (
            <img className="image" src={defaultSrc} alt="pic" />
          ) : null;

          if (loading) return preloader;

          return (
            <div className="card-content">
              <div className="image-wrapper">
                <img className="image" src={src} alt="pic" onError={onImgError} />
                {defaultImage}
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
