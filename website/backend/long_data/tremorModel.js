const mongoose = require('mongoose');

const tremorSchema = new mongoose.Schema({
  start_timestamp: { type: String, required: true },  // Time as string (e.g., '17:54.1')
  end_timestamp: { type: String, required: true },    // Time as string (e.g., '18:14.5')
  subject_id: { type: Number, required: true },       // Subject ID (patient identifier)

  Magnitude_avg_diff_mean: { type: Number },
  Magnitude_above_mean_rt: { type: Number },
  Magnitude_energy: { type: Number },

  PC1_mean: { type: Number },
  PC1_mean_abs: { type: Number },
  PC1_med_dev: { type: Number },
  PC1_maxmin_diff: { type: Number },
  PC1_pos_rt: { type: Number },
  PC1_peaks_rt: { type: Number },
  PC1_rest_rt: { type: Number },

  Magnitude_fft_mean: { type: Number },
  Magnitude_fft_med_dev: { type: Number },
  Magnitude_fft_min: { type: Number },
  Magnitude_fft_max: { type: Number },
  Magnitude_fft_maxmin_diff: { type: Number },
  Magnitude_fft_peaks_rt: { type: Number },
  Magnitude_fft_rest_rt: { type: Number },

  PC1_fft_mean: { type: Number },
  PC1_fft_med_dev: { type: Number },
  PC1_fft_max: { type: Number },
  PC1_fft_maxmin_diff: { type: Number },
  PC1_fft_peaks_rt: { type: Number },
  PC1_fft_energy: { type: Number },
  PC1_fft_entropy: { type: Number },
  PC1_fft_flatness: { type: Number },

  Constancy_of_rest: { type: Number },  // Binary classification (0 or 1)
  Kinetic_tremor: { type: Number },     // Binary classification (0 or 1)
  Postural_tremor: { type: Number },    // Binary classification (0 or 1)
  Rest_tremor: { type: Number },        // Binary classification (0 or 1)

}, { timestamps: true });

module.exports = mongoose.model('TremorData', tremorSchema, 'tremor_data');
