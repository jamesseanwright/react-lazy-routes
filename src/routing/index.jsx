import React from 'react';

const RouterContext = React.createContext();

// TODO: injectable history for tests
const useHistory = ({ initial, routes, notFound }) => {
  const initialState = {
    Page: () => initial,
    href: '/'
  };

  const [{ Page }, setState] = React.useState(initialState);

  // TODO: React.useMemo?
  const to = (href, shouldPush = true) => {
    const Page = routes.has(href)
      ? routes.get(href)
      : () => notFound

    if (shouldPush) {
      history.pushState({ href }, null, href);
    }

    setState({ Page, href });
  };

  React.useEffect(() => {
    const onPop = (({ state }) => {
      to(state.href, false);
    });

    window.addEventListener('popstate', onPop);

    return () => {
      window.removeEventListener('popstate', onPop);
    };
  }, []);

  return [Page, to];
};

export const PageHost = props => {
  const [Page, to] = useHistory(props);

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
