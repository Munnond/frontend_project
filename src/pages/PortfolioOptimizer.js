'use client'

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Grid,
  Button,
  Slider,
  Divider,
  Chip,
  CircularProgress,
  TextField,
  Card,
  CardContent,
  CardHeader,
  Container,
  useTheme,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
  InputAdornment,
  Backdrop,
  Paper,
  LinearProgress
} from '@mui/material'
import {
  ShowChart as ShowChartIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  MonetizationOn as MonetizationOnIcon
} from '@mui/icons-material'
import SearchIcon from '@mui/icons-material/Search'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function PortfolioOptimizer() {
  const theme = useTheme()
  const navigate = useNavigate()
  const [selectedStocks, setSelectedStocks] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const chartRef = useRef(null)
  
  // Add state for form inputs
  const [investmentAmount, setInvestmentAmount] = useState('')
  const [forecastTime, setForecastTime] = useState('')
  const [forebackTime, setForebackTime] = useState('')
  
  // Check if all fields are filled
  const isFormValid = investmentAmount && forecastTime && forebackTime

  const optimizePortfolio = (horizon, initialEquity, stocks) => {
    const allocation = {}
    let remaining = 100
    stocks.forEach((s, i) => {
      if (i === stocks.length - 1) {
        allocation[s] = remaining
      } else {
        const rand = Math.floor(Math.random() * (remaining - (stocks.length - i - 1))) + 1
        allocation[s] = rand
        remaining -= rand
      }
    })
    const predictedReturn = Math.random() * 0.15 + 0.05
    const predictedVol = Math.random() * 0.1 + 0.05
    const expectedEquity = initialEquity * (1 + predictedReturn)
    return {
      initial_equity: initialEquity,
      expected_equity: Math.round(expectedEquity * 100) / 100,
      predicted_return: predictedReturn,
      predicted_volatility: predictedVol,
      allocation
    }
  }

  const createChart = (data) => {
    const ctx = document.getElementById('allocationChart')
    if (!ctx) return
    const chartData = {
      labels: Object.keys(data.allocation),
      datasets: [{
        data: Object.values(data.allocation), 
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.success.main,
          theme.palette.warning.main,
          theme.palette.error.main
        ],
        borderWidth: 0
      }]
    }
    const options = { responsive: true, maintainAspectRatio: false }
    if (chartRef.current) chartRef.current.destroy()
    chartRef.current = new window.Chart(ctx, { type: 'doughnut', data: chartData, options })
  }

  const handleAddStock = (symbol) => {
    if (symbol && !selectedStocks.includes(symbol)) {
      setSelectedStocks(prev => [...prev, symbol])
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setLoadingMessage('Initializing portfolio optimization...')
    
    // Simulate different stages of processing with messages
    setTimeout(() => {
      setLoadingMessage('Analyzing historical data...')
      
      setTimeout(() => {
        setLoadingMessage('Calculating optimal allocations...')
        
        setTimeout(() => {
          setLoadingMessage('Finalizing portfolio recommendations...')
          
          setTimeout(() => {
            setLoadingMessage('Redirecting to dashboard...')
            // Redirect to dashboard once "data" is ready
            navigate('/dashboard')
          }, 1500)
        }, 1500)
      }, 1500)
    }, 1500)
  }

  useEffect(() => () => chartRef.current && chartRef.current.destroy(), [])

  return (
    <Box sx={{ flexGrow: 1, py: 4 }}>
      {/* Full-screen loading overlay */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: 'column'
        }}
        open={loading}
      >
        <CircularProgress color="primary" size={60} />
        <Paper 
          elevation={3}
          sx={{ 
            mt: 4, 
            p: 3, 
            maxWidth: 400, 
            textAlign: 'center',
            backgroundColor: 'rgba(45, 45, 45, 0.9)'
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Portfolio Optimization in Progress
          </Typography>
          <Typography variant="body1">
            {loadingMessage}
          </Typography>
          <CustomProgressBar sx={{ mt: 3 }} />
        </Paper>
      </Backdrop>

      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {/* Portfolio Optimizer Section */}
          <Grid item xs={12} md={5}>
            <Card sx={{ p: 3, boxShadow: theme.shadows[4] }}>
              <Typography variant="h6" gutterBottom>Portfolio Optimizer</Typography>

              {/* Input Fields for Investment Amount, Forecast Time, and Foreback Time */}
              <TextField
                fullWidth
                variant="outlined"
                label="Investment Amount (in $)"
                type="number"
                placeholder="Enter investment amount"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                InputProps={{
                  inputProps: { min: 0 }, // Optional: Prevent negative values
                }}
                sx={{ mb: 3 }}
                required
              />
              <TextField
                fullWidth
                variant="outlined"
                label="Forecast Time (in months)"
                type="number"
                placeholder="Enter forecast time"
                value={forecastTime}
                onChange={(e) => setForecastTime(e.target.value)}
                InputProps={{
                  inputProps: { min: 0 }, // Optional: Prevent negative values
                }}
                sx={{ mb: 3 }}
                required
              />
              <TextField
                fullWidth
                variant="outlined"
                label="Foreback Time (in months)"
                type="number"
                placeholder="Enter foreback time"
                value={forebackTime}
                onChange={(e) => setForebackTime(e.target.value)}
                InputProps={{
                  inputProps: { min: 0 }, // Optional: Prevent negative values
                }}
                sx={{ mb: 3 }}
                required
              />

              <Button 
                variant="contained" 
                fullWidth
                sx={{ mt: 3 }} 
                onClick={handleSubmit} 
                disabled={loading || !isFormValid}
                startIcon={loading ? <CircularProgress size={20}/> : <TrendingUpIcon/>}
              >
                {loading ? 'Optimizing...' : 'Generate Portfolio'}
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

// Custom progress bar component with animation
const CustomProgressBar = ({ sx }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = Math.min(oldProgress + Math.random() * 10, 95);
        return newProgress;
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <Box 
        sx={{ 
          height: 10, 
          width: '100%',
          borderRadius: 5,
          backgroundColor: 'rgba(0, 0, 0, 0.1)', 
          position: 'relative'
        }}
      >
        <Box
          sx={{
            height: '100%',
            borderRadius: 5,
            position: 'absolute',
            transition: 'width 0.5s ease',
            width: `${progress}%`,
            backgroundColor: '#4caf50'
          }}
        />
      </Box>
    </Box>
  );
};