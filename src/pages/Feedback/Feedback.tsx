import React, { useState } from 'react';

const Feedback = () => {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          We Value Your Feedback
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Help us improve our AI-generated content detection tool. Share your thoughts, suggestions, or report any issues you encountered.
        </p>
        {submitted ? (
          <div className="bg-green-100 text-green-800 p-4 rounded-lg">
            Thank you for your feedback!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-4 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={5}
              placeholder="Write your feedback here..."
              required
            ></textarea>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition"
            >
              Submit Feedback
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Feedback;
