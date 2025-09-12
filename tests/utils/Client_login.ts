var headers = {
  'accept': '*/*',
  'accept-language': 'en-US,en;q=0.9',
  'access-token': 'Y29uc29sZV9hcHBfa2V5OmNvbnNvbGVfYXBwX3NlY3JldA==',
  'app-version': '9.2.18',
  'content-type': 'application/json',
  'lightspeed-token': 'eyJkZXZpY2UtdHlwZSI6IndlYi1jb25zb2xlIiwidXVpZCI6InRxWldUbUgwYlcifQ==',
  'origin': 'https://client-main.preview.procol.tech',
  'priority': 'u=1, i',
  'referer': 'https://client-main.preview.procol.tech/',
  'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
};

export async function login(number, otp) {
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

  if (genResponse.status !==200) {
    throw new Error('Failed to generate OTP');
  }

  console.log('OTP requested successfully.' + number);

  // Step 2: Wait for OTP to be passed in (assumed to be passed as `otp`)
  const verifyOtpBody = JSON.stringify({
    phone: number,
    otp: otp,
    phone_prefix: '+91',
    // push_token: null,
    device_info: {
      browser: 'Chrome',
      os: 'Windows 10 64-bit',
      browser_version: '139.0.0.0',
      resolution: '1536x864'
    },
    device_id: 'fe0efd160f4425de40eb7ebbbe9039b6'
  });
  console.log(verifyOtpBody);
  const verifyResponse = await fetch(url2, {
    method: 'POST',
    headers,
    body: verifyOtpBody
  });
  
  if (verifyResponse.status !== 200) {
    throw new Error('OTP verification failed');
  }
  const data = await verifyResponse.json();
  var newToken = Buffer.from("console_app_key:" + "console_app_secret:" + data.access_token).toString('base64')
  var newLight = Buffer.from("{\"device-type\":\"web-console\",\"uuid\":\"" + data.user.uuid + "\"}").toString('base64')
  const updatedHeaders = {
    ...headers,
    'access-token': newToken,
    'lightspeed-token': newLight
  };
  console.log('Login successful with number:' + number,);

  return updatedHeaders;
}
