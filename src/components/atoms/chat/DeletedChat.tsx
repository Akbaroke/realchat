import { MdOutlineDoNotDisturbAlt } from 'react-icons/md';

export default function DeletedChat() {
  return (
    <div className="font-light text-gray-300 italic gap-1 flex items-center sm:text-[14px] text-[12px] p-1">
      <MdOutlineDoNotDisturbAlt size={18} />
      <p>Message has been deleted</p>
    </div>
  );
}
