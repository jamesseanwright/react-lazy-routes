import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Nav from './Nav.jsx';
import { Router } from './routing';

const routes = new Map<string, React.ComponentType>([
  ['/', () => <p>Pick an Ipsum!</p>],
  ['/lorem', React.lazy(() => import('./pages/Lorem'))],
  ['/bacon', React.lazy(() => import('./pages/Bacon'))],
  ['/hipster', React.lazy(() => import('./pages/Hipster'))],
  ['/office', React.lazy(() => import('./pages/Office'))],
]);

const paths = [...routes.keys(), '/missing'].slice(1);

const App = () => (
  <Router routes={routes} initialPath="/" notFound={<p>Route not found</p>}>
    {Page => (
      <>
        <Nav paths={paths} />
        <React.Suspense fallback={<div className="loading-spinner" />}>
          <Page />
        </React.Suspense>
      </>
    )}
  </Router>
);

ReactDOM.render(<App />, document.body.querySelector('.app'));
