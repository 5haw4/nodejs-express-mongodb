class APIFeatures {
    constructor(query, queryObj) {
        this.query = query;
        this.queryObj = queryObj;
    }

    filter(allowedFilterFields) {
        let queryObj = {};
        Object.keys(this.queryObj).forEach(key => {
            if(allowedFilterFields.includes(key)) {
                queryObj[key] = this.queryObj[key]
            }
        })

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        this.query.find(JSON.parse(queryStr))
        return this;
    }

    sort() {
        let sortBy = "-createdAt";
        if(this.queryObj.sort) {
            sortBy = this.queryObj.sort.split(",").join(" ");
        }
        this.query = this.query.sort(sortBy)
        return this;
    }

    limitFields(allowedSelectionFields) {
        let fields = "-__v";
        if(this.queryObj.fields) {
            fields = this.queryObj.fields
                .split(",")
                .filter(key => allowedSelectionFields.includes(key))
                .join(" ")
        }
        this.query = this.query.select(fields)
        return this;
    }

    paginate(maxLimit = 1000) {
        const page = (this.queryObj.page || this.queryObj.offset) * 1 || 1;
        let limit = this.queryObj.limit * 1 || 100;
        limit = limit > maxLimit ? maxLimit : limit;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }

}

module.exports = APIFeatures;