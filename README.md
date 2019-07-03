# React Lazy Router

An example router for lazily loading React components with [`React.lazy`](https://reactjs.org/docs/code-splitting.html#reactlazy) and [Suspense](https://reactjs.org/docs/code-splitting.html#suspense).

![Screencap of the app](https://raw.githubusercontent.com/jamesseanwright/react-lazy-router/master/misc/screencap.gif)

[Spinner courtesy of Thunkable](https://community.thunkable.com/t/loading-spinner-example/399)

```tsx
import * as React from 'react';
import Nav from './Nav.jsx';
import { SuspensefulRouter } from './routing';

const routes = new Map<string, React.ComponentType>([
  ['/', () => <p>Pick an Ipsum!</p>],
  ['/lorem', React.lazy(() => import('./pages/Lorem'))],
  ['/bacon', React.lazy(() => import('./pages/Bacon'))],
  ['/hipster', React.lazy(() => import('./pages/Hipster'))],
  ['/office', React.lazy(() => import('./pages/Office'))],
]);

const paths = [...routes.keys(), '/missing'].slice(1);

const App = () => (
  <SuspensefulRouter
    routes={routes}
    initialPath="/"
    fallback={<div className="loading-spinner" />}
    notFound={<p>Route not found</p>}
    header={<Nav paths={paths} />}
  >
    {Page => <Page />}
  </SuspensefulRouter>
);
```

## The App

TODO

## Running Locally

To set up:

1. `git clone https://github.com/jamesseanwright/react-lazy-router.git`
2. `cd react-lazy-router`
3. `npm i`
4. `nvm use`

Then you can run one of the following commands:

* `npm run dev` - builds the project with [rollup.js](https://rollupjs.org/guide/en) and serves it from port 8080
* `npm test` - runs the unit tests (append ` -- --watch` to launch Jest's watch mode)
