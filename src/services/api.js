// Points to your external Backend Microservice
// In production, set NEXT_PUBLIC_API_URL in your Vercel Environment Variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_ENDPOINT = `${API_BASE_URL}/api/shorten`;

export const shortenUrl = async (urlInput, customDomain, customAlias) => {
  try {
    const isBulk = Array.isArray(urlInput);
    
    // Construct payload matches your Microservice controller
    const payload = {
      customDomain,
      customAlias: isBulk ? null : customAlias // Ignore alias for bulk
    };

    if (isBulk) {
      payload.longUrls = urlInput; // Send Array
    } else {
      payload.longUrl = urlInput;  // Send String
    }

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Network response was not ok');
    }

    const data = await response.json();
    
    // Return array of results if bulk, or single object if single
    if (isBulk) {
      return data.results; // Expecting [{ shortUrl, longUrl, id }, ...]
    } else {
      return { shortUrl: data.shortUrl, id: data.id };
    }

  } catch (error) {
    console.error('API Service Error:', error);
    throw error;
  }
};