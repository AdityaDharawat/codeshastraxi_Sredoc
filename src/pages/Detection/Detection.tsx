import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiActivity, FiRefreshCw, FiDownload } from 'react-icons/fi';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

interface AnalysisFeature {
  name: string;
  value: number;
}

interface AnalysisResults {
  hasAnomalies: boolean;
  confidence: number;
  features: AnalysisFeature[];
  summaryStats?: {
    totalRecords: number;
    anomaliesFound: number;
    dataQualityScore: number;
  };
  anomalies?: {
    description: string;
    severity: 'low' | 'medium' | 'high';
    recommendedAction: string;
  }[];
  comparison?: {
    previousValue: string;
    currentValue: string;
    variance: string;
  }[];
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
        alert('Please upload an Excel file only.');
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
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Simulate analysis
        setTimeout(() => {
          const hasAnomalies = Math.random() > 0.5;
          const confidence = Math.floor(Math.random() * 20) + 80;
          
          const analysisResults: AnalysisResults = {
            hasAnomalies,
            confidence,
            features: [
              { name: "Data Consistency", value: Math.floor(Math.random() * 20) + 80 },
              { name: "Amount Validation", value: Math.floor(Math.random() * 20) + 80 },
              { name: "Time Pattern Analysis", value: Math.floor(Math.random() * 20) + 80 },
            ],
            summaryStats: {
              totalRecords: jsonData.length,
              anomaliesFound: hasAnomalies ? Math.floor(Math.random() * 5) + 1 : 0,
              dataQualityScore: Math.floor(Math.random() * 20) + 80,
            },
            anomalies: hasAnomalies ? [
              {
                description: "Inconsistent date formats detected",
                severity: 'medium',
                recommendedAction: "Standardize date formats across all records"
              },
              {
                description: "Outlier values in sales amount",
                severity: 'high',
                recommendedAction: "Verify transactions above $10,000"
              }
            ] : undefined,
            comparison: [
              {
                previousValue: "1,245 records",
                currentValue: `${jsonData.length} records`,
                variance: `${Math.round((jsonData.length - 1245)/1245 * 100)}%`
              },
              {
                previousValue: "$245,678",
                currentValue: `$${Math.round(jsonData.reduce((sum: number, row: any) => sum + (row.amount || 0), 0)}`,
                variance: `${Math.round(Math.random() * 20 - 10)}%`
              },
              {
                previousValue: "87% quality score",
                currentValue: `${Math.floor(Math.random() * 20) + 80}% quality score`,
                variance: `${Math.round(Math.random() * 10 - 5)}%`
              }
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
    doc.setFontSize(22);
    doc.setTextColor(40, 53, 147);
    doc.text('Excel Data Analysis Report', 105, 20, { align: 'center' });
    
    // Subtitle
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 28, { align: 'center' });
    
    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 35, 190, 35);
    
    // Summary Section
    doc.setFontSize(16);
    doc.setTextColor(40, 53, 147);
    doc.text('Summary', 20, 45);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    // Summary Stats
    if (results.summaryStats) {
      doc.text(`Total Records Analyzed: ${results.summaryStats.totalRecords}`, 20, 55);
      doc.text(`Anomalies Found: ${results.summaryStats.anomaliesFound}`, 20, 65);
      doc.text(`Data Quality Score: ${results.summaryStats.dataQualityScore}%`, 20, 75);
    }
    
    // Result
    doc.setFontSize(14);
    doc.setTextColor(results.hasAnomalies ? 211, 47, 47 : 56, 142, 60);
    doc.text(
      results.hasAnomalies ? 'Potential Anomalies Detected' : 'No Significant Issues Found', 
      20, 
      90
    );
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Confidence Level: ${results.confidence}%`, 20, 100);
    
    // Features
    doc.setFontSize(16);
    doc.setTextColor(40, 53, 147);
    doc.text('Analysis Metrics', 20, 115);
    
    doc.setFontSize(12);
    let yPos = 125;
    results.features.forEach(feature => {
      doc.setTextColor(0, 0, 0);
      doc.text(`${feature.name}:`, 20, yPos);
      doc.text(`${feature.value}%`, 180, yPos, { align: 'right' });
      
      // Progress bar
      doc.setFillColor(200, 200, 200);
      doc.rect(50, yPos - 3, 120, 5, 'F');
      doc.setFillColor(
        feature.value > 85 ? 56 : feature.value > 70 ? 255 : 211,
        feature.value > 85 ? 142 : feature.value > 70 ? 193 : 47,
        feature.value > 85 ? 60 : feature.value > 70 ? 7 : 47
      );
      doc.rect(50, yPos - 3, feature.value * 1.2, 5, 'F');
      
      yPos += 10;
    });
    
    // Add new page for detailed findings
    doc.addPage();
    
    // Comparison Section
    doc.setFontSize(16);
    doc.setTextColor(40, 53, 147);
    doc.text('Data Comparison', 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    if (results.comparison) {
      // Table header
      doc.setFillColor(225, 229, 242);
      doc.rect(20, 30, 170, 10, 'F');
      doc.setTextColor(40, 53, 147);
      doc.text('Metric', 25, 37);
      doc.text('Previous', 80, 37);
      doc.text('Current', 120, 37);
      doc.text('Variance', 160, 37, { align: 'right' });
      
      // Table rows
      doc.setTextColor(0, 0, 0);
      let tableY = 40;
      results.comparison.forEach((item, index) => {
        doc.text(item.previousValue, 80, tableY + (index * 10) + 10);
        doc.text(item.currentValue, 120, tableY + (index * 10) + 10);
        
        // Color variance based on value
        const varianceNum = parseFloat(item.variance);
        doc.setTextColor(
          varianceNum > 0 ? 56 : varianceNum < 0 ? 211 : 0,
          varianceNum > 0 ? 142 : varianceNum < 0 ? 47 : 0,
          varianceNum > 0 ? 60 : varianceNum < 0 ? 47 : 0
        );
        doc.text(
          varianceNum > 0 ? `+${item.variance}` : item.variance, 
          160, 
          tableY + (index * 10) + 10, 
          { align: 'right' }
        );
        
        doc.setTextColor(0, 0, 0);
        doc.text(
          index === 0 ? 'Total Records' : 
          index === 1 ? 'Total Amount' : 
          'Data Quality', 
          25, 
          tableY + (index * 10) + 10
        );
      });
    }
    
    // Anomalies Section
    if (results.hasAnomalies && results.anomalies) {
      doc.addPage();
      doc.setFontSize(16);
      doc.setTextColor(40, 53, 147);
      doc.text('Anomaly Details', 20, 20);
      
      doc.setFontSize(12);
      let anomalyY = 30;
      results.anomalies.forEach((anomaly, index) => {
        // Severity indicator
        doc.setFillColor(
          anomaly.severity === 'high' ? 211 : anomaly.severity === 'medium' ? 255 : 255,
          anomaly.severity === 'high' ? 47 : anomaly.severity === 'medium' ? 193 : 236,
          anomaly.severity === 'high' ? 47 : anomaly.severity === 'medium' ? 7 : 64
        );
        doc.roundedRect(20, anomalyY, 170, 30, 3, 3, 'F');
        
        // Anomaly text
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${anomaly.description}`, 25, anomalyY + 8);
        doc.setFont('helvetica', 'normal');
        doc.text(`Severity: ${anomaly.severity}`, 25, anomalyY + 16);
        doc.text(`Action: ${anomaly.recommendedAction}`, 25, anomalyY + 24);
        
        anomalyY += 35;
      });
    }
    
    // Save the PDF
    doc.save(`data_analysis_report_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-800 flex items-center justify-center px-4 py-12">
      <div className="container mx-auto max-w-4xl bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Excel Data Analysis
        </motion.h1>

        <AnimatePresence mode="wait">
          {!file && !results && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-50 rounded-xl shadow-sm p-8 md:p-12 text-center border border-gray-200"
            >
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-12 cursor-pointer hover:border-blue-500 transition-all duration-300"
                onClick={() => fileInputRef.current?.click()}
              >
                <FiUpload className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Upload Excel File</h3>
                <p className="text-gray-500 mb-4">Please upload an Excel file (.xlsx) for analysis</p>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all shadow-md">
                  Select File
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".xlsx"
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
              className="bg-gray-50 rounded-xl shadow-sm p-8 md:p-12 text-center border border-gray-200"
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
                <h3 className="text-2xl font-semibold mb-2">Analyzing Excel Data</h3>
                <p className="text-gray-500">Processing the uploaded file for insights...</p>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2.5">
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
              className="bg-gray-50 rounded-xl shadow-sm p-8 md:p-12 border border-gray-200"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                  <h3 className="text-2xl font-semibold">Analysis Results</h3>
                  <p className="text-gray-500">Detailed insights from the uploaded Excel file</p>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={generatePDFReport}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all shadow-md"
                  >
                    <FiDownload className="mr-2" /> Download Report
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetAnalysis}
                    className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors text-gray-800"
                  >
                    <FiRefreshCw className="mr-2" /> Analyze Another
                  </motion.button>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`p-6 rounded-xl mb-8 ${results.hasAnomalies ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} border`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold">
                      {results.hasAnomalies ? 'Potential Anomalies Detected' : 'Clean Data'}
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
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-sm text-gray-500">Total Records</p>
                    <p className="text-2xl font-bold">{results.summaryStats.totalRecords}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-sm text-gray-500">Anomalies Found</p>
                    <p className="text-2xl font-bold">{results.summaryStats.anomaliesFound}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-sm text-gray-500">Data Quality Score</p>
                    <p className="text-2xl font-bold">{results.summaryStats.dataQualityScore}%</p>
                  </div>
                </div>
              )}

              <div className="space-y-4 mb-8">
                <h4 className="text-lg font-semibold">Analysis Metrics</h4>
                {results.features.map((feature, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{feature.name}</span>
                      <span className="text-sm font-semibold">{feature.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${feature.value > 85 ? 'bg-green-500' : feature.value > 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${feature.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {results.comparison && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold mb-4">Data Comparison</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Previous</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {results.comparison.map((item, index) => {
                          const varianceNum = parseFloat(item.variance);
                          return (
                            <tr key={index}>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">
                                {index === 0 ? 'Total Records' : index === 1 ? 'Total Amount' : 'Data Quality'}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{item.previousValue}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{item.currentValue}</td>
                              <td className={`px-4 py-2 whitespace-nowrap text-sm font-medium ${
                                varianceNum > 0 ? 'text-green-600' : varianceNum < 0 ? 'text-red-600' : 'text-gray-600'
                              }`}>
                                {varianceNum > 0 ? `+${item.variance}` : item.variance}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {results.hasAnomalies && results.anomalies && (
                <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                  <h4 className="text-lg font-semibold mb-4 text-red-800">Anomaly Details</h4>
                  <div className="space-y-4">
                    {results.anomalies.map((anomaly, index) => (
                      <div 
                        key={index} 
                        className={`p-4 rounded-lg border ${
                          anomaly.severity === 'high' ? 'bg-red-100 border-red-300' :
                          anomaly.severity === 'medium' ? 'bg-yellow-100 border-yellow-300' :
                          'bg-blue-100 border-blue-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{index + 1}. {anomaly.description}</p>
                            <p className="text-sm text-gray-600 mt-1">Severity: {anomaly.severity}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            anomaly.severity === 'high' ? 'bg-red-500 text-white' :
                            anomaly.severity === 'medium' ? 'bg-yellow-500 text-white' :
                            'bg-blue-500 text-white'
                          }`}>
                            {anomaly.severity}
                          </span>
                        </div>
                        <p className="text-sm mt-2">
                          <span className="font-medium">Recommended Action:</span> {anomaly.recommendedAction}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Detection;