# Real-time chat web application

- React UI + Material UI and Apollo Client (cache)
- NestJS + Apollo GraphQL server
- MongoDB

## Front

- Feat: when user **login** automatically is redirected to Home -> In `useLogin` hook we call `client.refetchQueries` after a successful user login, which changes the `data` variable in Auth.tsx (`useGetMe` hook reexecutes the graphql query) and triggers the `useEffect` hook that redirects to the Home component
- Feat: when user **signup** automatically is redirected to Home: `Signup.tsx` component calls `await login({ email, password })` after a successful signup
- Use `makeVar` from Apollo Client to mantain authentication state and conditionally render the Header components
- Updating the **Apollo client cache** causes all components using that cached data (like the `<Box>` with messages in `Chat.tsx`) to re-render with the latest data, making new message appear instantly. No page refresh is needed.

## Back

GraphQL `users.resolver.ts` forwards the query to the `UsersService` which calls `UsersRepository` that extends `AbstractEntityRepository` that performs CRUD on MongoDB with mongoose ORM

Strategies are a concept of the `passport` library.
Guards are called before the route is called. Guards need to be changed a bit to work with GraphQL, check `gql-auth.guard.ts`

`auth.controller.ts` operates the route **/auth/login** and uses the `LocalAuthGuard` which implements the **local strategy**, receives email and password, validates user in MongoDB and **injects JWT as cookie**

`GqlAuthGuard` implements the **jwt strategy**, which extracts the JWT from the request and validates it or throws Unauthorized 401 exception, `GqlAuthGuard` is applied to all routes except `CreateUser` in graphql resolver

GraphQL subscriptions mantain a persistent websocket connection to keep pushing updates to the UI client
