import { DataChats } from '@/hooks/useSnapshotChats';

export default function sortMessageByDate(chats: DataChats[]) {
  // Mengurutkan pesan chat berdasarkan tanggal terbaru
  const sortedMessages =
    chats?.sort((a, b) => a.created_at - b.created_at) || [];

  // Memisahkan pesan chat berdasarkan tanggal
  const messagesByDay: Record<number, typeof sortedMessages> = {};
  sortedMessages.forEach((message) => {
    const timestamp = message.created_at;
    const messageDay = new Date(timestamp * 1000.0);
    messageDay.setHours(0, 0, 0, 0);
    const messageDayTimestamp = messageDay.getTime();
    if (!messagesByDay[messageDayTimestamp]) {
      messagesByDay[messageDayTimestamp] = [];
    }
    messagesByDay[messageDayTimestamp].push(message);
  });

  return messagesByDay;
}

const isSameDay = (timestamp1: number, timestamp2: number): boolean => {
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const todayTimestamp = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.getTime();
};

export { isSameDay, todayTimestamp };
