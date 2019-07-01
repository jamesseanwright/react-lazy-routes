import React from 'react';

const RouterContext = React.createContext();
const buildStateArgs = path => [{ path }, null, path];

const useHistory = (to, initialPath) => {
  const push = path => {
    to(path);
    history.pushState(...buildStateArgs(path));
  };

  React.useEffect(() => {
    /* Replaces current entry on history
     * stack to include expected state */
    history.replaceState(...buildStateArgs(initialPath));

    const onPop = ({ state }) => {
      to(state.path);
    };

    window.addEventListener('popstate', onPop);

    return () => {
      window.removeEventListener('popstate', onPop);
    };
  }, []);

  return push;
};

const getPage = (routes, path, notFound) =>
  routes.has(path) ? routes.get(path) : () => notFound;

// TODO: injectable history, window etc.
const useRouting = ({ routes, initialPath, notFound }) => {
  const InitialPage = getPage(routes, initialPath, notFound);
  const [Page, setPage] = React.useState(() => InitialPage);

  const to = path => {
    const Page = getPage(routes, path, notFound);
    setPage(() => Page);
  };

  return [Page, to];
};

export const SuspensefulRouter = props => {
  const [Page, to] = useRouting(props);
  const push = useHistory(to, props.initialPath);

  return (
    <RouterContext.Provider value={push}>
      <React.Suspense fallback={props.fallback}>
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
