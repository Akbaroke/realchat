import { useParams } from 'react-router-dom';

export default function Personal() {
  const { id } = useParams();
  return <div>Personal {id}</div>;
}
