import qs from 'qs';
class apiFeatures {
  constructor(query, reqQuery) {
    this.query = query;
    this.reqQuery = reqQuery;
  }

  filter() {
    const excludedFileds = ['page', 'sort', 'limit', 'fields'];
    const queryObj = { ...qs.parse(this.reqQuery) };
    excludedFileds.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const formattedQuery = JSON.parse(queryStr);
    this.query = this.query.find(formattedQuery);
    return this;
  }

  sort() {
    if (this.reqQuery.sort) {
      const sortBy = this.reqQuery.sort.split(',').join(' ');
      this.query.sort(sortBy);
    } else {
      this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.reqQuery.fields) {
      const fields = this.reqQuery.fields.split(',').join(' ');
      this.query.select(fields);
    }
    return this;
  }

  async pagination() {
    const page = this.reqQuery.page * 1 || 1;
    const limit = this.reqQuery.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query.skip(skip).limit(limit);
    // const numDocs = await Tour.countDocuments();
    // if (skip >= numDocs) throw new Error('This page does not exist');
    return this;
  }
}

export default apiFeatures;
