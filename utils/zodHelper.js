export const requiredFields = (issue, fieldName) => {
  return issue.input === undefined
    ? `${fieldName} is required`
    : `Invalid ${fieldName}`;
};
