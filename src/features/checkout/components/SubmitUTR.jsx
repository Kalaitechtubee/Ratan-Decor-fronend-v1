import React, { useState } from "react";
import axios from "axios";

const SubmitUTR = ({ orderId, amount }) => {
  const [utr, setUtr] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!utr.trim()) return alert("Enter valid UTR");

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/payment/save-utr", {
        orderId,
        utr,
        amount
      });

      setMessage(res.data.message);
    } catch (err) {
      setMessage("Error saving UTR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg mt-4">
      <h2 className="font-bold">Enter UPI Transaction ID (UTR)</h2>

      <input
        value={utr}
        onChange={(e) => setUtr(e.target.value)}
        placeholder="Example: 234567891234"
        className="border p-2 rounded w-full mt-3"
      />

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white mt-3 p-3 rounded w-full"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit UTR"}
      </button>

      {message && <p className="mt-2 text-center">{message}</p>}
    </div>
  );
};

export default SubmitUTR;
