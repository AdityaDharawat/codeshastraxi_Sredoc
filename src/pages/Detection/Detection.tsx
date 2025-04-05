import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';
import { FiUpload, FiDownload, FiRefreshCw, FiMail, FiShare2, FiActivity, FiCheckCircle, FiMoreVertical } from 'react-icons/fi';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

interface AnalysisFeature {
  name: string;
  value: number;
}

interface AnalysisResults {
  hasAnomalies: boolean;
  confidence: number;
  features: AnalysisFeature[];
  suspiciousTransactions?: any[];
  summaryStats?: any;
}

interface FileData {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

const Detection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleMoreOptions = () => {
    setShowMoreOptions(!showMoreOptions);
  };

  // Generate QR code when results are available
  useEffect(() => {
    const generateQRCode = async () => {
      if (results) {
        const id = Math.random().toString(36).substring(2, 10).toUpperCase();
        setVerificationId(id);
        
        try {
          const url = await QRCode.toDataURL(
            `https://sales-audit.example.com/check?id=${id}&result=${results.hasAnomalies ? 'anomalies' : 'clean'}`,
            {
              width: 300,
              margin: 2,
              color: {
                dark: '#000000',
                light: '#FFFFFF'
              }
            }
          );
          setQrCodeDataUrl(url);
        } catch (err) {
          console.error('Error generating QR code:', err);
        }
      }
    };

    generateQRCode();
  }, [results]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setFileData({
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
          lastModified: selectedFile.lastModified
        });
        parseCSV(selectedFile);
      } else {
        alert('Please upload a CSV file only.');
      }
    }
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const workbook = XLSX.read(content, { type: 'binary' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setParsedData(jsonData);
      analyzeFile(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  const analyzeFile = async (data: any[]) => {
    setIsAnalyzing(true);

    try {
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate sample analysis results based on the data
      const anomalyCount = Math.min(Math.floor(Math.random() * 5), data.length);
      const suspiciousTransactions = anomalyCount > 0 
        ? Array(anomalyCount).fill(0).map((_, i) => {
            const randomIndex = Math.floor(Math.random() * data.length);
            return {
              ...data[randomIndex],
              anomalyType: ['Amount Mismatch', 'Duplicate Transaction', 'Unusual Time', 'Suspicious Vendor'][Math.floor(Math.random() * 4)],
              confidence: Math.floor(Math.random() * 30) + 70
            };
          })
        : undefined;

      const dataStats = {
        totalTransactions: data.length,
        totalAmount: data.reduce((sum, row) => sum + (row.amount || 0), 0),
        averageTransaction: data.reduce((sum, row) => sum + (row.amount || 0), 0) / data.length,
        dateRange: data.length > 0 
          ? `${data[0].date} to ${data[data.length - 1].date}`
          : 'N/A'
      };

      const analysisResults: AnalysisResults = {
        hasAnomalies: anomalyCount > 0,
        confidence: anomalyCount > 0 ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 10) + 90,
        features: [
          { name: "Data Consistency", value: Math.floor(Math.random() * 20) + 80 },
          { name: "Amount Validation", value: Math.floor(Math.random() * 20) + 80 },
          { name: "Time Pattern Analysis", value: Math.floor(Math.random() * 20) + 80 },
          { name: "Vendor Verification", value: Math.floor(Math.random() * 20) + 80 }
        ],
        suspiciousTransactions,
        summaryStats: dataStats
      };

      setResults(analysisResults);
    } catch (error) {
      console.error("Error analyzing file:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setFile(null);
    setFileData(null);
    setResults(null);
    setParsedData([]);
    setQrCodeDataUrl('');
    setVerificationId('');
  };

  const generatePDF = () => {
    if (!results || !fileData) return;

    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text('Sales Data Audit Report', 105, 20, { align: 'center' });

    // Add result
    doc.setFontSize(16);
    doc.setTextColor(results.hasAnomalies ? '#ff0000' : '#00aa00');
    doc.text(
      results.hasAnomalies ? 'Potential Anomalies Detected' : 'Clean Sales Data',
      105,
      40,
      { align: 'center' }
    );

    // Add confidence
    doc.setFontSize(14);
    doc.setTextColor('#000000');
    doc.text(`Confidence: ${results.confidence}%`, 105, 50, { align: 'center' });

    // Add file info
    doc.setFontSize(12);
    doc.text(`File Name: ${fileData.name}`, 20, 70);
    doc.text(`File Size: ${(fileData.size / 1024).toFixed(2)} KB`, 20, 80);
    doc.text(`Upload Date: ${new Date(fileData.lastModified).toLocaleString()}`, 20, 90);

    // Add summary stats
    if (results.summaryStats) {
      doc.setFontSize(14);
      doc.text('Summary Statistics', 20, 110);
      doc.setFontSize(12);
      doc.text(`Total Transactions: ${results.summaryStats.totalTransactions}`, 20, 120);
      doc.text(`Total Amount: $${results.summaryStats.totalAmount.toFixed(2)}`, 20, 130);
      doc.text(`Average Transaction: $${results.summaryStats.averageTransaction.toFixed(2)}`, 20, 140);
      doc.text(`Date Range: ${results.summaryStats.dateRange}`, 20, 150);
    }

    // Add features
    doc.setFontSize(14);
    doc.text('Audit Metrics', 20, 170);
    let yPosition = 180;
    results.features.forEach(feature => {
      doc.text(`${feature.name}: ${feature.value}%`, 20, yPosition);
      doc.setFillColor('#007bff');
      doc.rect(80, yPosition - 4, feature.value * 1.2, 5, 'F');
      yPosition += 10;
    });

    // Add suspicious transactions if any
    if (results.hasAnomalies && results.suspiciousTransactions) {
      doc.addPage();
      doc.setFontSize(16);
      doc.text('Suspicious Transactions', 20, 20);
      doc.setFontSize(10);
      
      let yPos = 30;
      results.suspiciousTransactions.forEach((txn, index) => {
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setFontSize(12);
        doc.setTextColor('#ff0000');
        doc.text(`Transaction ${index + 1}: ${txn.anomalyType} (${txn.confidence}% confidence)`, 20, yPos);
        doc.setFontSize(10);
        doc.setTextColor('#000000');
        
        yPos += 10;
        Object.entries(txn).forEach(([key, value]) => {
          if (key !== 'anomalyType' && key !== 'confidence') {
            doc.text(`${key}: ${value}`, 25, yPos);
            yPos += 7;
          }
        });
        yPos += 10;
      });
    }

    // Add verification info
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Verification Information', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Verification ID: ${verificationId}`, 20, 40);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 50);

    // Convert to Blob and use saveAs
    const pdfBlob = doc.output('blob');
    saveAs(pdfBlob, `sales_audit_report_${verificationId}.pdf`);
  };

  const shareViaEmail = () => {
    if (!results || !fileData) return;

    const subject = `Sales Audit Report - ${verificationId}`;
    const body = `Dear Recipient,\n\n` +
      `Please find below the sales data audit results:\n\n` +
      `File Name: ${fileData.name}\n` +
      `Status: ${results.hasAnomalies ? 'Potential Anomalies Detected' : 'Clean Data'}\n` +
      `Confidence Level: ${results.confidence}%\n` +
      `Verification ID: ${verificationId}\n\n` +
      `You can verify this result by scanning the attached QR code or visiting:\n` +
      `https://sales-audit.example.com/check?id=${verificationId}\n\n` +
      `Best regards,\n` +
      `Sales Audit Team`;

    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const shareViaGmail = () => {
    if (!results || !fileData) return;

    const subject = `Sales Audit Report - ${verificationId}`;
    const body = `Dear Recipient,%0A%0A` +
      `Please find below the sales data audit results:%0A%0A` +
      `File Name: ${fileData.name}%0A` +
      `Status: ${results.hasAnomalies ? 'Potential Anomalies Detected' : 'Clean Data'}%0A` +
      `Confidence Level: ${results.confidence}%%0A` +
      `Verification ID: ${verificationId}%0A%0A` +
      `You can verify this result by scanning the attached QR code or visiting:%0A` +
      `https://sales-audit.example.com/check?id=${verificationId}%0A%0A` +
      `Best regards,%0A` +
      `Sales Audit Team`;

    window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${body}`, '_blank');
  };

  const downloadReport = () => {
    generatePDF();
  };

  const toggleQRCode = () => {
    setShowQRCode(!showQRCode);
  };

  return (
    <div className="container mx-auto px-4 pt-28 py-12 relative bg-gray-50">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl md:text-4xl font-bold mb-8 text-gray-800"
      >
        Sales Data Audit
      </motion.h1>

      <AnimatePresence mode="wait">
        {!file && !results && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8 border border-gray-200"
          >
            <div 
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-blue-500 transition-all duration-300"
              onClick={() => fileInputRef.current?.click()}
            >
              <FiUpload className="mx-auto w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Upload Sales Data</h3>
              <p className="text-gray-500 mb-4">Please upload a CSV file containing sales transactions</p>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                Select CSV File
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv"
                className="hidden" 
              />
            </div>
          </motion.div>
        )}

        {isAnalyzing && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8 border border-gray-200 text-center"
          >
            <div className="mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="relative w-24 h-24 mx-auto mb-4"
              >
                <div className="absolute inset-0 rounded-full bg-blue-100 opacity-75"></div>
                <div className="absolute inset-2 rounded-full bg-blue-50 flex items-center justify-center">
                  <FiActivity className="w-12 h-12 text-blue-500" />
                </div>
              </motion.div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-800">Auditing Sales Data</h3>
              <p className="text-gray-500">Analyzing transactions for anomalies and patterns...</p>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <motion.div 
                className="bg-blue-500 h-2.5 rounded-full" 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        )}

        {results && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8 border border-gray-200"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-800">Audit Results</h3>
                <p className="text-gray-500">Detailed analysis of sales data</p>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleQRCode}
                  className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-sm font-medium transition-colors text-white"
                >
                  <FiCheckCircle className="mr-2" /> Verify Report
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetAnalysis}
                  className="flex items-center px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg text-sm font-medium transition-colors text-gray-800"
                >
                  <FiRefreshCw className="mr-2" /> Audit Another
                </motion.button>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`p-6 rounded-xl mb-8 ${results.hasAnomalies ? 'bg-red-100 border-red-500' : 'bg-green-100 border-green-500'} border`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    {results.hasAnomalies ? 'Potential Anomalies Detected' : 'Clean Sales Data'}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Confidence: {results.confidence}%
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${results.hasAnomalies ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                  {results.hasAnomalies ? 'Review Needed' : 'No Issues Found'}
                </div>
              </div>
            </motion.div>

            {results.summaryStats && (
              <div className="mb-8 bg-gray-100 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">Summary Statistics</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500">Total Transactions</p>
                    <p className="text-2xl font-bold text-gray-800">{results.summaryStats.totalTransactions}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-800">${results.summaryStats.totalAmount.toFixed(2)}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500">Average Transaction</p>
                    <p className="text-2xl font-bold text-gray-800">${results.summaryStats.averageTransaction.toFixed(2)}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500">Date Range</p>
                    <p className="text-xl font-bold text-gray-800">{results.summaryStats.dateRange}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {results.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-100 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-500">{feature.name}</span>
                    <span className="text-sm font-semibold text-gray-800">{feature.value}%</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <motion.div 
                      className={`h-2 rounded-full ${feature.value > 85 ? 'bg-green-500' : feature.value > 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${feature.value}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {results.hasAnomalies && results.suspiciousTransactions && (
              <div className="mb-8 bg-red-50 rounded-lg p-6 border border-red-200">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">Suspicious Transactions</h4>
                <div className="space-y-4">
                  {results.suspiciousTransactions.map((txn, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-red-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-red-600">{txn.anomalyType}</p>
                          <p className="text-sm text-gray-500">Confidence: {txn.confidence}%</p>
                        </div>
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          Review
                        </span>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(txn).map(([key, value]) => {
                          if (key !== 'anomalyType' && key !== 'confidence') {
                            return (
                              <div key={key} className="truncate">
                                <span className="text-gray-500">{key}:</span> {value}
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-300 pt-6">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">Recommended Actions</h4>
              <div className="space-y-3">
                <p className="text-gray-500">
                  {results.hasAnomalies ? (
                    <>
                      <span className="font-medium">Warning:</span> This sales data contains potential anomalies that require review. 
                      We recommend investigating the flagged transactions and verifying with original documentation.
                    </>
                  ) : (
                    <>
                      This sales data appears consistent with no significant anomalies detected. 
                      Routine monitoring is recommended to maintain data integrity.
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={downloadReport}
                className="flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all"
              >
                <FiDownload className="mr-2" /> Download PDF Report
              </motion.button>

              <div className="relative group">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center px-6 py-3 bg-gray-300 hover:bg-gray-400 rounded-lg font-medium transition-all text-gray-800"
                >
                  <FiMail className="mr-2" /> Share Report
                </motion.button>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={shareViaEmail}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-t-lg"
                  >
                    Default Email
                  </button>
                  <button 
                    onClick={shareViaGmail}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-b-lg"
                  >
                    Gmail
                  </button>
                </div>
              </div>

              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleMoreOptions}
                  className="flex items-center px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg font-medium transition-all text-gray-800"
                >
                  <FiMoreVertical className="mr-2" /> More Options
                </motion.button>
                <AnimatePresence>
                  {showMoreOptions && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10"
                    >
                      <button
                        onClick={shareViaEmail}
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-t-lg"
                      >
                        Share via Email
                      </button>
                      <button
                        onClick={shareViaGmail}
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-b-lg"
                      >
                        Share via Gmail
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQRCode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative"
            >
              <div className="absolute top-4 right-4">
                <button 
                  onClick={toggleQRCode}
                  className="text-gray-400 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>
              <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">Verify Report</h3>
              <div className="flex flex-col items-center">
                <div className="bg-gray-100 p-4 rounded-lg mb-6 flex justify-center">
                  {qrCodeDataUrl ? (
                    <img 
                      src={qrCodeDataUrl} 
                      alt="Verification QR Code"
                      className="w-64 h-64"
                    />
                  ) : (
                    <div className="w-64 h-64 flex items-center justify-center bg-gray-200">
                      <p className="text-gray-500">Generating QR code...</p>
                    </div>
                  )}
                </div>
                <p className="text-gray-500 text-center mb-6 max-w-md">
                  Scan this QR code with your mobile device to verify this audit report.
                </p>
                <div className="text-xs text-gray-400 text-center">
                  Verification ID: {verificationId}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Detection;