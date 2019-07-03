# React Lazy Routes

An example React router implementation and demo of lazily loading components with [`React.lazy`](https://reactjs.org/docs/code-splitting.html#reactlazy) and [Suspense](https://reactjs.org/docs/code-splitting.html#suspense).

![Screencap of the app](https://raw.githubusercontent.com/jamesseanwright/react-lazy-routes/master/misc/screencap.gif)

[Spinner courtesy of Thunkable](https://community.thunkable.com/t/loading-spinner-example/399)

```tsx
import * as React from 'react';
import Nav from './Nav.jsx';
import { Router } from './routing';

const routes = new Map<string, React.ComponentType>([
  ['/', () => <p>Pick an Ipsum!</p>],
  ['/lorem', React.lazy(() => import('./pages/Lorem'))],
  ['/bacon', React.lazy(() => import('./pages/Bacon'))],
  ['/hipster', React.lazy(() => import('./pages/Hipster'))],
  ['/office', React.lazy(() => import('./pages/Office'))],
]);

const paths = [...routes.keys(), '/missing'].slice(1);

const App = () => (
  <Router routes={routes} initialPath="/" notFound={<p>Route not found</p>}>
    {Page => (
      <>
        <Nav paths={paths} />
        <React.Suspense fallback={<div className="loading-spinner" />}>
          <Page />
        </React.Suspense>
      </>
    )}
  </Router>
);
```

## The App

TODO

## Running Locally

To set up:

1. `git clone https://github.com/jamesseanwright/react-lazy-routes.git`
2. `cd react-lazy-routes`
3. `npm i`
4. `nvm use`

Then you can run one of the following commands:

* `npm run dev` - builds the project with [rollup.js](https://rollupjs.org/guide/en) and serves it from port 8080
* `npm test` - runs the unit tests (append ` -- --watch` to launch Jest's watch mode)
