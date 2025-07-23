'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Camera, History, Calculator, TrendingUp, CheckCircle, ExternalLink, AlertCircle, DollarSign, Target } from 'lucide-react';
import { ChangeEvent } from 'react';

const chartRequirements = [
  { id: 1, title: 'Timeframe', description: 'Use H4, D1, or W1 for Scalp trading analysis', completed: true },
  { id: 2, title: 'Indicators', description: 'Include key indicators (MA, RSI, MACD) if used', completed: true },
  { id: 3, title: 'Price History', description: 'Show at least 50-100 candles for context', completed: true },
  { id: 4, title: 'Clear View', description: 'Ensure chart is clearly visible with good contrast', completed: true },
];

const recentUploads = [
  { pair: 'EUR/USD D1', time: 'Today, 10:32 AM', status: 'analyzed' },
  { pair: 'GBP/JPY H4', time: 'Yesterday, 3:15 PM', status: 'analyzed' },
  { pair: 'USD/CAD W1', time: 'Jun 10, 2023', status: 'analyzed' },
];

const analysisGuides = [
  {
    icon: TrendingUp,
    title: 'Market Structure',
    description: 'Identify key support/resistance levels and market structure for potential trade setups.',
  },
  {
    icon: TrendingUp,
    title: 'Trend Analysis',
    description: 'Determine the current trend direction using multiple timeframe analysis.',
  },
  {
    icon: TrendingUp,
    title: 'Entry & Exit Points',
    description: 'Define precise entry triggers, stop loss and take profit levels for optimal risk/reward.',
  },
];

const TIMEFRAMES = ['M1', 'M5', 'M15', "M30", "H1"];


type Timeframe = 'M1' | 'M5' | 'M15' | 'M30' | 'H1';

interface AnalysisResult {
  signal: 'BUY' | 'SELL';
  confidence: number | string;
  timeframe?: Timeframe;
  entry: number;
  stop_loss: number;
  take_profit: number;
  risk_reward_ratio: number | string;
  dynamic_stop_loss?: number;
  dynamic_take_profit?: number;
  technical_analysis?: {
    RSI?: number | string;
    MACD?: number | string;
    Moving_Average?: number | string;
    ICT_Order_Block?: string;
    ICT_Fair_Value_Gap?: string;
    ICT_Breaker_Block?: string;
    ICT_Trendline?: string;
  };
  recommendation?: string;
}

export default function ScalpTrading() {

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);;
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe | ''>('');

  // Calculator state
  const [calculatorData, setCalculatorData] = useState({
    accountBalance: 10000,
    riskPercentage: 2,
    currencyPair: 'EUR/USD',
    entryPrice: 1.0892,
    stopLoss: 1.0850,
    takeProfit: 1.0950,
    tradeType: 'BUY'
  });

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPG, PNG, or GIF)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  const calculatePositionSize = () => {
    const riskAmount = (calculatorData.accountBalance * calculatorData.riskPercentage) / 100;
    const pipValue = 10;
    const stopLossPips = Math.abs(calculatorData.entryPrice - calculatorData.stopLoss) * 10000;
    const positionSize = riskAmount / (stopLossPips * pipValue);

    const takeProfitPips = Math.abs(calculatorData.takeProfit - calculatorData.entryPrice) * 10000;
    const riskReward = takeProfitPips / stopLossPips;
    const potentialProfit = riskAmount * riskReward;

    return {
      positionSize: positionSize.toFixed(2),
      riskAmount: riskAmount.toFixed(2),
      riskReward: riskReward.toFixed(2),
      potentialProfit: potentialProfit.toFixed(2),
      stopLossPips: stopLossPips.toFixed(0),
      takeProfitPips: takeProfitPips.toFixed(0)
    };
  };


  const handleAnalyze = async (
    timeframe: Timeframe,
    file: File | null
  ): Promise<void> => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResults(null);
    setSelectedTimeframe(timeframe);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `https://backend.axiontrust.com/scalp/chart/?timeframe=${timeframe}`,
        { method: 'POST', body: formData }
      );

      if (!response.ok) {
        // Grab plain-text error so the user sees
        // the actual message returned by your API.
        throw new Error(await response.text() || 'API request failed');
      }

      const data = await response.json();

      if (data?.error) {
        setServerError(data.error as string);   // ensure .error is a string
      } else {
        setServerError(null);
        setAnalysisResults(data);               // <- give this a proper type later
      }
    } catch (err: unknown) {
      // All caught errors are `unknown` now:
      const message = err instanceof Error ? err.message : String(err);
      setError(`Failed to analyze chart. ${message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculationResults = calculatePositionSize();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-[2rem] lg:gap-0 lg:flex-row items-center lg:justify-between">
        <div className="w-full lg:w-auto flex flex-col flex-start">
          <h1 className="text-3xl font-bold text-white">Scalp Trading</h1>
          <p className="text-slate-400">M1, M5, M15, M30, H1 Timeframes</p>
        </div>
        <div className="w-full flex-wrap lg:w-auto flex flex-start gap-3">
          <Button variant="outline" className="border-slate-600 text-slate-300">
            <History className="h-4 w-4 mr-2" />
            History
          </Button>
          <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-slate-600 text-slate-300">
                <Calculator className="h-4 w-4 mr-2" />
                Calculator
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">Pre-Trade Calculator</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300">Account Balance ($)</Label>
                    <Input
                      type="number"
                      value={calculatorData.accountBalance}
                      onChange={(e) => setCalculatorData({ ...calculatorData, accountBalance: parseFloat(e.target.value) })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Risk Percentage (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={calculatorData.riskPercentage}
                      onChange={(e) => setCalculatorData({ ...calculatorData, riskPercentage: parseFloat(e.target.value) })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300">Currency Pair</Label>
                    <Select value={calculatorData.currencyPair} onValueChange={(value) => setCalculatorData({ ...calculatorData, currencyPair: value })}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="EUR/USD">EUR/USD</SelectItem>
                        <SelectItem value="GBP/USD">GBP/USD</SelectItem>
                        <SelectItem value="USD/JPY">USD/JPY</SelectItem>
                        <SelectItem value="AUD/USD">AUD/USD</SelectItem>
                        <SelectItem value="USD/CAD">USD/CAD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-300">Trade Type</Label>
                    <Select value={calculatorData.tradeType} onValueChange={(value) => setCalculatorData({ ...calculatorData, tradeType: value })}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="BUY">BUY</SelectItem>
                        <SelectItem value="SELL">SELL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-slate-300">Entry Price</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={calculatorData.entryPrice}
                      onChange={(e) => setCalculatorData({ ...calculatorData, entryPrice: parseFloat(e.target.value) })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Stop Loss</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={calculatorData.stopLoss}
                      onChange={(e) => setCalculatorData({ ...calculatorData, stopLoss: parseFloat(e.target.value) })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Take Profit</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={calculatorData.takeProfit}
                      onChange={(e) => setCalculatorData({ ...calculatorData, takeProfit: parseFloat(e.target.value) })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-700">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Position Size:</span>
                      <span className="text-white font-medium">{calculationResults.positionSize} lots</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Risk Amount:</span>
                      <span className="text-red-400 font-medium">${calculationResults.riskAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Stop Loss Pips:</span>
                      <span className="text-white font-medium">{calculationResults.stopLossPips}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Risk/Reward:</span>
                      <span className="text-white font-medium">1:{calculationResults.riskReward}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Potential Profit:</span>
                      <span className="text-green-400 font-medium">${calculationResults.potentialProfit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Take Profit Pips:</span>
                      <span className="text-white font-medium">{calculationResults.takeProfitPips}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Save Trade Setup
                  </Button>
                  <Button variant="outline" className="border-slate-600 text-slate-300" onClick={() => setShowCalculator(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <TrendingUp className="h-4 w-4 mr-2" />
            New Trade
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700 flex flex-wrap lg:inline-block">
          <TabsTrigger value="upload">Chart Upload</TabsTrigger>
          <TabsTrigger value="guide">Analysis Guide</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Upload Area */}
            <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Upload Chart for Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                {(error || serverError) && (
                  <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-800 flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <span className="text-red-400 text-sm">{error || serverError}</span>
                  </div>
                )}

                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-600 hover:border-slate-500'
                    }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">
                    {selectedFile ? selectedFile.name : 'Drag & Drop Your Chart Here'}
                  </h3>
                  <p className="text-slate-400 mb-4">
                    Upload your trading chart in JPG, PNG or GIF format. For best results, ensure all indicators are clearly visible.
                  </p>
                  <div className="flex justify-center space-x-3">
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => document.getElementById('file-input')?.click()}  >
                      <Upload className="h-4 w-4 mr-2" />
                      Browse Files
                    </Button>
                    {/* <Button variant="outline" className="border-slate-600 text-slate-300">
                      <Camera className="h-4 w-4 mr-2" />
                      Take Screenshot
                    </Button> */}
                  </div>
                  <p className="text-xs text-slate-500 mt-3">
                    Supported formats: PNG, JPG, GIF (Max 5MB)
                  </p>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* Timeframe Dropdown & Execute Button */}
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 justify-center">
                  <Label className="text-white font-semibold">Select Timeframe:</Label>
                  <select
                    className="p-2 rounded bg-slate-800 text-white border border-slate-600 min-w-[120px]"
                    value={selectedTimeframe || ''}
                    onChange={e =>
                      setSelectedTimeframe(e.target.value as Timeframe | '')
                    }
                  >
                    <option value="">Choose timeframe</option>
                    {
                      TIMEFRAMES.map((item, i) => <option value={item} key={i}>{item}</option>)
                    }
                  </select>
                  <Button
                    className="px-6 py-2 rounded bg-blue-600 text-white font-bold transition disabled:opacity-50 hover:bg-blue-700"
                    disabled={!selectedFile || !selectedTimeframe || isAnalyzing || !!error}
                    onClick={() => handleAnalyze(selectedTimeframe as Timeframe, selectedFile)}
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Execute'}
                  </Button>
                </div>
                {(!selectedFile || !selectedTimeframe) && (
                  <div className="text-yellow-400 text-sm mt-2">
                    Please upload a chart image and select a timeframe to enable analysis.
                  </div>
                )}

                {isAnalyzing && (
                  <div className="mt-4 p-4 rounded-lg bg-blue-900/30 border border-blue-800">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                      <span className="text-blue-400">Analyzing your chart...</span>
                    </div>
                  </div>
                )}

                {/* Results */}
                {analysisResults && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-medium text-white">Analysis Results</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Signal & Confidence */}
                      <Card className="bg-slate-700/50 border-slate-600">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-400">Signal</span>
                            <Badge className={analysisResults.signal === 'BUY' ? 'bg-green-600' : 'bg-red-600'}>
                              {analysisResults.signal}
                            </Badge>
                          </div>
                          <div className="text-2xl font-bold text-white">
                            {analysisResults.confidence}
                            {String(analysisResults.confidence).includes('%') ? '' : '%'}
                          </div>
                          <div className="text-sm text-slate-400">Confidence</div>
                          <div className="mt-2">
                            <span className="text-blue-400 font-semibold">Timeframe:</span>
                            <span className="ml-2 px-3 py-1 rounded bg-blue-900 text-blue-200 font-bold">
                              {analysisResults.timeframe || selectedTimeframe}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                      {/* Entry, SL, TP, RR, Dynamic SL/TP */}
                      <Card className="bg-slate-700/50 border-slate-600">
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Entry:</span>
                              <span className="text-white">{analysisResults.entry}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Stop Loss:</span>
                              <span className="text-red-400">{analysisResults.stop_loss}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Take Profit:</span>
                              <span className="text-green-400">{analysisResults.take_profit}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Risk/Reward:</span>
                              <span className="text-white">{analysisResults.risk_reward_ratio}</span>
                            </div>
                            {analysisResults.dynamic_stop_loss && (
                              <div className="flex justify-between">
                                <span className="text-slate-400">Dynamic Stop Loss:</span>
                                <span className="text-red-300">{analysisResults.dynamic_stop_loss}</span>
                              </div>
                            )}
                            {analysisResults.dynamic_take_profit && (
                              <div className="flex justify-between">
                                <span className="text-slate-400">Dynamic Take Profit:</span>
                                <span className="text-green-300">{analysisResults.dynamic_take_profit}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    {/* Technical Analysis */}
                    <Card className="bg-slate-700/50 border-slate-600">
                      <CardContent className="p-4">
                        <h4 className="font-medium text-white mb-2">Technical Analysis</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">RSI:</span>
                            <span className="text-white">{analysisResults.technical_analysis?.RSI}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">MACD:</span>
                            <span className="text-white">{analysisResults.technical_analysis?.MACD}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Moving Average:</span>
                            <span className="text-white">{analysisResults.technical_analysis?.Moving_Average}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">ICT Order Block:</span>
                            <span className="text-white">{analysisResults.technical_analysis?.ICT_Order_Block}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">ICT Fair Value Gap:</span>
                            <span className="text-white">{analysisResults.technical_analysis?.ICT_Fair_Value_Gap}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">ICT Breaker Block:</span>
                            <span className="text-white">{analysisResults.technical_analysis?.ICT_Breaker_Block}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">ICT Trendline:</span>
                            <span className="text-white">{analysisResults.technical_analysis?.ICT_Trendline}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    {/* Recommendation */}
                    <Card className="bg-slate-700/50 border-slate-600">
                      <CardContent className="p-4">
                        <h4 className="font-medium text-white mb-2">Recommendation</h4>
                        <p className="text-slate-300 text-sm">{analysisResults.recommendation}</p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chart Requirements & Recent Uploads */}
            <div className="space-y-6">
              {/* Chart Requirements */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Chart Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {chartRequirements.map((req) => (
                    <div key={req.id} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-white text-sm">{req.title}</div>
                        <div className="text-xs text-slate-400">{req.description}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Uploads */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Uploads</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentUploads.map((upload, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded bg-slate-700/30">
                      <div>
                        <div className="font-medium text-white text-sm">{upload.pair}</div>
                        <div className="text-xs text-slate-400">{upload.time}</div>
                      </div>
                      <Button size="sm" variant="ghost" className="text-blue-400 hover:bg-slate-700">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="guide" className="space-y-6">
          {/* Analysis Guide */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Scalp Trading Analysis Guide</CardTitle>
                <p className="text-slate-400 text-sm">Learn the key components of effective Scalp trading analysis</p>
              </div>
              <Button variant="outline" size="sm" className="border-slate-600 text-blue-400">
                View Full Guide
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {analysisGuides.map((guide, index) => (
                  <div key={index} className="p-4 rounded-lg bg-slate-700/30 border border-slate-600">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 rounded-lg bg-blue-600/20">
                        <guide.icon className="h-5 w-5 text-blue-400" />
                      </div>
                      <h3 className="font-medium text-white">{guide.title}</h3>
                    </div>
                    <p className="text-sm text-slate-300">{guide.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Analysis History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <History className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400">Your analysis history will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}