import React from 'react';

import { MoviesAppConsumer } from '../movies-app-context/movies-app-context';

type FormState = {
  requestLine: string;
};

export class MoviesSearchForm extends React.Component<Record<string, never>, FormState> {
  state = {
    requestLine: '',
  };

  render() {
    return (
      <MoviesAppConsumer>
        {({ updateMoviesList }): JSX.Element => {
          const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const requestLine = e.target.value.replace(/\s+/g, ' ').trimStart();
            updateMoviesList(requestLine);
            this.setState({ requestLine });
          };

          const onSubmit = (e: React.FormEvent<HTMLFormElement>) => e.preventDefault();

          const { requestLine } = this.state;
          return (
            <form className="search-form" onSubmit={onSubmit}>
              <input
                className="search-input"
                onChange={onValueChange}
                value={requestLine}
                placeholder="Type to search..."
              />
            </form>
          );
        }}
      </MoviesAppConsumer>
    );
  }
}
