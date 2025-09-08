import Tippy from "@tippyjs/react"
import { Download, Eye, Info, Plus, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import ReportModal from "./ReportModal"
import { getReports } from "../routes/ReportRoutes"
import StaggerAppear from "../animations/StaggerAppear"
import PayslipPDF from "../payslips/PayslipPDF"
import { formatCurrency, formatDate } from "../functions/Format"
import { PDFDownloadLink } from "@react-pdf/renderer"
import ReportView from "./ReportView"


const Report = () => {

    const [isOpen, setIsOpen] = useState(false)
    const [reports, setReports] = useState([])
    const [selectedReport, setSelectedReport] = useState(null)

    

    const fetchReports = async () => {
        const response = await getReports()
        setReports(response)
    }

    useEffect(() => {
        fetchReports()
    }, [])


    return (

        <>

        {selectedReport ? (
          <ReportView report={selectedReport} setSelectedReport={setSelectedReport} />
        ):(
          <>
          <div className='flex mb-4 items-end justify-end'>
        <Tippy content='Click to add a new report'>
          <div onClick={() => setIsOpen(true)} className='border border-gray-200 rounded-lg p-2 hover:bg-gray-50 cursor-pointer'>
            <Plus className='text-gray-500 hover:text-gray-700 transition-colors' />
          </div>
        </Tippy>
      </div>

      <div className="space-y-4">
          {reports
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .map((report, id) => {
            const hours = report.shifts.filter(s => s.status !== 'cancelled').reduce((acc, shift) => acc + parseFloat(shift.hours), 0)
            const totalPay = report.shifts.filter(s => s.status !== 'cancelled').reduce((acc, shift) => acc + parseFloat(shift.pay), 0)
            const tax = totalPay * 0.2 // Assuming a flat 20% tax rate
            const rate = hours > 0 ? totalPay / hours : 0

            return (
            <StaggerAppear index={id}>
            <div key={report.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{report.name}</h3>
                  <p className="text-sm text-gray-500">{formatDate(report.start_date)} - {formatDate(report.end_date)}</p>
                </div>

                <div className="text-right">
                </div>
                
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
                    <div>
                    <PDFDownloadLink document={<PayslipPDF payslip={report}/>}>
                    <button
                      onClick={() => toast.success('Payslip downloaded successfully!', { description: 'You can find it in your downloads folder.'})}
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
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </StaggerAppear>
          )})}
        </div>
          </>
        )}
        
         

        <ReportModal isOpen={isOpen} setIsOpen={setIsOpen} createReport={() => {}} />
        
        </>
    )
}

export default Report