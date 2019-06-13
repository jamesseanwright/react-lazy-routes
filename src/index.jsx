import React from 'react';
import ReactDOM from 'react-dom';
import Nav from './Nav.jsx';
import { withRoutes } from './routing/index.jsx'; // TODO: configure node-resolve

const routes = new Map([
  ['/bacon', React.lazy(() => import('./pages/Bacon.jsx'))],
  ['/hipster', React.lazy(() => import('./pages/Hipster.jsx'))],
  ['/lorem', React.lazy(() => import('./pages/Lorem.jsx'))],
  ['/trump', React.lazy(() => import('./pages/Trump.jsx'))],
]);

const paths = [...routes.keys()];

const App = ({ Page, ...rest }) => (
  <>
    <Nav paths={paths} />
    {/* TODO: abstract React.Suspense?! */}
    <React.Suspense fallback={<p>Loading!</p>}>
      <Page {...rest} />
    </React.Suspense>
  </>
);

const RouteAwareApp = withRoutes(routes)(App);

ReactDOM.render(
  <RouteAwareApp />,
  document.body.querySelector('#app'),
);
