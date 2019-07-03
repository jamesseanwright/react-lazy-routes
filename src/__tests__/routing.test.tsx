import * as React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Link, Router } from '../routing';

describe('Router integration tests (mainly <Router /> and <Link />)', () => {
  const initialPath = '/';
  const secondPath = '/second';
  const InitialPage = () => <p>My page!</p>;
  const SecondPage = () => <p>Second page!</p>;
  const notFound = <p className="not-found">Not found :(</p>;

  const routes = new Map<string, React.ComponentType>([
    [initialPath, InitialPage],
    [secondPath, SecondPage],
  ]);

  const routerProps = {
    routes,
    initialPath,
    notFound,
  };

  it('should provide the initial page based by the initial path', () => {
    const rendered = mount(
      // useEffect re-renders aren't supported by shallow()
      <Router {...routerProps}>{Page => <Page />}</Router>,
    );

    expect(rendered.exists(InitialPage)).toBe(true);
    expect(rendered.exists(SecondPage)).toBe(false);
    expect(rendered.exists('.not-found')).toBe(false);
  });

  it('should transition to another page when push is called', () => {
    const rendered = mount(
      <Router {...routerProps}>
        {Page => (
          <>
            <Link href={secondPath} />
            <Page />
          </>
        )}
      </Router>,
    );

    const link = rendered.find(Link);

    link.simulate('click');

    expect(rendered.exists(SecondPage)).toBe(true);
    expect(rendered.exists(InitialPage)).toBe(false);
    expect(rendered.exists('.not-found')).toBe(false);
  });

  it('should render the not found node when a route does not exist', () => {
    const rendered = mount(
      <Router {...routerProps}>
        {Page => (
          <>
            <Link href="/missing" />
            <Page />
          </>
        )}
      </Router>,
    );

    const link = rendered.find(Link);

    link.simulate('click');

    expect(rendered.exists('.not-found')).toBe(true);
    expect(rendered.exists(InitialPage)).toBe(false);
    expect(rendered.exists(SecondPage)).toBe(false);
  });

  it('should transition back through the history stack when popstate is fired', () => {
    const rendered = mount(
      <Router {...routerProps}>
        {Page => (
          <>
            <Link href={initialPath} />
            <Link href={secondPath} />
            <Page />
          </>
        )}
      </Router>,
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
      <Router {...routerProps}>{Page => <Page />}</Router>,
    );

    rendered.unmount();

    expect(removeEventSpy).toHaveBeenCalledWith(
      'popstate',
      expect.any(Function),
    );
  });
});
