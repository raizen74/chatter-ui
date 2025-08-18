export const extractErrorMessage = (err: any): string | undefined => {
  const errorMessage = err.graphQLErrors[0]?.extensions?.originalError?.message;
  // return "Hello";
  console.log("Error message:", errorMessage);
  if (!errorMessage) {
    return;
  }
  if (Array.isArray(errorMessage)) {
    return formatErrorMessage(errorMessage[0]);
  } else {
    return formatErrorMessage(errorMessage);
  }
};

const formatErrorMessage = (errorMessage: string) => {
  return errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);
};
