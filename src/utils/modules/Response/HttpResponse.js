
/**
 * Base Response
 * @param dataResponse
 * @returns
 */
const baseResponse = (code = 200, message = 'success', data = {}) => {
  return {
    code,
    message,
    data
  }
}
/**
 * Response Get or Sucess
 * @param dataResponse
 * @returns
 */
const get = (dataResponse) => {
  return baseResponse(200, 'Data retrieved successfully!', dataResponse);
}

/**
 * Response Created
 * @param dataResponse
 * @returns
 */
const created = (dataResponse) => {
  return baseResponse(201, 'Data has been added successfully!', dataResponse);
}

/**
 * Response Updated
 * @param dataResponse
 * @returns
 */
const updated = (dataResponse) => {
  return baseResponse(200, 'Data has been updated successfully!', dataResponse);
}


/**
 * Response Deleted
 * @param dataResponse
 * @returns
 */
const deleted = (dataResponse) => {
  return baseResponse(200, 'Data has been deleted successfully!', dataResponse);
}

/**
 * Response Deleted
 * @param dataResponse
 * @returns
 */
 const notified = () => {
  return baseResponse(204, 'Request processed successfully!', {});
}

module.exports = { baseResponse, get, updated, created, deleted, notified };
