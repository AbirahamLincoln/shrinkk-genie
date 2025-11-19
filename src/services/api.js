// Configuration for the endpoint
const API_ENDPOINT = '/api/shorten';

export const shortenUrl = async (longUrl, customDomain, customAlias) => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        longUrl,
        customDomain, // e.g. "mysite.com"
        customAlias   // e.g. "my-custom-link"
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Network response was not ok');
    }

    const data = await response.json();
    return data.shortUrl; 
  } catch (error) {
    console.error('API Service Error:', error);
    throw error;
  }
};