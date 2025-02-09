const mongoose = require('mongoose');

const tremorDataSchema = new mongoose.Schema({
  start_timestamp: { type: String, required: true },
  end_timestamp: { type: String, required: true },
  subject_id: { type: Number, required: true },

  // Magnitude-related fields
  Magnitude_avg_diff_mean: { type: Number, required: true },
  Magnitude_above_mean_rt: { type: Number, required: true },
  Magnitude_energy: { type: Number, required: true },

  // PC1-related fields
  PC1_mean: { type: Number, required: true },
  PC1_mean_abs: { type: Number, required: true },
  PC1_med_dev: { type: Number, required: true },
  PC1_maxmin_diff: { type: Number, required: true },
  PC1_pos_rt: { type: Number, required: true },
  PC1_peaks_rt: { type: Number, required: true },
  PC1_rest_rt: { type: Number, required: true },

  // Magnitude FFT-related fields
  Magnitude_fft_mean: { type: Number, required: true },
  Magnitude_fft_med_dev: { type: Number, required: true },
  Magnitude_fft_min: { type: Number, required: true },
  Magnitude_fft_max: { type: Number, required: true },
  Magnitude_fft_maxmin_diff: { type: Number, required: true },
  Magnitude_fft_peaks_rt: { type: Number, required: true },
  Magnitude_fft_rest_rt: { type: Number, required: true },

  // PC1 FFT-related fields
  PC1_fft_mean: { type: Number, required: true },
  PC1_fft_med_dev: { type: Number, required: true },
  PC1_fft_max: { type: Number, required: true },
  PC1_fft_maxmin_diff: { type: Number, required: true },
  PC1_fft_peaks_rt: { type: Number, required: true },
  PC1_fft_energy: { type: Number, required: true },
  PC1_fft_entropy: { type: Number, required: true },
  PC1_fft_flatness: { type: Number, required: true },

  // Tremor-related labels
  Constancy_of_rest: { type: Number, required: true },
  Kinetic_tremor: { type: Number, required: true },
  Postural_tremor: { type: Number, required: true },
  Rest_tremor: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('TremorData', tremorDataSchema);
