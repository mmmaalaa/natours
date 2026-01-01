export const checkExists = async ({ Model, id, name }) => {
  const doc = await Model.findById(id);
  if (!doc) throw new Error(`${name} not found`);
  return doc;
};
