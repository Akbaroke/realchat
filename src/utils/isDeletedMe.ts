type Props = {
  deletedUs_userid: string[];
  user_id: string;
};

export default function isDeletedMe({ deletedUs_userid, user_id }: Props) {
  return deletedUs_userid.includes(user_id);
}
