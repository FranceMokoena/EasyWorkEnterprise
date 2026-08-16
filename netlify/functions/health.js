exports.handler = async () => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      success: true,
      message: 'Easywork Enterprise API is running.',
      timestamp: new Date().toISOString()
    })
  };
};
