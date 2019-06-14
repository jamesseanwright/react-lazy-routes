import React from 'react';
import ReactDOM from 'react-dom';
import Nav from './Nav.jsx';
import { PageHost } from './routing/index.jsx'; // TODO: configure node-resolve

const Initial = () => <p>Pick an Ipsum!</p>;

const routes = new Map([
  ['/', Initial],
  ['/bacon', React.lazy(() => import('./pages/Bacon.jsx'))],
  ['/hipster', React.lazy(() => import('./pages/Hipster.jsx'))],
  ['/lorem', React.lazy(() => import('./pages/Lorem.jsx'))],
  ['/trump', React.lazy(() => import('./pages/Trump.jsx'))],
]);

const paths = [...routes.keys(), '/missing'].slice(1);

const App = () => (
  <PageHost
    routes={routes}
    initialHref="/"
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

ReactDOM.render(
  <App />,
  document.body.querySelector('#app'),
);
