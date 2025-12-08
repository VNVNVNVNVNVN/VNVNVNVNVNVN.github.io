// ticker_search.js
// 사용자 입력(한글/영어/오타)을 Claude API로 티커로 변환

const CLAUDE_API_KEY = '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';

async function searchTicker(userInput) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
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
      return {
        success: ticker !== 'UNKNOWN',
        ticker: ticker,
        original: userInput
      };
    } else {
      return {
        success: false,
        error: 'API 응답 오류',
        original: userInput
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      original: userInput
    };
  }
}
