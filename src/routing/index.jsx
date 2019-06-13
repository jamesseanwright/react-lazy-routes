import React from 'react';

const RouterContext = React.createContext();

// TODO: React.useMemo?
const createTo = (routes, setPage, { notFound }) =>
  destHref => {
    // TODO: injectable history for tests
    // TODO: popstate
    history.pushState({}, null, destHref);

    setPage(() => routes.has(destHref)
      ? routes.get(destHref)
      : () => notFound
    );
  };

export const PageHost = props => {
  const [Page, setPage] = React.useState(() => () => props.initial);
  const to = createTo(props.routes, setPage, props);

  return (
    <RouterContext.Provider value={to}>
      <React.Suspense fallback={props.loading}>
        {props.children(Page)}
      </React.Suspense>
    </RouterContext.Provider>
  );
};

export const Link = ({ href, ...rest }) => {
  const to = React.useContext(RouterContext);

  return (
    <a
      {...rest}
      href={href}
      onClick={e => {
        e.preventDefault();
        to(href);
      }}
    />
  );
};
