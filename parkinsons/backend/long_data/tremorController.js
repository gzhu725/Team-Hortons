const Entry = require('./tremorModel');

// Fetch all entries for historical data
const getAllEntries = async (req, res) => {
  try {
    const entries = await Entry.find();
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
};

module.exports = { getAllEntries };
