import getNavigation from '../getNavigation';

test('getNavigation provides default action helpers', () => {
  const router = {
    getActionCreators: () => ({}),
    getStateForAction(action, lastState = {}) {
      return lastState;
    },
  };

  const dispatch = jest.fn();

  const topNav = getNavigation(
    router,
    {},
    dispatch,
    new Set(),
    () => ({}),
    () => topNav,
    () => {}
  );

  topNav.navigate('GreatRoute');

  expect(dispatch.mock.calls.length).toBe(1);
  expect(dispatch.mock.calls[0][0].type).toBe('Navigation/NAVIGATE');
  expect(dispatch.mock.calls[0][0].routeName).toBe('GreatRoute');
});

test('getNavigation provides router action helpers', () => {
  const router = {
    getActionCreators: () => ({
      foo: bar => ({ type: 'FooBarAction', bar }),
    }),
    getStateForAction(action, lastState = {}) {
      return lastState;
    },
  };

  const dispatch = jest.fn();

  const topNav = getNavigation(
    router,
    {},
    dispatch,
    new Set(),
    () => ({}),
    () => topNav,
    () => {}
  );

  topNav.foo('Great');

  expect(dispatch.mock.calls.length).toBe(1);
  expect(dispatch.mock.calls[0][0].type).toBe('FooBarAction');
  expect(dispatch.mock.calls[0][0].bar).toBe('Great');
});

test('getNavigation get child navigation with router', () => {
  const actionSubscribers = new Set();
  let navigation = null;

  const routerA = {
    getActionCreators: () => ({}),
    getStateForAction(action, lastState = {}) {
      return lastState;
    },
  };
  const router = {
    childRouters: {
      RouteA: routerA,
    },
    getActionCreators: () => ({}),
    getStateForAction(action, lastState = {}) {
      return lastState;
    },
  };

  const initState = {
    index: 0,
    routes: [
      {
        key: 'a',
        routeName: 'RouteA',
        routes: [{ key: 'c', routeName: 'RouteC' }],
        index: 0,
      },
      { key: 'b', routeName: 'RouteB' },
    ],
  };

  const topNav = getNavigation(
    router,
    initState,
    () => {},
    actionSubscribers,
    () => ({}),
    () => navigation,
    () => {}
  );

  const childNavA = topNav.getChildNavigation('a');

  expect(childNavA.router).toBe(routerA);
});

test('getNavigation navigateToUrl non-string', () => {
  const router = {
    getActionCreators: () => ({}),
    getStateForAction(action, lastState = {}) {
      return lastState;
    },
  };

  const handleOpenUrl = jest.fn();

  const topNav = getNavigation(
    router,
    {},
    () => {},
    new Set(),
    () => ({}),
    () => topNav,
    handleOpenUrl
  );

  try {
    topNav.navigateToURL(1);
    fail('Expected an invariant violation to be thrown');
  } catch (e) {}

  expect(handleOpenUrl.mock.calls.length).toBe(0);
});

test('getNavigation navigateToUrl calls dependency', () => {
  const router = {
    getActionCreators: () => ({}),
    getStateForAction(action, lastState = {}) {
      return lastState;
    },
  };

  const handleOpenUrl = jest.fn();

  const topNav = getNavigation(
    router,
    {},
    () => {},
    new Set(),
    () => ({}),
    () => topNav,
    handleOpenUrl
  );

  const url = 'foo';

  topNav.navigateToURL(url);

  expect(handleOpenUrl.mock.calls.length).toBe(1);
  expect(handleOpenUrl.mock.calls[0][0]).toBe(url);
});
