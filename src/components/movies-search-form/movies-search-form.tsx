import React from 'react';

type MoviesFormProps = {
  findMovies: (requestLine: string, targetPage?: number) => void;
};

type MoviesFormState = {
  requestLine: string;
};

export class MoviesSearchForm extends React.Component<MoviesFormProps, MoviesFormState> {
  constructor(props: MoviesFormProps) {
    super(props);
    this.state = {
      requestLine: '',
    };
  }

  render() {
    const { findMovies } = this.props;
    const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const requestLine = e.target.value.replace(/\s+/g, ' ').trimStart();
      findMovies(requestLine);
      this.setState({ requestLine });
    };
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => e.preventDefault();

    const { requestLine } = this.state;
    return (
      <form className="search" onSubmit={onSubmit}>
        <input className="search-input" onChange={onValueChange} value={requestLine} placeholder="Type to search..." />
      </form>
    );
  }
}
