class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const filters = { ...this.queryString };
    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    excludedFields.forEach((paramName) => delete filters[paramName]);
    let queryString = JSON.stringify(filters);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); //exclude the field __v
    }
    return this;
  }

  paginate() {
    const DEFAULT_PAGE = 1;
    const DEFAULT_LIMIT = 10;
    const page = parseInt(this.queryString.page, 10) || DEFAULT_PAGE;
    const perPage = parseInt(this.queryString.limit, 10) || DEFAULT_LIMIT;
    const skip = (page - 1) * perPage;
    this.query = this.query.skip(skip).limit(perPage);
    return this;
  }
}

module.exports = APIFeatures;
