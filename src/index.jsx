import React from 'react';
import ReactDOM from 'react-dom';

const RouterContext = React.createContext(
  () => undefined,
);

const routes = new Map([
  ['/bacon', () => import('./pages/Bacon.jsx')],
  ['/hipster', () => import('./pages/Hipster.jsx')],
  ['/lorem', () => import('./pages/Lorem.jsx')],
  ['/trump', () => import('./pages/Trump.jsx')],
]);

const defaultRouterState = {
  isLoading: true,
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
        setState({
          isLoading: true,
        });

        //TODO: error handling for missing route
        const loadPage = routes.get(destHref);
        const { Page } = await loadPage();

        setState({
          isLoading: false,
          Page,
        });
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

const App = ({ isLoading, Page, ...rest }) => (
  <>
    <nav>
      <Link href="/trump">Trump</Link>
    </nav>
    {isLoading ? <p>Loading...</p> : <Page {...rest} />}
  </>
);

const RouteAwareApp = withRoutes(routes)(App);

ReactDOM.render(
  <RouteAwareApp />,
  document.body.querySelector('#app'),
);
