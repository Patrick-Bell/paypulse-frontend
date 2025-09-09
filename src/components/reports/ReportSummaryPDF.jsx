import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
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
  reportTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E40AF',
    textAlign: 'center',
    marginBottom: 25,
    letterSpacing: 1,
  },
  reportInfoSection: {
    flexDirection: 'row',
    marginBottom: 25,
    border: '1 solid #e5e7eb',
    padding: 20,
    borderRadius: 4,
    backgroundColor: '#F9FAFB',
  },
  reportLeft: {
    flex: 1,
    marginRight: 30,
  },
  reportRight: {
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
  shiftsSection: {
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
  totalBox: {
    border: '2 solid #1D4ED8',
    padding: 18,
    marginTop: 15,
    backgroundColor: '#EFF6FF',
    borderRadius: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: '#1E3A8A',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  totalValue: {
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 25,
  },
  statCard: {
    flex: 0.48,
    margin: '1%',
    border: '1 solid #e5e7eb',
    padding: 15,
    backgroundColor: '#F9FAFB',
    borderRadius: 4,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 9,
    color: '#6b7280',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

const ReportSummaryPDF = ({ reportData }) => {
  const formatCurrency = (amount) => {
    return `£${parseFloat(amount || 0).toLocaleString('en-GB', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const [validShifts, setValidShifts] = useState(reportData?.shifts.filter(s => s.status !== 'cancelled') || []);

  // Calculate summary statistics
  const calculateSummary = () => {
    if (!reportData?.shifts || !Array.isArray(reportData.shifts)) {
      return {
        totalShifts: 0,
        totalHours: 0,
        totalGrossPay: 0,
        totalNetPay: 0,
        totalTax: 0,
        averageHoursPerShift: 0,
        averagePayPerShift: 0,
      };
    }

    const shifts = reportData.shifts.filter(s => s.status !== 'cancelled');
    const totalShifts = shifts.length;
    const totalHours = shifts.reduce((sum, shift) => sum + (parseFloat(shift.hours) || 0), 0);
    const totalGrossPay = shifts.reduce((sum, shift) => sum + (parseFloat(shift.hours) * parseFloat(shift.rate) || 0), 0);
    const totalNetPay = shifts.reduce((sum, shift) => {
        const hours = parseFloat(shift.hours) || 0;
        const rate = parseFloat(shift.rate) || 0;
        return sum + hours * rate * 0.8; // net pay after 20% tax
      }, 0);
          const totalTax = shifts.reduce((sum, shift) => {
        const hours = parseFloat(shift.hours) || 0;
        const rate = parseFloat(shift.rate) || 0;
        return sum + hours * rate * 0.2;
      }, 0);
          
    return {
      totalShifts,
      totalHours,
      totalGrossPay,
      totalNetPay,
      totalTax,
      averageHoursPerShift: totalShifts > 0 ? totalHours / totalShifts : 0,
      averagePayPerShift: totalShifts > 0 ? totalGrossPay / totalShifts : 0,
    };
  };

  const summary = calculateSummary();

  const companyData = {
    name: 'PayPulse',
    address: '123 Business Street\nLondon, UK SW1A 1AA\nTel: +44 20 7946 0958',
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{companyData.name}</Text>
            <Text style={styles.companyAddress}>{companyData.address}</Text>
          </View>
        </View>

        <Text style={styles.reportTitle}>WORK PERIOD SUMMARY</Text>

        {/* Report Information */}
        <View style={styles.reportInfoSection}>
          <View style={styles.reportLeft}>
            <Text style={styles.sectionTitle}>Report Details</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Report Name:</Text>
              <Text style={styles.value}>{reportData?.name || 'Untitled Report'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Report ID:</Text>
              <Text style={styles.value}>#{reportData?.id || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Generated:</Text>
              <Text style={styles.value}>{formatDate(new Date().toISOString())}</Text>
            </View>
          </View>
          <View style={styles.reportRight}>
            <Text style={styles.sectionTitle}>Period Coverage</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Start Date:</Text>
              <Text style={styles.value}>{formatDate(reportData?.start_date)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>End Date:</Text>
              <Text style={styles.value}>{formatDate(reportData?.end_date)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Duration:</Text>
              <Text style={styles.value}>
                {reportData?.start_date && reportData?.end_date
                  ? Math.ceil((new Date(reportData.end_date) - new Date(reportData.start_date)) / (1000 * 60 * 60 * 24))
                  : 0} days
              </Text>
            </View>
          </View>
        </View>

        {/* Statistics Grid */}
        <Text style={styles.sectionTitle}>Key Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{summary.totalShifts}</Text>
            <Text style={styles.statLabel}>Total Shifts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{summary.totalHours.toFixed(1)}h</Text>
            <Text style={styles.statLabel}>Total Hours</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{formatCurrency(summary.totalGrossPay)}</Text>
            <Text style={styles.statLabel}>Gross Pay</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{formatCurrency(summary.totalNetPay)}</Text>
            <Text style={styles.statLabel}>Net Pay</Text>
          </View>
        </View>

        {/* Summary Section */}
        <View style={styles.summarySection}>
          <View style={styles.summaryLeft}>
            <View style={styles.summaryBox}>
              <Text style={styles.sectionTitle}>Financial Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Gross Pay:</Text>
                <Text style={styles.summaryValue}>{formatCurrency(summary.totalGrossPay)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Tax:</Text>
                <Text style={styles.summaryValue}>{formatCurrency(summary.totalTax)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Net Pay:</Text>
                <Text style={styles.summaryValue}>{formatCurrency(summary.totalNetPay)}</Text>
              </View>
            </View>
          </View>
          <View style={styles.summaryRight}>
            <View style={styles.summaryBox}>
              <Text style={styles.sectionTitle}>Work Averages</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Hours per Shift:</Text>
                <Text style={styles.summaryValue}>{summary.averageHoursPerShift.toFixed(1)}h</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Pay per Shift:</Text>
                <Text style={styles.summaryValue}>{formatCurrency(summary.averagePayPerShift)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Expenses:</Text>
                <Text style={styles.summaryValue}>
                  {reportData?.expenses?.length || 0} items
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Total Net Pay Box */}
        <View style={styles.totalBox}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL NET EARNINGS</Text>
            <Text style={styles.totalValue}>{formatCurrency(summary.totalNetPay)}</Text>
          </View>
        </View>
        </Page>



        <Page size={'A4'} style={styles.page}>
        {/* Recent Shifts Table */}
        {validShifts.length > 0 && (
          <View style={styles.shiftsSection}>
            <Text style={styles.sectionTitle}>Shifts ({validShifts.length})</Text>
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.col1]}>Date</Text>
                <Text style={[styles.tableHeaderText, styles.col2]}>Hours</Text>
                <Text style={[styles.tableHeaderText, styles.col2]}>Rate</Text>
                <Text style={[styles.tableHeaderText, styles.col3]}>Gross Pay</Text>
              </View>
              {validShifts.map((shift, index) => (
                <View key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                  <Text style={[styles.tableCell, styles.col1]}>
                  {shift.date ? `${formatDate(shift.date)} - ${shift.location}` : `Shift ${index + 1}`}
                  </Text>
                  <Text style={[styles.tableCell, styles.col2]}>{shift.hours || '0'}</Text>
                  <Text style={[styles.tableCell, styles.col2]}>{formatCurrency(shift.rate)}</Text>
                  <Text style={[styles.tableCellAmount, styles.col3]}>{formatCurrency(shift.pay)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This report is computer generated and provides a summary of work period activities.
          </Text>
          <Text style={styles.footerText}>
            For detailed shift information or queries, please contact the HR Department.
          </Text>
        </View>
        </Page>
    </Document>
  );
};

export default ReportSummaryPDF;