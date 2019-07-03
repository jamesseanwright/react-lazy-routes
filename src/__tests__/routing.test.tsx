import * as React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Link, SuspensefulRouter } from '../routing';

describe('Router integration tests (mainly <SuspensefulRouter /> and <Link />)', () => {
  const initialPath = '/';
  const secondPath = '/second';
  const InitialPage = () => <p>My page!</p>;
  const SecondPage = () => <p>Second page!</p>;

  const SuspensefulPage = React.lazy(() =>
    Promise.resolve({
      default: () => <div className="suspenseful" />,
    }),
  );

  const fallback = <p className="fallback">Loading...</p>;
  const notFound = <p className="not-found">Not found :(</p>;

  const routes = new Map<string, React.ComponentType>([
    [initialPath, InitialPage],
    [secondPath, SecondPage],
    ['/suspense', SuspensefulPage],
  ]);

  const routerProps = {
    routes,
    initialPath,
    fallback,
    notFound,
  };

  it('should provide the initial page based by the initial path', () => {
    const rendered = mount(
      // useEffect re-renders aren't supported by shallow()
      <SuspensefulRouter {...routerProps}>
        {Page => <Page />}
      </SuspensefulRouter>,
    );

    expect(rendered.exists(InitialPage)).toBe(true);
    expect(rendered.exists(SecondPage)).toBe(false);
    expect(rendered.exists('.fallback')).toBe(false);
    expect(rendered.exists('.not-found')).toBe(false);
  });

  it('should transition to another page when push is called', () => {
    const rendered = mount(
      <SuspensefulRouter
        {...routerProps}
        header={<Link href={secondPath} />}
      >
        {Page => <Page />}
      </SuspensefulRouter>,
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
      <SuspensefulRouter
        {...routerProps}
        header={<Link href="/missing" />}
      >
        {Page => <Page />}
      </SuspensefulRouter>,
    );

    const link = rendered.find(Link);

    link.simulate('click');

    expect(rendered.exists('.not-found')).toBe(true);
    expect(rendered.exists(InitialPage)).toBe(false);
    expect(rendered.exists(SecondPage)).toBe(false);
    expect(rendered.exists('.fallback')).toBe(false);
  });

  it('should render the fallback node when a Suspenseful page component is loading or deferred', async () => {
    const rendered = mount(
      <SuspensefulRouter{...routerProps} initialPath="/suspense">
        {Page => <Page />}
      </SuspensefulRouter>,
    );

    expect(rendered.exists('.fallback')).toBe(true);
    expect(rendered.exists('.suspenseful')).toBe(false);

    /* Add a new Promise to the microtask queue
     * and await for it to resolve after the
     * Promise passed to React.lazy has resolved.
     * Force a ReactWrapper update once flushed. */
    await Promise.resolve();
    rendered.update();

    expect(rendered.exists('.fallback')).toBe(false);
    expect(rendered.exists('.suspenseful')).toBe(true);
  });

  it('should transition back through the history stack when popstate is fired', () => {
    const rendered = mount(
      <SuspensefulRouter
        {...routerProps}
        header={(
          <>
            <Link href={initialPath} />
            <Link href={secondPath} />
          </>
        )}
      >
        {Page => <Page />}
      </SuspensefulRouter>,
    );

    const secondLink = rendered.find(Link).at(1);

    secondLink.simulate('click');

    expect(rendered.exists(InitialPage)).toBe(false);
    expect(rendered.exists(SecondPage)).toBe(true);

    /* Required to execute all hooks
     * before asserting updates. */
    act(() => {
      window.dispatchEvent(
        new PopStateEvent('popstate', {
          state: {
            path: initialPath,
          },
        }),
      );
    });

    rendered.update();

    expect(rendered.exists(InitialPage)).toBe(true);
    expect(rendered.exists(SecondPage)).toBe(false);
  });

  it('should unsubscribe from popstate when the router unmounts', () => {
    const removeEventSpy = jest.spyOn(window, 'removeEventListener');

    const rendered = mount(
      <SuspensefulRouter {...routerProps}>
        {Page => <Page />}
      </SuspensefulRouter>,
    );

    rendered.unmount();

    expect(removeEventSpy).toHaveBeenCalledWith(
      'popstate',
      expect.any(Function),
    );
  });
});
