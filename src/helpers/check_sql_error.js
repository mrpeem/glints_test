// check if sql statement returns an error
// if it does, return HTTP 500 status
const checkSqlError = (err, res) => {
  if(err) {
    res.status(500).json(err);
    throw err;
  }
}

module.exports = {checkSqlError};