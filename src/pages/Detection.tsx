import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiActivity, FiRefreshCw, FiDownload } from 'react-icons/fi';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';


interface AnalysisFeature {
  name: string;
  value: number;
  previousValue?: number;
}

interface AnalysisResults {
  hasAnomalies: boolean;
  confidence: number;
  features: AnalysisFeature[];
  fileName: string;
  dateAnalyzed: string;
  summary: string;
  recommendations: string[];
}

const Detection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          selectedFile.name.endsWith('.xlsx')) {
        setFile(selectedFile);
        analyzeFile(selectedFile);
      } else {
        alert('Please upload an Excel file (.xlsx) only.');
      }
    }
  };

  const analyzeFile = async (file: File) => {
    setIsAnalyzing(true);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
XLSX.utils.sheet_to_json(worksheet); // Process worksheet

        // Simulate analysis
        setTimeout(() => {
          const analysisResults: AnalysisResults = {
            hasAnomalies: Math.random() > 0.5,
            confidence: Math.floor(Math.random() * 20) + 80,
            fileName: file.name,
            dateAnalyzed: new Date().toLocaleDateString(),
            features: [
              { 
                name: "Data Consistency", 
                value: Math.floor(Math.random() * 20) + 80,
                previousValue: Math.floor(Math.random() * 20) + 60
              },
              { 
                name: "Amount Validation", 
                value: Math.floor(Math.random() * 20) + 80,
                previousValue: Math.floor(Math.random() * 20) + 60
              },
              { 
                name: "Time Pattern Analysis", 
                value: Math.floor(Math.random() * 20) + 80,
                previousValue: Math.floor(Math.random() * 20) + 60
              },
            ],
            summary: "The analysis has identified several potential anomalies in the uploaded sales data. These include unusual transaction patterns, inconsistent pricing structures, and possible duplicate entries that require further investigation.",
            recommendations: [
              "Review transactions flagged with low confidence scores",
              "Verify pricing consistency across similar products",
              "Check for duplicate entries in the sales records",
              "Investigate unusual time patterns in transactions"
            ]
          };
          setResults(analysisResults);
          setIsAnalyzing(false);
        }, 2000);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error analyzing file:', error);
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setFile(null);
    setResults(null);
  };

  const generatePDFReport = () => {
    if (!results) return;

    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(40, 53, 147);
    doc.text('Sales Data Analysis Report', 105, 20, { align: 'center' });
    
    // Logo
    doc.addImage('/logo.png', 'PNG', 85, 30, 40, 40);
    
    // Report details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`File Name: ${results.fileName}`, 15, 80);
    doc.text(`Date Analyzed: ${results.dateAnalyzed}`, 15, 90);
    doc.text(`Analysis Confidence: ${results.confidence}%`, 15, 100);
    
    // Summary box
    doc.setFillColor(237, 242, 255);
    doc.rect(15, 110, 180, 30, 'F');
    doc.setTextColor(40, 53, 147);
    doc.setFontSize(14);
    doc.text('Summary', 20, 120);
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(results.summary, 20, 130, { maxWidth: 170 });
    
    // Features table
    doc.setFontSize(14);
    doc.setTextColor(40, 53, 147);
    doc.text('Key Metrics Analysis', 15, 160);
    
    const tableData = results.features.map(feature => [
      feature.name,
      `${feature.value}%`,
      feature.previousValue ? `${feature.previousValue}%` : 'N/A',
      feature.previousValue ? 
        `${feature.value - feature.previousValue > 0 ? '+' : ''}${feature.value - feature.previousValue}%` : 
        'N/A'
    ]);
    
    (doc as any).autoTable({
      startY: 165,
      head: [['Metric', 'Current', 'Previous', 'Difference']],
      body: tableData,
      headStyles: {
        fillColor: [40, 53, 147],
        textColor: 255
      },
      alternateRowStyles: {
        fillColor: [237, 242, 255]
      },
      margin: { top: 165 }
    });
    
    // Recommendations
    doc.setFontSize(14);
    doc.setTextColor(40, 53, 147);
    doc.text('Recommendations', 15, (doc as any).autoTable.previous.finalY + 15);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    let yPos = (doc as any).autoTable.previous.finalY + 25;
    
    results.recommendations.forEach((rec, i) => {
      doc.text(`${i + 1}. ${rec}`, 20, yPos, { maxWidth: 170 });
      yPos += 7;
    });
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Generated by Sales Audit System', 105, 285, { align: 'center' });
    
    doc.save(`Sales_Analysis_Report_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800 flex items-center justify-center px-4 py-12">
      <div className="container mx-auto max-w-4xl bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl md:text-4xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Sales Data Analysis
        </motion.h1>

        <AnimatePresence mode="wait">
          {!file && !results && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-50 rounded-xl shadow-inner p-8 md:p-10 text-center border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors duration-300"
            >
              <div
                className="cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiUpload className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload Sales Data</h3>
                <p className="text-gray-500 mb-6">Upload an Excel file (.xlsx) to analyze for anomalies and patterns</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
                >
                  Select Excel File
                </motion.button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".xlsx"
                  className="hidden"
                />
                <p className="text-xs text-gray-400 mt-4">Supports .xlsx files only</p>
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
              className="bg-gray-50 rounded-xl shadow-inner p-8 md:p-10 text-center"
            >
              <div className="mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="relative w-24 h-24 mx-auto mb-6"
                >
                  <div className="absolute inset-0 rounded-full bg-blue-100 opacity-75"></div>
                  <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center shadow-inner">
                    <FiActivity className="w-12 h-12 text-blue-600" />
                  </div>
                </motion.div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-800">Analyzing Sales Data</h3>
                <p className="text-gray-500">Processing the uploaded file for insights and anomalies...</p>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full"
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
              className="bg-gray-50 rounded-xl shadow-inner p-6 md:p-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800">Analysis Results</h3>
                  <p className="text-gray-500">Detailed insights from {results.fileName}</p>
                </div>
                <div className="flex gap-3 mt-4 md:mt-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={generatePDFReport}
                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition-colors shadow-md"
                  >
                    <FiDownload className="mr-2" /> Download Report
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetAnalysis}
                    className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium text-gray-800 transition-colors"
                  >
                    <FiRefreshCw className="mr-2" /> Analyze Another
                  </motion.button>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`p-6 rounded-xl mb-8 border-l-4 ${results.hasAnomalies ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'}`}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <h4 className="text-lg font-semibold text-gray-800">
                      {results.hasAnomalies ? 'Potential Anomalies Detected' : 'No Significant Anomalies Found'}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Analysis confidence: {results.confidence}%
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm ${results.hasAnomalies ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {results.hasAnomalies ? 'Review Recommended' : 'No Action Required'}
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {results.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                  >
                    <h5 className="font-medium text-gray-700 mb-2">{feature.name}</h5>
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-2xl font-bold text-gray-800">{feature.value}%</span>
                        {feature.previousValue && (
                          <span className={`ml-2 text-sm ${feature.value >= feature.previousValue ? 'text-green-600' : 'text-red-600'}`}>
                            {feature.value >= feature.previousValue ? '↑' : '↓'} {Math.abs(feature.value - feature.previousValue)}%
                          </span>
                        )}
                      </div>
                      {feature.previousValue && (
                        <span className="text-xs text-gray-500">Prev: {feature.previousValue}%</span>
                      )}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div 
                        className="h-1.5 rounded-full" 
                        style={{ 
                          width: `${feature.value}%`,
                          backgroundColor: feature.value > 75 ? '#10B981' : feature.value > 50 ? '#F59E0B' : '#EF4444'
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Analysis Summary</h4>
                <p className="text-gray-600 mb-4">{results.summary}</p>
                
                <h4 className="font-semibold text-gray-800 mb-3 mt-6">Recommendations</h4>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  {results.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Detection;