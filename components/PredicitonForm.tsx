"use client";

import { useProfile } from "@farcaster/auth-kit";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

interface FormState {
  prediction: string;
  resultDate: Date | null;
}

const PredictionForm = () => {
  const [, setMessage] = useState("");
  const {
    isAuthenticated,
    profile: { fid },
  } = useProfile();
  const [formState, setFormState] = useState<FormState>({
    prediction: "",
    resultDate: null,
  });

  const [errors, setErrors] = useState({
    prediction: "",
    // resultDate: "",
  });

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  // Form validation
  useEffect(() => {
    const isValidPrediction = formState.prediction.trim() !== "";
    // const isValidDate = formState.resultDate !== null;
    const isValidDate = true;

    setErrors({
      prediction: isValidPrediction ? "" : "Prediction is required",
      // resultDate: isValidDate ? "" : "Please select a valid date",
    });
    console.log(isAuthenticated, fid);
    if (isValidPrediction && isValidDate && isAuthenticated) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [formState, fid, isAuthenticated]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: name === "wager" || name === "odds" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isSubmitDisabled) {
      // Make a POST request to the API route
      const response = await fetch("/api/wager", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: formState.prediction, createdByFid: fid }),
      });

      const result = await response.json();
      if (result.success) {
        setMessage("Data saved successfully!");
        alert(result.id);
      } else {
        setMessage(result.error || "Something went wrong!");
      }
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

      {/* <div>
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
      </div> */}
      <div>
        <motion.button
          type="submit"
          disabled={isSubmitDisabled}
          className={`mt-4 w-full py-3 rounded-lg font-semibold transition ease-in-out text-lg font-monospace tracking-wider ${
            isSubmitDisabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#7c66c1] text-white hover:bg-[#5e4d91]"
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
