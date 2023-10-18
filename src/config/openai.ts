import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_APP_APIKEY_OPENAI,
  dangerouslyAllowBrowser: true,
});

export default openai;
