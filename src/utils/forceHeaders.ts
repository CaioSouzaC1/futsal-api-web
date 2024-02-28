export const forceHeaders = (token: string | undefined) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};
