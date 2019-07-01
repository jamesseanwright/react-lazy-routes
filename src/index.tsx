// TODO: TESTS!!!

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Nav from './Nav.jsx';
import { SuspensefulRouter } from './routing';

const Initial = () => <p>Pick an Ipsum!</p>;

const routes = new Map<string, React.ComponentType>([
  ['/', Initial],
  ['/bacon', React.lazy(() => import('./pages/Bacon'))],
  ['/hipster', React.lazy(() => import('./pages/Hipster'))],
  ['/lorem', React.lazy(() => import('./pages/Lorem'))],
  ['/trump', React.lazy(() => import('./pages/Trump'))],
]);

const paths = [...routes.keys(), '/missing'].slice(1);

const App = () => (
  <SuspensefulRouter
    routes={routes}
    initialPath="/"
    fallback={<p>Loading...</p>}
    notFound={<p>Route not found</p>}
  >
    {Page => (
      <>
        <Nav paths={paths} />
        <Page />
      </>
    )}
  </SuspensefulRouter>
);

ReactDOM.render(<App />, document.body.querySelector('#app'));
