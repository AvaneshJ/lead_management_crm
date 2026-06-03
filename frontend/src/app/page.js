"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import axios from "axios";
import LeadTable from "@/components/LeadTable";
import LeadFormModal from "@/components/LeadFormModal";
import StatsWidgets from "@/components/StatsWidgets";

export default function Dashboard() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const API_Url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_Url}/api/leads`, {
        params: {
          search,
          status: statusFilter,
          page,
          limit: 8,
          _t: Date.now(),
        },
      });
      setLeads(res.data.data || []);
      setStats(res.data.stats || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Error fetching operational CRM data streams:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mounted) return;

    const delayDebounce = setTimeout(() => {
      fetchLeads();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search, statusFilter, page, mounted]);

  // 4. Centralized Delete Handler
  const handleDeleteLead = async (id) => {
    if (!confirm("Delete this lead permanently?")) return;

    try {
      setLoading(true);
      await axios.delete(`${API_Url}/api/leads/${id}`);
      await fetchLeads();
    } catch (error) {
      console.error("Error deleting lead:", error);
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Modernized Header Hub */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Lead Management CRM
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Track pipeline conversions and active accounts.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button
              onClick={() => {
                setCurrentLead(null);
                setIsModalOpen(true);
              }}
              className="flex-1 sm:flex-initial bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-sm shadow-indigo-500/10 transition"
            >
              + Add New Lead
            </button>
          </div>
        </div>

        {/* Analytical Aggregators */}
        <StatsWidgets stats={stats} />

        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200/60 dark:border-slate-800/60">
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        {/* Dynamic Table State Routing */}
        {loading ? (
          <div className="text-center py-16 text-slate-400 font-medium tracking-wide animate-pulse">
            Loading active pipelines...
          </div>
        ) : (
          <LeadTable
            leads={leads}
            onEdit={(l) => {
              setCurrentLead(l);
              setIsModalOpen(true);
            }}
            onDelete={handleDeleteLead}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Persistent Overlay Form Modal */}
      {isModalOpen && (
        <LeadFormModal
          lead={currentLead}
          onClose={() => setIsModalOpen(false)}
          refreshData={fetchLeads}
        />
      )}
    </div>
  );
}
