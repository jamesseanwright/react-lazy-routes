import * as React from 'react';

interface HistoryState {
  path: string;
}

interface PopEvent {
  state: HistoryState;
}

interface RouterProps {
  routes: RoutesMap;
  initialPath: string;
  notFound: NonNullable<React.ReactNode>;
  fallback: NonNullable<React.ReactNode>;
  children(Page: React.ComponentType): React.ReactNode;
}

type To = (path: string) => void;
type HistoryStateBuilder = (path: string) => [HistoryState, string, string];
type RoutesMap = Map<string, React.ComponentType>;
type RoutingHook = (props: RouterProps) => [React.ComponentType, To];

const noOp = () => undefined;
const RouterContext = React.createContext<To>(noOp);

const buildStateArgs: HistoryStateBuilder = (path: string) => [
  { path },
  '',
  path,
];

const useHistory = (to: To, initialPath: string) => {
  const push = (path: string) => {
    to(path);
    history.pushState(...buildStateArgs(path));
  };

  React.useEffect(() => {
    /* Replaces current entry on history
     * stack to include expected state */
    history.replaceState(...buildStateArgs(initialPath));

    const onPop = ({ state }: PopEvent) => {
      to(state.path);
    };

    window.addEventListener('popstate', onPop);

    return () => {
      window.removeEventListener('popstate', onPop);
    };
  }, []);

  return push;
};

const getPage = (routes: RoutesMap, path: string, notFound: React.ReactNode) =>
  routes.get(path) || (() => <>{notFound}</>); // React.FC must return ReactElement

const useRouting: RoutingHook = ({ routes, initialPath, notFound }) => {
  const InitialPage = getPage(routes, initialPath, notFound);

  const [Page, setPage] = React.useState<React.ComponentType>(
    () => InitialPage,
  );

  const to = (path: string) => {
    const Page = getPage(routes, path, notFound);
    setPage(() => Page);
  };

  return [Page, to];
};

export const SuspensefulRouter: React.FC<RouterProps> = props => {
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

export const Link: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  href,
  ...rest
}) => {
  const push = React.useContext(RouterContext);

  return (
    <a
      {...rest}
      href={href}
      onClick={e => {
        e.preventDefault();

        if (href) {
          push(href);
        }
      }}
    />
  );
};
