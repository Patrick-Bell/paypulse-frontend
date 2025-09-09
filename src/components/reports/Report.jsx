import Tippy from "@tippyjs/react"
import { Download, Eye, Plus, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import ReportModal from "./ReportModal"
import { deleteReport, getReports } from "../routes/ReportRoutes"
import StaggerAppear from "../animations/StaggerAppear"
import PayslipPDF from "../payslips/PayslipPDF"
import { formatCurrency, formatDate } from "../functions/Format"
import { PDFDownloadLink } from "@react-pdf/renderer"
import ReportView from "./ReportView"
import { toast } from "sonner"
import Loader from '../loading/Loader'
import ReportSummaryPDF from "./ReportSummaryPDF"

const Report = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [reports, setReports] = useState([])
  const [selectedReport, setSelectedReport] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchReports = async () => {
    try {
      const response = await getReports()
      setReports(response)
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch reports", error)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [isOpen, selectedReport])

  const handleDelete = async (id) => {
    if (!id) return
    try {
      await deleteReport(id)
      toast.success("Report deleted successfully", {
        description: "The report has been removed from your list."
      })
      // Reset selectedReport if it was the deleted one
      if (selectedReport?.id === id) setSelectedReport(null)
      fetchReports()
    } catch (e) {
      console.error("Delete failed", e)
      toast.error("Failed to delete report")
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <>
      {selectedReport ? (
        <ReportView report={selectedReport} setSelectedReport={setSelectedReport} />
      ) : reports.length === 0 ? (
          <div className="flex items-center justify-center h-100">
            <p className="text-gray-500 text-center text-md">
              No reports found. Click to <span onClick={() => setIsOpen(true)} className="text-indigo-600 font-medium cursor-pointer">add</span> a new report to get started.
            </p>
          </div>
      ) : (
        <>
          <div className="flex mb-4 items-end justify-end">
            <Tippy content="Click to add a new report">
              <div
                onClick={() => setIsOpen(true)}
                className="border border-gray-200 rounded-lg p-2 hover:bg-gray-50 cursor-pointer"
              >
                <Plus className="text-gray-500 hover:text-gray-700 transition-colors" />
              </div>
            </Tippy>
          </div>

          <div className="space-y-4">
            {reports
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map((report, index) => {
                const hours = report.shifts
                  .filter((s) => s.status !== "cancelled")
                  .reduce((acc, shift) => acc + parseFloat(shift.hours), 0)
                const totalPay = report.shifts
                  .filter((s) => s.status !== "cancelled")
                  .reduce((acc, shift) => acc + parseFloat(shift.pay), 0)
                const tax = totalPay * 0.2
                const rate = hours > 0 ? totalPay / hours : 0

                return (
                  <StaggerAppear index={index} key={report.id}>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{report.name}</h3>
                          <p className="text-sm text-gray-500">
                            {formatDate(report.start_date)} - {formatDate(report.end_date)}
                          </p>
                        </div>
                        <div className="text-right"></div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Hours</p>
                            <p className="font-medium text-gray-900">{hours}h</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Gross Pay</p>
                            <p className="font-medium text-gray-900">{formatCurrency(totalPay)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Tax</p>
                            <p className="font-medium text-gray-900">{formatCurrency(tax)}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-gray-500">Rate</p>
                              <p className="font-medium text-gray-900">{formatCurrency(rate)}</p>
                            </div>
                            <div className="flex gap-1">
                              <PDFDownloadLink document={<ReportSummaryPDF reportData={report} />}>
                                <button
                                  onClick={() =>
                                    toast.success("Payslip downloaded successfully!", {
                                      description: "You can find it in your downloads folder."
                                    })
                                  }
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Download"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                              </PDFDownloadLink>

                              <button
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View"
                                onClick={() => setSelectedReport(report)}
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              <button
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                                onClick={() => handleDelete(report.id)}
                              >
                                <Trash className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </StaggerAppear>
                )
              })}
          </div>
        </>
      )}

      <ReportModal isOpen={isOpen} setIsOpen={setIsOpen} fetchReports={fetchReports} />
    </>
  )
}

export default Report
