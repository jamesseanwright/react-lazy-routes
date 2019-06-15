// TODO: TESTS!!!
// TODO: Convert to TS for article

import React from 'react';
import ReactDOM from 'react-dom';
import Nav from './Nav.jsx';
import { PageHost } from './routing';

const Initial = () => <p>Pick an Ipsum!</p>;

const routes = new Map([
  ['/', Initial],
  ['/bacon', React.lazy(() => import('./pages/Bacon'))],
  ['/hipster', React.lazy(() => import('./pages/Hipster'))],
  ['/lorem', React.lazy(() => import('./pages/Lorem'))],
  ['/trump', React.lazy(() => import('./pages/Trump'))],
]);

const paths = [...routes.keys(), '/missing'].slice(1);

const App = () => (
  <PageHost
    routes={routes}
    initialPath="/"
    loading={<p>Loading...</p>}
    notFound={<p>Route not found</p>}
  >
    {Page => (
      <>
        <Nav paths={paths} />
        <Page />
      </>
    )}
  </PageHost>
);

ReactDOM.render(<App />, document.body.querySelector('#app'));
