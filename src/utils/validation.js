export const isPasswordValid = (password) => {
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasPunct = /[^\w\s]/.test(password);
  return hasUpper && hasLower && hasPunct;
};
