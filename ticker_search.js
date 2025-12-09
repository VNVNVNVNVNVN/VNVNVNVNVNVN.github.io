// ticker_search.js
// Vercel 서버리스 함수를 통해 티커 검색

async function searchTicker(userInput) {
  try {
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userInput: userInput })
    });

    const data = await response.json();
    console.log('티커 검색 결과:', data);

    return data;

  } catch (error) {
    console.error('티커 검색 에러:', error);
    return {
      success: false,
      error: error.message,
      original: userInput
    };
  }
}
