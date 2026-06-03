"use client";
import { useState } from "react";
import axios from "axios";

export default function LeadFormModal({ lead, onClose, refreshData }) {
  const [formData, setFormData] = useState({
    name: lead?.name || "",
    email: lead?.email || "",
    phone: lead?.phone || "",
    company: lead?.company || "",
    status: lead?.status || "New",
    notes: lead?.notes || "",
  });
  const [phoneError, setPhoneError] = useState("");
  const API_Url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phoneRegex = /^\+?[0-9\s\-]{7,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      setPhoneError(
        "Please enter a valid phone number (7 to 15 digits, spaces or dashes allowed).",
      );
      return;
    }
    setPhoneError("");
    try {
      if (lead) {
        await axios.put(`${API_Url}/api/leads/${lead._id}`, formData);
      } else {
        await axios.post(`${API_Url}/api/leads`, formData);
      }
      refreshData();
      onClose();
    } catch (err) {
      alert(
        err.response?.data?.error ||
          "An error occurred compiling form submission.",
      );
    }
  };

  // Shared class styles to guarantee text visibility inside inputs across themes
  const inputThemeClasses =
    "mt-1 w-full rounded-xl p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";

  return (
    <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-100 dark:border-slate-800 animate-fadeIn">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {lead ? "Edit Lead Profile" : "Register New Lead"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl transition"
          >
            &times;
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={inputThemeClasses}
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                Company
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                className={inputThemeClasses}
                placeholder="Acme Corp"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={inputThemeClasses}
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
              Phone Number
            </label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                if (phoneError) setPhoneError("");
              }}
              className={`${inputThemeClasses} ${phoneError ? "border-rose-500 focus:ring-rose-500" : ""}`}
              placeholder="+1 (555) 000-0000"
            />
            {phoneError && (
              <p className="text-xs text-rose-500 font-semibold mt-1 animate-pulse">
                {phoneError}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
              Pipeline Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className={`${inputThemeClasses} cursor-pointer`}
            >
              {["New", "Contacted", "Qualified", "Converted", "Lost"].map(
                (s) => (
                  <option
                    key={s}
                    value={s}
                    className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    {s}
                  </option>
                ),
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
              Interaction Notes
            </label>
            <textarea
              rows="3"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className={inputThemeClasses}
              placeholder="Provide interaction touchpoints..."
            ></textarea>
          </div>

          {/* Modal Action Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-sm transition"
            >
              Save Lead Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
