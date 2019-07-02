import * as React from 'react';
import { mount } from 'enzyme';
import { Link, SuspensefulRouter } from '../routing';

// TODO: better naming
describe('router', () => {
  const initialPath = '/';
  const secondPath = '/second';
  const InitialPage = () => <p>My page!</p>;
  const SecondPage = () => <p>Second page!</p>;
  const fallback = <p className="fallback">Loading...</p>;
  const notFound = <p className="not-found">Not found :(</p>;

  const routes = new Map<string, React.ComponentType>([
    [initialPath, InitialPage],
    [secondPath, SecondPage],
  ]);

  const routerProps = {
    routes,
    initialPath,
    fallback,
    notFound,
  };

  it('should provide the initial page based by the initial path', () => {
    const rendered = mount( // useEffect re-renders aren't supported by shallow()
      <SuspensefulRouter {...routerProps}>
        {Page => <Page />}
      </SuspensefulRouter>
    );

    expect(rendered.exists(InitialPage)).toBe(true);
    expect(rendered.exists(SecondPage)).toBe(false);
    expect(rendered.exists('.fallback')).toBe(false);
    expect(rendered.exists('.not-found')).toBe(false);
  });

  it('should transition to another page when push is called', () => {
    const rendered = mount(
      <SuspensefulRouter {...routerProps}>
        {Page => (
          <>
            <Link href={secondPath} />
            <Page />
          </>
        )}
      </SuspensefulRouter>
    );

    const link = rendered.find(Link);

    link.simulate('click');

    expect(rendered.exists(SecondPage)).toBe(true);
    expect(rendered.exists(InitialPage)).toBe(false);
    expect(rendered.exists('.fallback')).toBe(false);
    expect(rendered.exists('.not-found')).toBe(false);
  });

  it('should render the not found node when a route does not exist', () => {
    const rendered = mount(
      <SuspensefulRouter {...routerProps}>
        {Page => (
          <>
            <Link href="/missing" />
            <Page />
          </>
        )}
      </SuspensefulRouter>
    );

    const link = rendered.find(Link);

    link.simulate('click');

    expect(rendered.exists('.not-found')).toBe(true);
    expect(rendered.exists(InitialPage)).toBe(false);
    expect(rendered.exists(SecondPage)).toBe(false);
    expect(rendered.exists('.fallback')).toBe(false);
  });

  it.todo('should render the fallback node when a Suspenseful page component is loading or deferred');
  it.todo('should transition back through the history stack when popstate is fired');
  it.todo('should unsubscribe from popstate when the router unmounts');
});
