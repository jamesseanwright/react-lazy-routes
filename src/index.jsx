import React from 'react';
import ReactDOM from 'react-dom';

const RouterContext = React.createContext(
  () => undefined,
);

const routes = new Map([
  ['/bacon', React.lazy(() => import('./pages/Bacon.jsx'))],
  ['/hipster', React.lazy(() => import('./pages/Hipster.jsx'))],
  ['/lorem', React.lazy(() => import('./pages/Lorem.jsx'))],
  ['/trump', React.lazy(() => import('./pages/Trump.jsx'))],
]);

const defaultRouterState = {
  Page: () => <p>Pick a route</p>,
};

// TODO: history API
// TODO: React.Lazy version!
const withRoutes = routes =>
  Component =>
    props => {
      const [state, setState] = React.useState(defaultRouterState);
      // TODO: define outside of function
      const to = async destHref => {
        //TODO: error handling for missing route
        const Page = routes.get(destHref);
        setState({ Page });
      };

      return (
        <RouterContext.Provider value={to}>
          <Component {...props} {...state} />
        </RouterContext.Provider>
      );
    };

const Link = ({ href, ...rest }) => (
  <RouterContext.Consumer>
    {to =>
      <a
        {...rest}
        href={href}
        onClick={e => {
          e.preventDefault();
          to(href);
        }}
      />
    }
  </RouterContext.Consumer>
);

const App = ({ Page, ...rest }) => (
  <>
    <nav>
      <Link href="/trump">Trump</Link>
    </nav>
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
