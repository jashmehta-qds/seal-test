'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface FormState {
  prediction: string;
  resultDate: Date | null;
  wager: number;
  odds: number;
}

const PredictionForm = () => {
  const [formState, setFormState] = useState<FormState>({
    prediction: '',
    resultDate: null,
    wager: 0,
    odds: 0,
  });

  const [errors, setErrors] = useState({
    prediction: '',
    resultDate: '',
    wager: '',
    odds: '',
  });

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  // Form validation
  useEffect(() => {
    const isValidPrediction = formState.prediction.trim() !== '';
    const isValidDate = formState.resultDate !== null;
    const isValidWager = formState.wager > 0.1;
    const isValidOdds = formState.odds > 0.0;

    setErrors({
      prediction: isValidPrediction ? '' : 'Prediction is required',
      resultDate: isValidDate ? '' : 'Please select a valid date',
      wager: isValidWager ? '' : 'Wager must be greater than 0.1',
      odds: isValidOdds ? '' : 'Odds must be greater than 0.0',
    });

    if (isValidPrediction && isValidDate && isValidWager && isValidOdds) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [formState]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: name === 'wager' || name === 'odds' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isSubmitDisabled) {
      console.log('Form submitted:', formState);
      // Perform your form submission logic here
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-4 bg-white shadow-2xl rounded-lg max-w-xl border-2 border-slate-500 min-w-[400px]" 
    >
      <h2 className="text-2xl font-semibold text-gray-800 text-center font-monospace tracking-wider">
        Make Your Prediction
      </h2>

      {/* Prediction Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Prediction
        </label>
        <input
          type="text"
          name="prediction"
          value={formState.prediction}
          onChange={handleChange}
          className="p-3 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition ease-in-out"
          placeholder="Enter your prediction"
          required
        />
        {errors.prediction && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm mt-1"
          >
            {errors.prediction}
          </motion.p>
        )}
      </div>

      {/* Result Date Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Result Date
        </label>
        <DatePicker
          selected={formState.resultDate}
          onChange={(date) =>
            setFormState((prevState) => ({
              ...prevState,
              resultDate: date,
            }))
          }
          className="p-3 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition ease-in-out"
          placeholderText="Select date"
          dateFormat="yyyy/MM/dd"
          required
        />
        {errors.resultDate && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm mt-1"
          >
            {errors.resultDate}
          </motion.p>
        )}
      </div>

      {/* Wager Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Wager
        </label>
        <input
          type="number"
          name="wager"
          value={formState.wager}
          onChange={handleChange}
          className="p-3 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition ease-in-out"
          step="0.01"
          min="0.1"
          required
        />
        {errors.wager && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm mt-1"
          >
            {errors.wager}
          </motion.p>
        )}
      </div>

      {/* Odds Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Odds
        </label>
        <input
          type="number"
          name="odds"
          value={formState.odds}
          onChange={handleChange}
          className="p-3 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition ease-in-out"
          step="0.01"
          min="0"
          required
        />
        {errors.odds && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm mt-1"
          >
            {errors.odds}
          </motion.p>
        )}
      </div>

      {/* Submit Button */}
      <div>
        <motion.button
          type="submit"
          disabled={isSubmitDisabled}
          className={`mt-4 w-full py-3 rounded-lg font-semibold transition ease-in-out text-lg font-monospace tracking-wider ${
            isSubmitDisabled
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-[#7c66c1] text-white hover:bg-[#5e4d91]'
          }`}
          whileHover={!isSubmitDisabled ? { scale: 1.02 } : {}}
        >
          Cast Wager
        </motion.button>
      </div>
    </motion.form>
  );
};

export default PredictionForm;
