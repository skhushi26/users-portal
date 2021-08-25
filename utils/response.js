// common function for sending response
function responseBuilder(
  error = null,
  data = null,
  message = null,
  statusCode = 200
) {
  return {
    error,
    data,
    message,
    statusCode,
  };
}

module.exports = responseBuilder;
