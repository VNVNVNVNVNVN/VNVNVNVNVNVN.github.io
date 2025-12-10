// api/analyze.js
// Vercel 서버리스 함수 - 주식 분석 API

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { ticker, analysisType, stockData } = req.body;

    if (!ticker || !analysisType) {
      return res.status(400).json({ error: 'ticker and analysisType are required' });
    }

    // 분석 타입별 프롬프트
    const prompts = {
      trend: `${ticker} 주식의 다음 데이터를 보고 추세 분석을 해줘. 상승/하락/횡보 추세인지, 추세 강도는 어떤지 간단히 3-4문장으로 설명해줘.`,
      candle: `${ticker} 주식의 다음 데이터를 보고 최근 캔들 패턴을 분석해줘. 주요 캔들 패턴(도지, 해머, 장악형 등)이 있는지 간단히 3-4문장으로 설명해줘.`,
      volume: `${ticker} 주식의 다음 데이터를 보고 거래량 분석을 해줘. 거래량 추이와 가격과의 관계를 간단히 3-4문장으로 설명해줘.`,
      macd: `${ticker} 주식의 다음 데이터를 보고 MACD 관점에서 분석해줘. 현재 MACD 상태와 시그널을 간단히 3-4문장으로 설명해줘.`,
      rsi: `${ticker} 주식의 다음 데이터를 보고 RSI 관점에서 분석해줘. 과매수/과매도 상태인지 간단히 3-4문장으로 설명해줘.`,
      stoch: `${ticker} 주식의 다음 데이터를 보고 스토캐스틱 관점에서 분석해줘. 현재 위치와 시그널을 간단히 3-4문장으로 설명해줘.`,
      summary: `${ticker} 주식의 다음 데이터와 기술적 분석을 종합해서 투자 의견을 제시해줘. 현재 상태, 주요 지지/저항선, 단기 전망을 5-6문장으로 설명해줘. 마지막에 "⚠️ 본 분석은 참고용이며 투자 책임은 본인에게 있습니다."를 추가해줘.`
    };

    const prompt = prompts[analysisType] || prompts.summary;

    // 최근 30일 데이터만 추출 (토큰 절약)
    let recentData = '';
    if (stockData && stockData.data) {
      const entries = Object.entries(stockData.data).slice(0, 30);
      recentData = entries.map(([date, values]) => 
        `${date}: 시가 ${values['1. open']}, 고가 ${values['2. high']}, 저가 ${values['3. low']}, 종가 ${values['4. close']}, 거래량 ${values['5. volume']}`
      ).join('\n');
    }

    // Claude API 호출
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.plai_stock_api_key,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: `${prompt}\n\n데이터:\n${recentData}`
          }
        ]
      })
    });

    const data = await response.json();

    if (data.content && data.content[0]) {
      return res.status(200).json({
        success: true,
        analysis: data.content[0].text,
        analysisType: analysisType
      });
    } else if (data.error) {
      return res.status(500).json({
        success: false,
        error: data.error.message
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'API 응답 오류'
      });
    }

  } catch (error) {
    console.error('분석 API 에러:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
