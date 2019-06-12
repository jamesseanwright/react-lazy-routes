import React from 'react';
import ReactDOM from 'react';

const RouterContext = React.createContext({
  href: '',
  to: () => undefined,
});

const routes = new Map([
  ['/bacon', import('./pages/Bacon.jsx')],
  ['/hipster', import('./pages/Hipster.jsx')],
  ['/lorem', import('./pages/Lorem.jsx')],
  ['/trump', import('./pages/Trump.jsx')],
]);

const defaultRouterState = {
  isLoading: true,
  Page: () => <p>Pick a route</p>,
};

// TODO: history API
const withRoutes = routes =>
  Component =>
    ({ children, ...rest }) => {
      const [{ isLoading, Page }, setState] = useState(defaultRouterState);

      // TODO: define outside of function
      const to = async destHref => {
        setState({
          isLoading: true,
        });

        //TODO: error handling for missing route
        const loadPage = routes.get(destHref);
        const Page = await loadPage();

        setState({
          isLoading: false,
          Page,
        });
      };

      <RouterContext.Provider value={{ href, to }}>
        <Component {...rest}>
          {children({ isLoading, Page })}
        </Component>
      </RouterContext.Provider>
    };

const Link = ({ children, href, ...rest }) => (
  <RouterContext.Consumer>
    {({ href, to }) =>
      <a
        {...rest}
        href={href}
        onClick={e => {
          e.preventDefault();
          to(href);
        }}
      >
        {children}
      </a>
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
