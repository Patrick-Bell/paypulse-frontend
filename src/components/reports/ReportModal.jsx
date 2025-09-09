import { useState } from "react";
import { X, Check, DollarSign, MapPin, Calendar, BarChart3, AlarmClock } from "lucide-react";
import { createReport } from "../routes/ReportRoutes";
import { toast } from "sonner";

const ReportModal = ({ isOpen, setIsOpen, fetchReports }) => {
  const [reportName, setReportName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const reportCategories = [
    {
      icon: DollarSign,
      title: "Payment Information",
      items: [
        "Total earnings",
        "Gross pay",
        "Net pay", 
        "Tax deductions",
      ]
    },
    {
      icon: Calendar,
      title: "Shift Information", 
      items: [
        "Shift dates & times",
        "Location details",
        "Company details",
        "Shift duration",
        "Expenses"
      ]
    },
    {
      icon: BarChart3,
      title: "Performance Metrics",
      items: [
        "Total shifts worked",
        "Shifts completed",
        "Shifts cancelled",
        "Average shift length",
        "Best performing shift",
        "Least performing shift"
      ]
    },
    {
      icon: AlarmClock,
      title: 'Coming Soon',
      items: [
        "In depth chart analysis",
        "AI-generated insights",
        "Create reports by companies",
        "Create reports by locations",
    ]
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    createReport({ name: reportName, start_date: startDate, end_date: endDate });
    setReportName("");
    setStartDate("");
    setEndDate("");
    setIsOpen(false);
    toast.success("Report Created!", {
        description: "Your report has been successfully created.",
    });
    await fetchReports()
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/30" onClick={() => setIsOpen(false)} />
      
      {/* Modal panel */}
      <div className="relative w-full max-w-4xl transform overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">
            Generate New Report
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Create a comprehensive report for your selected date range
          </p>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Left: Form */}
          <div className="md:w-2/5 p-6 bg-gray-50">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Name
                </label>
                <input
                  type="text"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  required
                  placeholder="e.g., Q3 2024 Summary"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={!reportName || !startDate || !endDate}
                  className="w-full bg-indigo-600 text-white rounded-lg py-2.5 px-4 text-sm font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Generate Report
                </button>
              </div>

              {/* Quick preview */}
              <div className="bg-white rounded-lg p-3 border border-gray-200 mt-4">
                <h4 className="font-medium text-gray-900 mb-2 text-sm">Preview</h4>
                <div className="space-y-1 text-xs">
                  <p className="text-gray-600">
                    <span className="font-medium">Name:</span> {reportName || "—"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Period:</span> {
                      startDate && endDate 
                        ? `${startDate} to ${endDate}`
                        : "Select dates"
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Report includes */}
          <div className="md:w-3/5 p-6">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                Your report will include:
              </h3>
              <p className="text-sm text-gray-600">
                Comprehensive analysis across all key areas
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {reportCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="bg-white rounded-lg p-4 border border-gray-100">
                  <div className="flex items-center mb-3">
                    <div className="bg-indigo-100 rounded p-1.5 mr-2">
                      <category.icon className="w-4 h-4 text-indigo-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 text-sm">
                      {category.title}
                    </h4>
                  </div>
                  
                  <div className="space-y-1.5">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center">
                        <div className="bg-green-100 rounded-full p-0.5 mr-2 flex-shrink-0">
                          <Check className="w-2.5 h-2.5 text-green-600" />
                        </div>
                        <span className="text-xs text-gray-700">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 bg-indigo-50 rounded-lg p-3 border border-indigo-100">
              <div className="flex items-start">
                <div className="bg-indigo-100 rounded-full p-1.5 mr-2 mt-0.5">
                  <BarChart3 className="w-3 h-3 text-indigo-600" />
                </div>
                <div>
                  <h5 className="font-medium text-indigo-900 mb-0.5 text-sm">
                    Export Options
                  </h5>
                  <p className="text-xs text-indigo-700">
                    Download as PDF, Excel, or CSV format for easy sharing
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;