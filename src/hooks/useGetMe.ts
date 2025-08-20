import { useQuery } from "@apollo/client";
import { graphql } from "../gql";

const getMeDocument = graphql(`
  query Me {
    me {
      _id
      email
    }
  }
`);
// const GET_ME = gql`
//   query Me {
//     me {
//       _id
//       email
//     }
//   }
// `;

const useGetMe = () => {
  return useQuery(getMeDocument, {
    errorPolicy: "all", // allows us to handle errors gracefully
  });
};
// const useGetMe = () => {
//   return useQuery<{me: User}>(GET_ME, {
//     errorPolicy: "all", // allows us to handle errors gracefully
//   });
// };

export { useGetMe };
