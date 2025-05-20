const handleError = (res, msg, err) => {
  console.error(msg, err);
  res.status(500).json({ error: msg });
};

module.exports = {
  handleError,
};
