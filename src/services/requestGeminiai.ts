import { model } from '@/config/geminiai';

async function requestGeminiai(prompt: string) {
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

export default requestGeminiai;
