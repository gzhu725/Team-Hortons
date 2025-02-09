const TremorData = require('./tremorModel');

const getTremorData = async (req, res) => {
  try {
    const tremorData = await TremorData.find();  // Fetch all tremor data
    if (!tremorData.length) {
      return res.status(404).json({ message: "No tremor data found" });
    }
    res.status(200).json(tremorData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tremor data', error: error.message });
  }
};

module.exports = { getTremorData };
