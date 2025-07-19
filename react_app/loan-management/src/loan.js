import { useState } from "react";

export default function Loan() {

  const initialState = {
    name: "",
    mobile: "",
    city: "",
    company: "",
    income: "",
    acc: "",
    occupation: "",
    agree: false,
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); 

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const result = await res.json();
      console.log("Server responded:", result);

      setStatus("success");
      setFormData(initialState);
    } catch (err) {
      console.error("Submission error:", err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loan-container">
      <h1>Personal Loan</h1>
      <h3>⋆ Interest Rate 9.99% ⋆</h3>

      <form onSubmit={handleSubmit} className="loan-from">
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />
          <input
            id="mobile"
            name="mobile"
            type="tel"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Mobile Number"
            required
          />

          <input
            id="city"
            name="city"
            type="text"
            value={formData.city}
            onChange={handleChange}
            placeholder="City Name"
            required
          />

          <input
            id="company"
            name="company"
            type="text"
            value={formData.company}
            onChange={handleChange}
            placeholder=" Company Name"
            required
          />
 
          <input
            id="income"
            name="income"
            type="number"
            value={formData.income}
            onChange={handleChange}
            placeholder="Net Monthly Income"
            required
          />

          <select
            id="acc"
            name="acc"
            value={formData.acc}
            onChange={handleChange}
            required
          >
            <option value="">Salary Account in</option>
            <option value="HDFC">HDFC Bank</option>
            <option value="SBI">State Bank of India</option>
            <option value="ICICI">ICICI Bank</option>
            <option value="AXIS">Axis Bank</option>
            <option value="OTHER">Other</option>
          </select>

          <select
            id="occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            required
          >
            <option value="">Occupation</option>
            <option value="salaried">Salaried</option>
            <option value="selfEmployed">Self Employed</option>
            <option value="professional">
              Self Employed Professional
            </option>
          </select>
          <br/>

          <input
            id="agree"
            name="agree"
            type="checkbox"
            checked={formData.agree}
            onChange={handleChange}
            required
          />
          <label htmlFor="agree">
            I have read the Privacy Policy & agree to Terms & Conditions
          </label>
          <br/>

        <button
          type="submit"
          disabled={loading}
          id="submitbtn"
        >
          {loading ? "Submitting…" : "GET THE BEST OFFER"}
        </button>

        {status === "success" && (
          <p>
            Application submitted successfully!
          </p>
        )}
        {status === "error" && (
          <p>
            Oops! Something went wrong. Please try again.
          </p>
        )}
      </form>
    </div>
  );
}
