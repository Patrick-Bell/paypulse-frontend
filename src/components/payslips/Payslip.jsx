import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar, 
  DollarSign, 
  Download,
  Search,
  Receipt,
  Clock,
  Eye
} from 'lucide-react';
import { PDFDownloadLink } from "@react-pdf/renderer";
import PayslipPDF from './PayslipPDF';
import PayslipView from './PayslipView';
import { getPayslips } from '../routes/PayslipRoutes';
import { toast } from 'sonner';
import Loader from '../loading/Loader';
import { formatCurrency } from '../functions/Format'
import StaggerAppear from '../animations/StaggerAppear';


const PayslipsView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayslip, setSelectedPayslip] = useState(null)
  const [payslips, setPayslips] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPayslips = async () => {
    try{
    const response = await getPayslips()
    setPayslips(response)

    setLoading(false)
    }catch(e){
      console.log(e)
    }
  }

  useEffect(() => {
    fetchPayslips()
  }, [])


  const filteredPayslips = useMemo(() => {
    if (!searchTerm) return payslips;
    
    return payslips.filter(payslip =>
      payslip.period.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payslip.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const totalStats = useMemo(() => {
    const totalNet = filteredPayslips.reduce((sum, payslip) => sum + payslip.netPay, 0);
    const totalHours = filteredPayslips.reduce((sum, payslip) => sum + payslip.totalHours, 0);
    
    return { totalNet, totalHours };
  }, [filteredPayslips]);

  const getStatusColor = (status) => {
    return status === 'complete' ? 'text-green-600' : 'text-orange-600';
  };

  const downloadPayslip = (payslipId) => {
    alert(`Downloading payslip ${payslipId}`);
  };

  if (loading) {
    return <Loader />
  }

  return (
    <div>
      {selectedPayslip ? (
        <>
        <PayslipView payslip={selectedPayslip} setSelectedPayslip={setSelectedPayslip} />
        </>
      ):(
      <div>        
        {/* Payslips List */}
        <div className="space-y-4">
          {payslips
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .map((payslip, id) => (
            <StaggerAppear index={id}>
            <div key={payslip.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{payslip.name}</h3>
                  <p className="text-sm text-gray-500">{payslip.start} - {payslip.finish}</p>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(payslip.net)}</p>
                  <p className={`text-sm font-medium ${getStatusColor(payslip.status)}`}>
                    Ready to view
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Hours</p>
                    <p className="font-medium text-gray-900">{payslip.hours}h</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Gross Pay</p>
                    <p className="font-medium text-gray-900">{formatCurrency(payslip.gross)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Tax</p>
                    <p className="font-medium text-gray-900">{formatCurrency(payslip.tax)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500">Rate</p>
                      <p className="font-medium text-gray-900">£{(payslip.gross / payslip.hours).toFixed(2)}/h</p>
                    </div>
                    <div>
                    <PDFDownloadLink document={<PayslipPDF payslip={payslip}/>}>
                    <button
                      onClick={() => toast.success('Payslip downloaded successfully!', { description: 'You can find it in your downloads folder.'})}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    </PDFDownloadLink>
                    <button
                      onClick={() => setSelectedPayslip(payslip)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </StaggerAppear>
          ))}
        </div>

        {payslips.length === 0 && (
          <div className="h-[calc(100vh-200px)] flex items-center justify-center">
          <div className="text-center flex flex-col items-center justify-center p-6 rounded-lg bg-white">
            <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payslips found</h3>
            <p className="text-gray-500">Payslips are automatically generated on the 2nd of every month for the previous month. If you have not recieved a payslip for a month, you can reach out to us and we will generate one for you.</p>
          </div>
        </div>        
        )}
      </div>
      )}
      
    </div>
  );
};

export default PayslipsView;