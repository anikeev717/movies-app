import React from 'react';

import type { Context } from '../app/app';

const { Provider: MoviesAppProvider, Consumer: MoviesAppConsumer } = React.createContext<Context>(null!);

export { MoviesAppProvider, MoviesAppConsumer };
