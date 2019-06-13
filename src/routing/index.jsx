import React from 'react';

const RouterContext = React.createContext(
  () => undefined,
);

const defaultRouterState = {
  Page: () => <p>Pick a route</p>,
};

const createTo = (routes, setState) =>
  /* Memoised so we can avoid allocating
   * new func references on each render
   * TODO: profile before & after memo */
  React.useMemo(
    () => async destHref => {
      /* TODO: error handling for missing
       * route (pass NotFound comp prop?) */
      const Page = routes.get(destHref);
      setState({ Page });
    },
    setState,
  );

// TODO: history API
export const withRoutes = routes =>
  Component =>
    props => {
      const [state, setState] = React.useState(defaultRouterState);
      const to = createTo(routes, setState);

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
