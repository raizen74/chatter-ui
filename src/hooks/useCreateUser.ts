import { useMutation } from "@apollo/client";
// import { User } from "../models/User";
import { graphql } from "../gql";

// interface CreateUserInput {
//   createUserInput: {
//     email: string;
//     password: string;
//   };
// }
const createUserDocument = graphql(`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      _id
      email
    }
  }
`);

// const useCreateUser = () => {
//   return useMutation<User, CreateUserInput>(CREATE_USER);
// };
const useCreateUser = () => {
  return useMutation(createUserDocument);
};

export { useCreateUser };
