describe('auth slice', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.resetModules();
  });

  it('hydrates from login and persists the token', () => {
    const authModule = require('./authSlice');
    const reducer = authModule.default;
    const { loginUser } = authModule;

    const action = loginUser.fulfilled(
      {
        user: {
          name: 'Ada Lovelace',
          email: 'ada@example.com',
        },
        token: 'token-123',
      },
      'request-1',
    );

    const state = reducer(undefined, action);

    expect(state.user).toEqual({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
    });
    expect(state.token).toBe('token-123');
    expect(state.isAuthenticated).toBe(true);
    expect(localStorage.getItem('book-byte-auth-token')).toBe('token-123');
  });

  it('restores the token from storage on module initialization', () => {
    localStorage.setItem('book-byte-auth-token', 'persisted-token');
    const authModule = require('./authSlice');

    expect(authModule.selectAuthToken({ auth: authModule.default(undefined, { type: '@@INIT' }) })).toBe(
      'persisted-token',
    );
  });

  it('clears auth state when current-user refresh fails', () => {
    localStorage.setItem('book-byte-auth-token', 'stale-token');
    const authModule = require('./authSlice');
    const reducer = authModule.default;
    const { refreshCurrentUser } = authModule;

    const previousState = {
      user: {
        name: 'Ada Lovelace',
        email: 'ada@example.com',
      },
      token: 'stale-token',
      isAuthenticated: true,
      isRefreshing: true,
      isLoading: false,
      error: null,
    };

    const action = refreshCurrentUser.rejected(
      new Error('Unauthorized'),
      'request-2',
      undefined,
      'Unauthorized',
    );

    const state = reducer(previousState, action);

    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(localStorage.getItem('book-byte-auth-token')).toBeNull();
  });
});
