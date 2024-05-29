import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_APP_APIKEY_GEMINI);

const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export { model, genAI };
