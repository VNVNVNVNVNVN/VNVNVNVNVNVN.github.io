<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PLAI-STOCK | 분석</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  </style>
</head>
<body>
  <div class="min-h-screen" style="background-color: #1a1a2e;">
    
    <!-- 헤더 -->
    <header class="flex items-center justify-between px-6 py-4 border-b" style="border-color: #334155;">
      <!-- 로고 -->
      <a href="index.html" class="text-2xl font-bold tracking-wide">
        <span class="text-white">PL</span><span style="color: #22d3ee;">AI</span><span class="text-gray-500">-</span><span class="text-gray-400">STOCK</span>
      </a>
      
      <!-- 검색창 -->
      <div class="flex items-center rounded-full px-4 py-2" style="background-color: rgba(30, 41, 59, 0.8); border: 1px solid #334155;">
        <input
          type="text"
          id="searchInput"
          placeholder="종목 검색"
          class="w-48 outline-none text-sm bg-transparent text-white placeholder-gray-500"
        />
        <button id="searchBtn" class="ml-2 p-1 rounded-full hover:bg-gray-700 transition-colors">
          <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
      </div>
    </header>

    <!-- 종목 정보 바 -->
    <div class="px-6 py-4 border-b" style="border-color: #334155;">
      <div class="flex items-center gap-4">
        <h1 id="tickerName" class="text-3xl font-bold text-white">TSLA</h1>
        <span id="companyName" class="text-gray-400 text-lg">Tesla Inc.</span>
        <span id="currentPrice" class="text-2xl font-semibold text-green-400 ml-auto">$248.50</span>
        <span id="priceChange" class="text-green-400">+3.24 (+1.32%)</span>
      </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <main class="p-6">
      
      <!-- 차트 섹션 -->
      <section class="rounded-xl p-6 mb-6" style="background-color: rgba(30, 41, 59, 0.5); border: 1px solid #334155;">
        <!-- 타임프레임 선택 -->
        <div id="timeframeButtons" class="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
          <button data-interval="1min" class="timeframe-btn px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-700">1분</button>
          <button data-interval="5min" class="timeframe-btn px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-700">5분</button>
          <button data-interval="15min" class="timeframe-btn px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-700">15분</button>
          <button data-interval="30min" class="timeframe-btn px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-700">30분</button>
          <button data-interval="60min" class="timeframe-btn px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-700">1시간</button>
          <button data-interval="daily" class="timeframe-btn px-4 py-2 rounded-lg text-sm font-medium bg-cyan-500 text-white">일봉</button>
          <button data-interval="weekly" class="timeframe-btn px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-700">주봉</button>
          <button data-interval="monthly" class="timeframe-btn px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-700">월봉</button>
        </div>
        
        <!-- 차트 영역 -->
        <div id="chartContainer" class="w-full h-96 rounded-lg flex items-center justify-center" style="background-color: #0f172a;">
          <span class="text-gray-500">차트 로딩 중...</span>
        </div>
      </section>

      <!-- AI 분석 섹션 -->
      <section class="rounded-xl p-6" style="background-color: rgba(30, 41, 59, 0.5); border: 1px solid #334155;">
        <h2 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
          AI 분석 리포트
        </h2>
        
        <!-- 분석 카드 그리드 (동적 렌더링) -->
        <div id="analysisGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <!-- JS에서 동적으로 생성 -->
        </div>

        <!-- 종합 의견 -->
        <div class="rounded-lg p-4" style="background-color: #0f172a;">
          <h3 class="text-cyan-400 font-semibold mb-2">💡 종합 의견</h3>
          <p id="summaryAnalysis" class="text-gray-300">분석 중...</p>
        </div>
      </section>

    </main>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/lightweight-charts@4.1.0/dist/lightweight-charts.standalone.production.min.js"></script>
  <script src="ticker_search.js"></script>
  <script src="alpha_vantage_api_call.js"></script>
  <script>
    // ===== 분석 카드 설정 (유지보수 용이) =====
    const ANALYSIS_CARDS = [
      { id: 'trend', icon: '📈', title: '추세 분석', prompt: '추세 분석을 해줘' },
      { id: 'candle', icon: '🕯️', title: '캔들 패턴', prompt: '캔들 패턴을 분석해줘' },
      { id: 'volume', icon: '📊', title: '거래량', prompt: '거래량을 분석해줘' },
      { id: 'macd', icon: '📉', title: 'MACD', prompt: 'MACD 지표를 분석해줘' },
      { id: 'rsi', icon: '⚡', title: 'RSI', prompt: 'RSI 지표를 분석해줘' },
      { id: 'stoch', icon: '🎯', title: '스토캐스틱', prompt: '스토캐스틱 지표를 분석해줘' },
    ];

    // ===== 분석 카드 렌더링 =====
    function renderAnalysisCards() {
      const grid = document.getElementById('analysisGrid');
      grid.innerHTML = ANALYSIS_CARDS.map(card => `
        <div class="rounded-lg p-4" style="background-color: #0f172a;">
          <h3 class="text-cyan-400 font-semibold mb-2">${card.icon} ${card.title}</h3>
          <p id="${card.id}Analysis" class="text-gray-300 text-sm">분석 중...</p>
        </div>
      `).join('');
    }

    // ===== 차트 렌더링 =====
    let chart = null;
    let candleSeries = null;

    function renderChart(stockData) {
      const container = document.getElementById('chartContainer');
      container.innerHTML = '';

      chart = LightweightCharts.createChart(container, {
        width: container.clientWidth,
        height: 384,
        layout: {
          background: { color: '#0f172a' },
          textColor: '#9ca3af',
        },
        grid: {
          vertLines: { color: '#1e293b' },
          horzLines: { color: '#1e293b' },
        },
        crosshair: {
          mode: LightweightCharts.CrosshairMode.Normal,
        },
        rightPriceScale: {
          borderColor: '#334155',
        },
        timeScale: {
          borderColor: '#334155',
          timeVisible: true,
        },
      });

      candleSeries = chart.addCandlestickSeries({
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderUpColor: '#22c55e',
        borderDownColor: '#ef4444',
        wickUpColor: '#22c55e',
        wickDownColor: '#ef4444',
      });

      // 데이터 변환 (Alpha Vantage → Lightweight Charts 형식)
      const chartData = Object.entries(stockData.data)
        .map(([date, values]) => ({
          time: date,
          open: parseFloat(values['1. open']),
          high: parseFloat(values['2. high']),
          low: parseFloat(values['3. low']),
          close: parseFloat(values['4. close']),
        }))
        .sort((a, b) => new Date(a.time) - new Date(b.time));

      candleSeries.setData(chartData);
      chart.timeScale().fitContent();

      // 현재가 및 등락률 업데이트
      if (chartData.length > 0) {
        const latest = chartData[chartData.length - 1];
        const prev = chartData.length > 1 ? chartData[chartData.length - 2] : latest;
        const change = latest.close - prev.close;
        const changePercent = (change / prev.close * 100).toFixed(2);
        
        document.getElementById('currentPrice').textContent = `${latest.close.toFixed(2)}`;
        document.getElementById('currentPrice').className = change >= 0 ? 'text-2xl font-semibold text-green-400 ml-auto' : 'text-2xl font-semibold text-red-400 ml-auto';
        document.getElementById('priceChange').textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)} (${change >= 0 ? '+' : ''}${changePercent}%)`;
        document.getElementById('priceChange').className = change >= 0 ? 'text-green-400' : 'text-red-400';
      }

      // 리사이즈 대응
      window.addEventListener('resize', () => {
        chart.resize(container.clientWidth, 384);
      });
    }

    // ===== 초기화 =====
    const urlParams = new URLSearchParams(window.location.search);
    const ticker = urlParams.get('ticker');

    renderAnalysisCards();

    if (ticker) {
      document.getElementById('tickerName').textContent = ticker;

      // sessionStorage에서 데이터 확인
      const savedData = sessionStorage.getItem('stockData');
      
      if (savedData) {
        const stockData = JSON.parse(savedData);
        renderChart(stockData);
        document.getElementById('companyName').textContent = stockData.meta?.['2. Symbol'] || '';
      } else {
        // 데이터 없으면 새로 로드
        getDailyData(ticker).then(stockData => {
          if (stockData.success) {
            renderChart(stockData);
          } else {
            document.getElementById('chartContainer').innerHTML = 
              '<span class="text-red-400">차트 데이터를 불러올 수 없습니다.</span>';
          }
        });
      }
    }

    // ===== 검색 기능 =====
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    async function handleSearch() {
      const query = searchInput.value.trim();
      if (!query) return;

      try {
        const tickerResult = await searchTicker(query);
        if (tickerResult.success) {
          window.location.href = `analysis.html?ticker=${tickerResult.ticker}`;
        } else {
          alert('티커를 찾을 수 없습니다.');
        }
      } catch (error) {
        alert('검색 중 오류가 발생했습니다.');
      }
    }

    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSearch();
    });
    searchBtn.addEventListener('click', handleSearch);
  </script>
</body>
</html>
