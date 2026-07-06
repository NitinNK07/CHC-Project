export function extractErrorMessage(err) {
  const data = err?.response?.data;
  if (!data) return err?.message || "Something went wrong. Please try again.";
  if (data.fieldErrors) {
    const firstField = Object.values(data.fieldErrors)[0];
    if (firstField) return firstField;
  }
  return data.message || "Something went wrong. Please try again.";
}
