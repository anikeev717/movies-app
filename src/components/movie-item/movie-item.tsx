import React from 'react';
import { Rate, Tooltip, Spin } from 'antd';

import { GetMovieItem } from '../../types/type';
import { MoviesAppConsumer } from '../movies-app-context/movies-app-context';
import { trimText } from '../../services/trim-text-function/trim-text-function';
import defaultSrc from '../../assets/img/movie-item-default-image.jpg';
import { GetResourcesMethod } from '../../services/movies-api/movies-api';

interface MovieItemProps extends GetMovieItem {
  getResources: (url: string, method?: GetResourcesMethod) => Promise<ResponseType>;
}

interface MovieItemState {
  loading: boolean;
  url: string;
}

export class MovieItem extends React.Component<MovieItemProps, MovieItemState> {
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

  constructor(props: MovieItemProps) {
    super(props);
    this.state = {
      loading: false,
      url: '',
    };
  }

  componentDidMount(): void {
    const { src } = this.props;
    this.createImageUrl(src);
  }

  createImageUrl = (src: string): void => {
    const { getResources } = this.props;
    if (src) {
      getResources(src, 'blob')
        .then((image) => this.setState({ url: URL.createObjectURL(image as unknown as Blob) }))
        .catch(() => this.setState({ url: defaultSrc }));
    } else this.setState({ url: defaultSrc });
  };

  render() {
    const { title, date, genres, overview, rateValue, rateColor, rating, id } = this.props;

    const trimTitle: string = trimText(title, 18);
    const titleTooltip: string | null = title.length > trimTitle.length ? title : null;
    const trimOverview: string = trimText(overview, 200);

    return (
      <MoviesAppConsumer>
        {({ guestSessionId, genresList, rateMovie, localRating }): JSX.Element => {
          const updateRating = (guestId: string, movieId: number, value: number): void => {
            const { loading } = this.state;
            if (!loading && value !== localRating[id]) {
              this.setState({
                loading: true,
              });
              rateMovie(guestId, movieId, value).then(() => {
                this.setState({ loading: false });
              });
            }
          };

          const genresItems: JSX.Element[] = genres.map(
            (item: number): JSX.Element => (
              <li key={item} className="genre-item">
                {genresList[item]}
              </li>
            )
          );

          const showRating: number = localRating[id] || rating;

          const { loading, url } = this.state;

          const preloader: JSX.Element = <Spin size="large" />;
          const targetImage: JSX.Element = !url ? preloader : <img className="image" src={url} alt="pic" />;

          if (loading) return preloader;

          return (
            <div className="card-content">
              <div className="image-wrapper">{targetImage}</div>
              <div className="info">
                <Tooltip title={titleTooltip}>
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
