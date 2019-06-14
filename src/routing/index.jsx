import React from 'react';

const RouterContext = React.createContext();

const buildStateArgs = href =>
  [{ href }, null, href];

const useHistory = (to, initialHref) => {
  const push = href => {
    to(href);
    history.pushState(...buildStateArgs(href));
  };

  React.useEffect(() => {
    // Sets root entry on history stack
    history.replaceState(...buildStateArgs(initialHref));

    const onPop = (({ state }) => {
      to(state.href);
    });

    window.addEventListener('popstate', onPop);

    return () => {
      window.removeEventListener('popstate', onPop);
    };
  }, []);

  return push;
};

const getPage = (routes, href, notFound) =>
  routes.has(href)
    ? routes.get(href)
    : () => notFound;

// TODO: injectable history, window etc.
const useRouting = ({ routes, initialHref, notFound }) => {
  const initialState = {
    Page: getPage(routes, initialHref, notFound),
    href: initialHref,
  };

  const [{ Page }, setState] = React.useState(initialState);

  // TODO: React.useMemo?
  const to = href => {
    const Page = getPage(routes, href, notFound);
    setState({ Page, href });
  };

  return [Page, to];
};

export const PageHost = props => {
  const [Page, to] = useRouting(props);
  const push = useHistory(to, props.initialHref);

  return (
    <RouterContext.Provider value={push}>
      <React.Suspense fallback={props.loading}>
        {props.children(Page)}
      </React.Suspense>
    </RouterContext.Provider>
  );
};

export const Link = ({ href, ...rest }) => {
  const push = React.useContext(RouterContext);

  return (
    <a
      {...rest}
      href={href}
      onClick={e => {
        e.preventDefault();
        push(href);
      }}
    />
  );
};
