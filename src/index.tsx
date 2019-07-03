import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Nav from './Nav.jsx';
import { SuspensefulRouter } from './routing';

const routes = new Map<string, React.ComponentType>([
  ['/', () => <p>Pick an Ipsum!</p>],
  ['/lorem', React.lazy(() => import('./pages/Lorem'))],
  ['/bacon', React.lazy(() => import('./pages/Bacon'))],
  ['/hipster', React.lazy(() => import('./pages/Hipster'))],
  ['/office', React.lazy(() => import('./pages/Office'))],
]);

const paths = [...routes.keys(), '/missing'].slice(1);

const App = () => (
  <SuspensefulRouter
    routes={routes}
    initialPath="/"
    fallback={<div className="loading-spinner" />}
    notFound={<p>Route not found</p>}
    header={<Nav paths={paths} />}
  >
    {Page => <Page />}
  </SuspensefulRouter>
);

ReactDOM.render(<App />, document.body.querySelector('.app'));
