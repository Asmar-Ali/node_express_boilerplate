/* eslint-disable new-cap */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-await */
const _ = require('lodash');

class Crud {
  /*
filter: where condition
projection: what is to be returned
sort:
		{ _id:-1} sort condition for latest entry // descending order
		{ adminmission : 1 } //ascending order
limit: number of enteries
skip: skip first n entries and get the other y number of entries
*/
  /**
   * @description Get one record based on given condition
   * @param  {object} model - schema information
   * @param  {object} cond - query filter
   * @param  {object} proj ={} - projection to be used in query
   * @param  {object} sort ={} - sort to be used in query
   * @param  {number} limit - number of records to limit in query
   * @param  {number} skip - number of records to skip
   * @return {object} - required array
   */
  static async getList(model, filter, projection = {}, sort = {}, limit = 0, skip = 0) {
    return await model.find(filter, projection).sort(sort).limit(limit).skip(skip).lean().exec();
  }

  /**
   * @description Get one record based on given condition
   * @param  {object} model - schema information
   * @param  {object} cond - query filter
   * @param  {object} proj={} - projection to be used in query
   * @return {object} - required document
   */
  static async getOne(model, cond, proj = {}, sort = {}) {
    return await model.findOne(cond, proj).sort(sort).lean();
  }

  /**
   * @description Delete record based on given condition
   * @param  {object} model - schema information
   * @param  {object} cond - query filter
   * @return {object} - required document
   */
  static async remove(model, cond) {
    return await model.deleteOne(cond);
  }

  /**
   * @description Delete all record based on given condition
   * @param  {object} model - schema information
   * @param  {object} cond - query filter
   * @return {object} - required document
   */
  static async removeAll(model, cond) {
    return await model.deleteMany(cond);
  }

  /** Update a record and return
   * @description Update a record in specified collection based on given condition
   * @param  {object} model - schema reference
   * @param  {object} cond - information of record to be updated
   * @param  {object} data - data to be updated
   * @returns {object} - returns the document with updated fields
   */
  static async updateOneAndReturn(model, cond, data, proj = {}, sort = {}) {
    const options = { new: true, projection: proj };
    if (!_.isEmpty(sort)) options.sort = sort;
    // console.log("options ", options)
    return await model.findOneAndUpdate(cond, { $set: data }, options).exec();
  }

  /** Update a record with dynamic object and return
   * @description Update a record in specified collection based on given condition
   * @param  {object} model - schema reference
   * @param  {object} cond - information of record to be updated
   * @param  {object} data - data to be updated
   * @returns {object} - returns the document with updated fields
   */
  static async updateOneAndReturnDynamic(model, cond, data, proj = {}, options = { new: true }) {
    options = { ...options, projection: proj };
    return await model.findOneAndUpdate(cond, data, options).exec();
  }

  /** Find and Update a record
   * @description Update a record in specified collection based on given condition
   * @param  {object} model - schema reference
   * @param  {object} cond - information of record to be updated
   * @param  {object} data - data to be updated
   * @returns {object} - returns the document with updated fields
   */
  static async updateOneNoReturn(model, cond, data) {
    return await model.findOneAndUpdate(cond, { $set: data }).exec();
  }

  /** Update a record
   * @description Update a record in specified collection based on given condition
   * @param  {object} model - schema reference
   * @param  {object} cond - information of record to be updated
   * @param  {object} data - data to be updated
   * @returns {object} - returns the document with updated fields
   */
  static async updateOne(model, cond, data) {
    return await model.updateOne(cond, { $set: data }).exec();
  }

  /** Update Multi record based on condition
   * @description Update records in specified collection based on given condition
   * @param  {object} model - schema reference
   * @param  {object} cond - information of records to be updated
   * @param  {object} data - data to be updated
   * @returns {object} - returns the document with updated fields
   */
  static async updateMultiWithDynamic(model, cond, data) {
    return await model.updateMany(cond, data).exec();
  }

  /** Update Multi record based on condition
   * @description Update records in specified collection based on given condition
   * @param  {object} model - schema reference
   * @param  {object} cond - information of records to be updated
   * @param  {object} data - data to be updated
   * @returns {object} - returns the document with updated fields
   */
  static async updateMulti(model, cond, data) {
    return await model.updateMany(cond, { $set: data }).exec();
  }

  /** Update Multi record based on condition for push
   * @description Update records in specified collection based on given condition
   * @param  {object} model - schema reference
   * @param  {object} cond - information of records to be updated
   * @param  {object} data - data to be updated
   * @returns {object} - returns the document with updated fields
   */
  static async updateMultiPush(model, cond, data) {
    return await model.updateMany(cond, data).exec();
  }

  /** Update a record by inc
   * @description Update a record in specified collection based on given condition
   * @param  {object} model - schema reference
   * @param  {object} cond - information of record to be updated
   * @param  {object} data - data to be updated
   * @returns {object} - returns the document with updated fields
   */
  static async updateOneInc(model, cond, data) {
    return await model.updateOne(cond, { $inc: data }).exec();
  }

  /** Update a record by object
   * @description Update a record in specified collection based on given condition
   * @param  {object} model - schema reference
   * @param  {object} cond - information of record to be updated
   * @param  {object} data - data to be updated
   * @returns {object} - returns the document with updated fields
   */
  static async updateOneWithDynamic(model, cond, data) {
    return await model.updateOne(cond, data).exec();
  }

  /** find and update
   * @description Update a record in specified collection based on given condition
   * @param  {object} model - schema reference
   * @param  {object} cond - information of record to be updated
   * @param  {object} data - data to be updated
   * @returns {object} - returns the document with updated fields
   */
  static async findOneAndUpdate(model, cond, data) {
    return await model.findOneAndUpdate(cond, data, { upsert: true, new: true }).lean().exec();
  }

  /** find by id and update
   * @description Update a record in specified collection based on given condition
   * @param  {object} model - schema reference
   * @param  {object} cond - information of record to be updated
   * @param  {object} data - data to be updated
   * @returns {object} - returns the document with updated fields
   */
  static async findByIdAndUpdate(model, cond, data) {
    return await model.findByIdAndUpdate(cond, { $set: data }).lean().exec();
  }

  /** Add data
   * @description Add data to given collection
   * @param  {object} model - schema reference
   * @param  {object} data - data to be added
   * @returns {object} Query result
   */
  static async add(model, data) {
    const obj = new model(data);
    return obj.save();
  }

  /** Add Many
   * @description Add many to given collection
   * @param  {object} model - schema reference
   * @param  {object} data - data to be added
   * @returns {object} Query result
   */
  static async addMany(model, data) {
    return await model.insertMany(data);
  }

  /**
   * @description Get count based on given condition
   * @param  {object} model - schema information
   * @param  {object} cond - query filter
   * @return {object} - required document
   */
  static async getCount(model, cond) {
    return await model.countDocuments(cond);
  }

  /**
   * @description Get all record based on given condition
   * @param  {object} model - schema information
   * @param  {object} cond - query filter
   * @param  {object} proj ={} - projection to be used in query
   * @param  {object} populateArray =[] - Array of data to be populated
   * @param  {object} sort ={} - sort to be used in query
   * @return {object} - required document
   */
  static async getWithPopulate(model, cond, projection = {}, populateArray = {}, sort = {}, limit = 0, skip = 0) {
    return await model.find(cond, projection).populate(populateArray).sort(sort).limit(limit).skip(skip).lean().exec();
  }

  /**
   * @description Get one with populate based on given condition
   * @param  {object} model - schema information
   * @param  {object} cond - query filter
   * @param  {object} proj={} - projection to be used in query
   * @param  {object} populateArray =[] - Array of data to be populated
   * @return {object} - required document
   */
  static async getOneWithPopulate(model, cond, proj = {}, populateArray = {}, sort = {}) {
    return await model.findOne(cond, proj).populate(populateArray).sort(sort).lean();
  }

  //  /**
  //  * @description Get one record with populate based on given condition
  //  * @param  {object} model - schema information
  //  * @param  {object} cond - query filter
  //  * @param  {object} proj={} - projection to be used in query
  //  * @return {object} - required document
  //  */
  // static async getOneWithPopulate(model, cond, proj = {}, populate = [], sort = {}) {
  //     return await model.findOne(cond, proj)
  //     .populate(populate)
  //     .sort(sort)
  //     .lean();
  // }

  static async aggregate(model, stages = []) {
    return await model.aggregate(stages);
  }

  static aggregatePagination(stages = [], offSet = 0, itemsPerPage = 20) {
    stages.push(
      {
        $facet: {
          data: [{ $skip: offSet }, { $limit: itemsPerPage }],
          total: [{ $group: { _id: null, total: { $sum: 1 } } }],
        },
      },
      {
        $addFields: {
          total: {
            $cond: {
              if: { $size: '$total' },
              then: { $first: '$total.total' },
              else: 0,
            },
          },
        },
      }
    );
  }

  /** Update a record with dynamic object with sort order and return
   * @description Update a record in specified collection based on given condition
   * @param  {object} model - schema reference
   * @param  {object} cond - information of record to be updated
   * @param  {object} data - data to be updated
   * @returns {object} - returns the document with updated fields
   */
  static async updateOneWithSortOrder(model, cond, data, sort = { _id: -1 }) {
    const options = { sort };
    return await model.findOneAndUpdate(cond, data, options).exec();
  }
}

module.exports = Crud;
