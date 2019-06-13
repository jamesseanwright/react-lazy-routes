import React from 'react';

const RouterContext = React.createContext(
  () => undefined,
);

const defaultRouterState = {
  Page: () => <p>Pick a route</p>,
};

// TODO: history API
export const withRoutes = routes =>
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

export const Link = ({ href, ...rest }) => (
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
