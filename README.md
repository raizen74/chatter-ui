## Front

- React UI with Material UI
- Apollo Client
- Feat: when user **login** automatically is redirected to Home -> In `useLogin` hook we call `client.refetchQueries` after a successful user login, which changes the `data` variable in Auth.tsx (`useGetMe` hook reexecutes the graphql query) and triggers the `useEffect` hook that redirects to the Home component
- Feat: when user **signup** automatically is redirected to Home: `Signup.tsx` component calls `await login({ email, password })` after a successful signup

## Back

GraphQL users.resolver forwards the query to the UsersService which calls UsersRepository that extends AbstractEntityRepository that performs CRUD on MongoDB with mongoose ORM

Strategies are a concept of the passport library.
Guards are called before the route is called. Guards need to be changed a bit to work with GraphQL, check gql-auth.guard.ts

auth.controller.ts operates the route /auth/login and uses the LocalAuthGuard which implements the local strategy, receives email and password, validates user and injects JWT as cookie

the GqlAuthGuard implements the jwt strategy, which extracts the JWT from the request and validates it or throws Unauthorized 401 exception, GqlAuthGuard is applied to several routes in graphql resolver
