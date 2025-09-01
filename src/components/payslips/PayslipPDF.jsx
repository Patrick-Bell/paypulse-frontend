import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { getYearPaySlips } from '../routes/PayslipRoutes';
import { useState, useEffect } from 'react';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: '2 solid #e0e0e0',
  },
  companyInfo: {
    flexDirection: 'column',
    flex: 1,
  },
  companyName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  companyAddress: {
    fontSize: 10,
    color: '#6b7280',
    lineHeight: 1.4,
  },
  payslipTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E40AF',
    textAlign: 'center',
    marginBottom: 25,
    letterSpacing: 1,
  },
  employeeSection: {
    flexDirection: 'row',
    marginBottom: 25,
    border: '1 solid #e5e7eb',
    padding: 20,
    borderRadius: 4,
    backgroundColor: '#F9FAFB',
  },
  employeeLeft: {
    flex: 1,
    marginRight: 30,
  },
  employeeRight: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    borderBottom: '1 solid #d1d5db',
    paddingBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingBottom: 2,
  },
  label: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: 'bold',
    flex: 1,
  },
  value: {
    fontSize: 10,
    color: '#1f2937',
    flex: 1,
    textAlign: 'right',
  },
  earningsSection: {
    marginBottom: 25,
  },
  tableContainer: {
    border: '1 solid #e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E0F2FE',
    padding: 12,
    borderBottom: '1 solid #e5e7eb',
  },
  tableHeaderText: {
    color: '#1D4ED8',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottom: '1 solid #f3f4f6',
    minHeight: 30,
    alignItems: 'center',
  },
  tableRowAlt: {
    flexDirection: 'row',
    padding: 10,
    borderBottom: '1 solid #f3f4f6',
    backgroundColor: '#F3F4F6',
    minHeight: 30,
    alignItems: 'center',
  },
  tableCell: {
    fontSize: 10,
    color: '#1f2937',
  },
  tableCellAmount: {
    fontSize: 10,
    color: '#1f2937',
    textAlign: 'right',
    fontWeight: 'bold',
  },
  col1: { flex: 3, textAlign: 'left' },
  col2: { flex: 2, textAlign: 'center' },
  col3: { flex: 2, textAlign: 'right' },
  summarySection: {
    flexDirection: 'row',
    marginTop: 25,
  },
  summaryLeft: {
    flex: 1,
    marginRight: 20,
  },
  summaryRight: {
    flex: 1,
  },
  summaryBox: {
    border: '1 solid #e5e7eb',
    padding: 18,
    marginBottom: 15,
    backgroundColor: '#F9FAFB',
    borderRadius: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingBottom: 3,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  summaryValue: {
    fontSize: 10,
    color: '#1f2937',
    fontWeight: 'bold',
  },
  netPayBox: {
    border: '2 solid #1D4ED8',
    padding: 18,
    marginTop: 15,
    backgroundColor: '#EFF6FF',
    borderRadius: 4,
  },
  netPayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  netPayLabel: {
    fontSize: 14,
    color: '#1E3A8A',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  netPayValue: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 35,
    paddingTop: 20,
    borderTop: '1 solid #e5e7eb',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 9,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 1.4,
  },
});

const PayslipPDF = ({ payslip }) => {

  const [yearPayslips, setYearPayslips] = useState({
    grossPay: '£0.00',
    tax: '£0.00',
    netPay: '£0.00',
  });

  const fetchData = async () => {
    const response = await getYearPaySlips(payslip?.id)
    setYearPayslips({
      grossPay: response.map(p => parseFloat(p.gross)).reduce((a, b) => a + b, 0),
      tax: response.map(p => parseFloat(p.tax)).reduce((a, b) => a + b, 0),
      netPay: response.map(p => parseFloat(p.net)).reduce((a, b) => a + b, 0),
    })
  }

  useEffect(() => {
    fetchData()
  }, []);

  const formatCurrency = (amount) => {
    return `£${parseFloat(amount).toLocaleString('en-GB', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };
  

  const payslipData = {
    company: {
      name: 'PayPulse',
      address: '123 Business Street\nLondon, UK SW1A 1AA\nTel: +44 20 7946 0958',
    },
    employee: {
      name: payslip?.username || '',
      employeeId: 'EMP001',
      position: 'Developer',
      payPeriod: 'Monthly',
      payDate: 'Completed',
      payPeriodStart: payslip?.start,
      payPeriodEnd: payslip?.finish,
    },
    earnings: [
      { 
        description: 'Basic Salary', 
        hours: payslip?.hours, 
        amount: payslip?.gross ,
        rate: payslip?.rate
      },
    ],
    summary: {
      grossPay: payslip?.gross,
      totalDeductions: payslip?.tax,
      netPay: payslip?.net,
      yearToDate: {
        grossPay: payslip?.year_gross,
        tax: payslip?.year_tax,
        netPay: payslip?.year_net,
      },
    },
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{payslipData.company.name}</Text>
            <Text style={styles.companyAddress}>{payslipData.company.address}</Text>
          </View>
        </View>

        {/* Employee Information */}
        <View style={styles.employeeSection}>
          <View style={styles.employeeLeft}>
            <Text style={styles.sectionTitle}>Employee Details</Text>
            {['name', 'employeeId', 'position'].map((field, i) => (
              <View style={styles.infoRow} key={i}>
                <Text style={styles.label}>
                  {field === 'employeeId' ? 'Employee ID' : 
                   field === 'name' ? 'Name' :
                   field === 'position' ? 'Position' : 
                   field.replace(/([A-Z])/g, ' $1') + ':'}
                </Text>
                <Text style={styles.value}>{payslipData.employee[field]}</Text>
              </View>
            ))}
          </View>
          <View style={styles.employeeRight}>
            <Text style={styles.sectionTitle}>Pay Period</Text>
            {['payPeriod', 'payPeriodStart', 'payPeriodEnd', 'payDate'].map((field, i) => (
              <View style={styles.infoRow} key={i}>
                <Text style={styles.label}>
                  {field === 'payDate' ? 'Pay Date' : ''}
                  {field === 'payPeriod' ? 'Pay Period' : ''}
                  {field === 'payPeriodStart' ? 'Period Start' : ''}
                  {field === 'payPeriodEnd' ? 'Period End' : ''}
                  
                </Text>
                <Text style={styles.value}>{payslipData.employee[field]}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Earnings Section */}
        <View style={styles.earningsSection}>
          <Text style={styles.sectionTitle}>Earnings</Text>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.col1]}>Description</Text>
              <Text style={[styles.tableHeaderText, styles.col2]}>Hours</Text>
              <Text style={[styles.tableHeaderText, styles.col2]}>Rate</Text>
              <Text style={[styles.tableHeaderText, styles.col3]}>Amount</Text>
            </View>
            {payslipData.earnings.map((earning, index) => (
              <View key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.tableCell, styles.col1]}>{earning.description}</Text>
                <Text style={[styles.tableCell, styles.col2]}>{earning.hours}</Text>
                <Text style={[styles.tableCell, styles.col2]}>{formatCurrency(earning.rate)}</Text>
                <Text style={[styles.tableCellAmount, styles.col3]}>{formatCurrency(earning.amount)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Summary Section */}
        <View style={styles.summarySection}>
          <View style={styles.summaryLeft}>
            <View style={styles.summaryBox}>
              <Text style={styles.sectionTitle}>This Period</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Gross Pay:</Text>
                <Text style={styles.summaryValue}>{formatCurrency(payslipData.summary.grossPay)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Deductions:</Text>
                <Text style={styles.summaryValue}>{formatCurrency(payslipData.summary.totalDeductions)}</Text>
              </View>
            </View>
          </View>
          <View style={styles.summaryRight}>
            <View style={styles.summaryBox}>
              <Text style={styles.sectionTitle}>Year to Date</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Gross Pay:</Text>
                <Text style={styles.summaryValue}>{formatCurrency(payslipData.summary.yearToDate.grossPay)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Income Tax:</Text>
                <Text style={styles.summaryValue}>{formatCurrency(payslipData.summary.yearToDate.tax)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Net Pay:</Text>
                <Text style={styles.summaryValue}>{formatCurrency(payslipData.summary.yearToDate.netPay)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Net Pay Box */}
        <View style={styles.netPayBox}>
          <View style={styles.netPayRow}>
            <Text style={styles.netPayLabel}>NET PAY</Text>
            <Text style={styles.netPayValue}>{formatCurrency(payslipData.summary.netPay)}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This payslip is computer generated and does not require a signature.
          </Text>
          <Text style={styles.footerText}>
            For any queries regarding this payslip, please contact HR Department.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PayslipPDF;