// alpha_vantage_api_call.js
// Alpha Vantage API 호출 모듈

const ALPHA_VANTAGE_KEY = 'MJ4U1ESXZ8DURRL3';
const BASE_URL = 'https://www.alphavantage.co/quer;

// 주가 데이터 조회 (일봉)
async function getDailyData(ticker, outputSize = 'compact') {
  try {
    const url = `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${ticker}&outputsize=${outputSize}&apikey=${ALPHA_VANTAGE_KEY}`;
    console.log('일봉 API 호출:', url);
    const response = await fetch(url);
    const data = await response.json();
    
    if (data['Time Series (Daily)']) {
      return {
        success: true,
        ticker: ticker,
        interval: 'daily',
        data: data['Time Series (Daily)'],
        meta: data['Meta Data']
      };
    } else {
      return {
        success: false,
        error: data['Error Message'] || data['Note'] || '데이터 없음',
        ticker: ticker
      };
    }
  } catch (error) {
    return { success: false, error: error.message, ticker: ticker };
  }
}

// 주가 데이터 조회 (분봉)
async function getIntradayData(ticker, interval = '5min', outputSize = 'compact') {
  try {
    const url = `${BASE_URL}?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=${interval}&outputsize=${outputSize}&apikey=${ALPHA_VANTAGE_KEY}`;
    console.log('분봉 API 호출:', url);
    const response = await fetch(url);
    const data = await response.json();
    
    const timeSeriesKey = `Time Series (${interval})`;
    if (data[timeSeriesKey]) {
      return {
        success: true,
        ticker: ticker,
        interval: interval,
        data: data[timeSeriesKey],
        meta: data['Meta Data']
      };
    } else {
      console.log('분봉 API 응답:', data);
      return {
        success: false,
        error: data['Error Message'] || data['Note'] || '데이터 없음',
        ticker: ticker
      };
    }
  } catch (error) {
    return { success: false, error: error.message, ticker: ticker };
  }
}

// 주가 데이터 조회 (주봉)
async function getWeeklyData(ticker) {
  try {
    const url = `${BASE_URL}?function=TIME_SERIES_WEEKLY&symbol=${ticker}&apikey=${ALPHA_VANTAGE_KEY}`;
    console.log('주봉 API 호출:', url);
    const response = await fetch(url);
    const data = await response.json();
    
    if (data['Weekly Time Series']) {
      return {
        success: true,
        ticker: ticker,
        interval: 'weekly',
        data: data['Weekly Time Series'],
        meta: data['Meta Data']
      };
    } else {
      return {
        success: false,
        error: data['Error Message'] || data['Note'] || '데이터 없음',
        ticker: ticker
      };
    }
  } catch (error) {
    return { success: false, error: error.message, ticker: ticker };
  }
}

// 주가 데이터 조회 (월봉)
async function getMonthlyData(ticker) {
  try {
    const url = `${BASE_URL}?function=TIME_SERIES_MONTHLY&symbol=${ticker}&apikey=${ALPHA_VANTAGE_KEY}`;
    console.log('월봉 API 호출:', url);
    const response = await fetch(url);
    const data = await response.json();
    
    if (data['Monthly Time Series']) {
      return {
        success: true,
        ticker: ticker,
        interval: 'monthly',
        data: data['Monthly Time Series'],
        meta: data['Meta Data']
      };
    } else {
      return {
        success: false,
        error: data['Error Message'] || data['Note'] || '데이터 없음',
        ticker: ticker
      };
    }
  } catch (error) {
    return { success: false, error: error.message, ticker: ticker };
  }
}

// 티커 유효성 검증
async function validateTicker(ticker) {
  try {
    const url = `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${ticker}&apikey=${ALPHA_VANTAGE_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.bestMatches && data.bestMatches.length > 0) {
      return {
        valid: true,
        matches: data.bestMatches
      };
    }
    return { valid: false };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

// 회사 정보 조회
async function getCompanyOverview(ticker) {
  try {
    const url = `${BASE_URL}?function=OVERVIEW&symbol=${ticker}&apikey=${ALPHA_VANTAGE_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.Symbol) {
      return { success: true, data: data };
    } else {
      return { success: false, error: '회사 정보 없음' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}
