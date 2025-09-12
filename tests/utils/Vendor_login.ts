var headers = {
  'accept':'*/*',
  'accept-language':'en-US,en;q=0.9',
  'access-token':'YWdyaWJpZF93ZWJfa2V5OmFncmliaWRfd2ViX3NlY3JldA==',
  'app-version':'2.30.186',
  'content-type':'application/json',
  'lightspeed-token':'eyJkZXZpY2UtdHlwZSI6IndlYi1jb25zb2xlIiwidXVpZCI6Im1UTm9ERUF6R3AifQ==',
  'origin':'https://vendor-main.preview.procol.tech',
  'priority':'u=1, i',
  'referer':'https://vendor-main.preview.procol.tech/',
  'sec-ch-ua':'"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
  'sec-ch-ua-mobile':'?0',
  'sec-ch-ua-platform':'"macOS"',
  'sec-fetch-dest':'empty',
  'sec-fetch-mode':'cors',
  'sec-fetch-site':'cross-site',
  'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.'
  };
export async function login2(number, otp) {
  const fetch = (await import('node-fetch')).default;
  const baseURL = 'https://qa-api.ag-ri.in/api'; // Replace with your actual base URL if different
  const url = `${baseURL}/v1/generate_otp`;
  const url2 = `${baseURL}/v1/verify_otp`;
  // Step 1: Generate OTP
  const generateOtpBody = JSON.stringify({
    phone: number,
    phone_prefix: '+91'
  });
  const genResponse = await fetch(url, {
    method: 'POST',
    headers,
    body: generateOtpBody
  });
  if (genResponse.status !== 200) {
    throw new Error('Failed to generate OTP');
  }
  console.log('OTP requested successfully.' + number);
  // Step 2: Wait for OTP to be passed in (assumed to be passed as `otp`)
  const verifyOtpBody = JSON.stringify({
    phone: number,
    otp: otp,
    phone_prefix: '+91',
    push_token: null,
    device_info: {
      browser: 'Chrome',
      os: 'OS X 10.15.7 64-bit',
      browser_version: '128.0.0.0',
      resolution: '2048x1280'
    },
    device_id: 'bfdf4b67a5c3f6571b93586e0855f546'
  });
  const verifyResponse = await fetch(url2, {
    method: 'POST',
    headers,
    body: verifyOtpBody
  });
  if (verifyResponse.status !== 200) {
    throw new Error('OTP verification failed');
  }
  console.log('OTP verification successful.' + otp);
  const data = await verifyResponse.json();
  const company_uuid = data.user.uuid;
  var newToken = Buffer.from("agribid_web_key:" + "agribid_web_secret:" + data.access_token).toString('base64')
  var newLight = Buffer.from("{\"device-type\":\"web-console\",\"uuid\":\"" + data.user.uuid + "\"}").toString('base64')
  const updatedHeaders = {
    ...headers,
    'access-token': newToken,
    'lightspeed-token': newLight
  };
  return updatedHeaders;
}