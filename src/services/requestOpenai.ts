import generateAI from '@/config/generateAI';

export default async function requestOpenai(userQuestion: string) {
  const response = await generateAI.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: userQuestion + ' berikan jawaban singkat hanya 50 kata',
      },
    ],
    model: 'gpt-3.5-turbo',
    max_tokens: 100,
  });

  return response;
}
