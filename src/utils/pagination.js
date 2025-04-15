export const paginate = async (model, page, limit, populate = null) => {
  const pageNum = parseInt(page, 10) || 1;
  const pageSize = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * pageSize;

  const total = await model.countDocuments();
  const totalPages = Math.ceil(total / pageSize);

  let query = model.find().skip(skip).limit(pageSize);
  if (populate) {
    query = query.populate(populate);
  }

  const results = await query;

  return {
    results,
    total,
    totalPages,
    currentPage: pageNum,
    pageSize,
  };
};
