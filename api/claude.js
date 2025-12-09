// api/claude.js
// Vercel 서버리스 함수 - Claude API 프록시

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userInput } = req.body;

    if (!userInput) {
      return res.status(400).json({ error: 'userInput is required' });
    }

    // Claude API 호출
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: `"${userInput}"의 주식 티커(symbol)를 알려줘.

규칙:
- 미국 주식이면 티커만 답해 (예: TSLA, AAPL)
- 한국 주식이면 종목코드.KS 형태로 답해 (예: 005930.KS)
- 티커만 답하고 다른 설명은 하지 마
- 모르겠으면 "UNKNOWN" 이라고만 답해

답변:`
          }
        ]
      })
    });

    const data = await response.json();

    if (data.content && data.content[0]) {
      const ticker = data.content[0].text.trim().toUpperCase();
      return res.status(200).json({
        success: ticker !== 'UNKNOWN',
        ticker: ticker,
        original: userInput
      });
    } else if (data.error) {
      return res.status(500).json({
        success: false,
        error: data.error.message,
        original: userInput
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'API 응답 오류',
        original: userInput
      });
    }

  } catch (error) {
    console.error('Claude API 에러:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
