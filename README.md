# Real-time chat web application

- React UI + Material UI and Apollo Client (cache)
- NestJS + Apollo GraphQL server
- MongoDB

## Front

- Feat: when user **login** automatically is redirected to Home -> In `useLogin` hook we call `client.refetchQueries` after a successful user login, which changes the `data` variable in Auth.tsx (`useGetMe` hook reexecutes the graphql query) and triggers the `useEffect` hook that redirects to the Home component
- Feat: when user **signup** automatically is redirected to Home: `Signup.tsx` component calls `await login({ email, password })` after a successful signup
- Use `makeVar` from Apollo Client to mantain authentication state and conditionally render the Header components
- `Chat.tsx`:
  1. When you call the `useCreateMessage` hook (inside `handleCreateMessage`), you execute a mutation (`CreateMessage`) to create a new message. In your `useCreateMessage` hook, you have an update function that **manually updates the Apollo client cache**: it reads the current messages from the cache, adds the new message, and writes the updated array back to the cache.
  2. The `useMessageCreated` hook performs GraphQL websocket subscription and **manually updates the Apollo client cache** every time a new message is received.
  3. The `useGetMessages` hook in your Chat component is **subscribed to the messages data in the Apollo cache**. It retrieves the current `messages` in the cache automatically when the cache is updated.
  4. React re-renders the Chat component with the new messages array, so the new message appears in the UI immediately—without a page refresh or manual fetch.

- Update the Apollo Client cache for every `latestMessage` send to the chat and received from the websocket connection to automatically display it in the `ChatListItem` as well as the `user.name` of the sender

## Back

GraphQL `users.resolver.ts` forwards the query to the `UsersService` which calls `UsersRepository` that extends `AbstractEntityRepository` that performs CRUD on MongoDB with mongoose ORM

Strategies are a concept of the `passport` library.
Guards are called before the route is called. Guards need to be changed a bit to work with GraphQL, check `gql-auth.guard.ts`

`auth.controller.ts` operates the route **/auth/login** and uses the `LocalAuthGuard` which implements the **local strategy**, receives email and password, validates user in MongoDB and **injects JWT as cookie**

`GqlAuthGuard` implements the **jwt strategy**, which extracts the JWT from the request and validates it or throws Unauthorized 401 exception, `GqlAuthGuard` is applied to all routes except `CreateUser` in graphql resolver

GraphQL subscriptions mantain a persistent websocket connection to keep pushing updates to the UI client, when a user enters a chat it stablishes a websocket connection using the `chatId`

Pushed messages are filtered by `chatId` and not sent to the sender (`userId`)

ReModel the `ChatDocument` MongoDB schema as an aggregation of `MessageDocument` and execute **MongoDB aggregations** in the chats and messages service layers to operate these schemas
