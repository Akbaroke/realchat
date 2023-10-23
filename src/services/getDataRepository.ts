import axios from 'axios';

export interface RepositoryDetail {
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  visibility: string;
  stargazers_count: number;
  forks_count: number;
  subscribers_count: number;
  language: string;
  topics: string[];
  owner: {
    login: string;
    avatar_url: string;
  };
}

export default async function getDataRepository(
  ownerName: string,
  repositoryName: string
): Promise<RepositoryDetail> {
  const res = await axios.get(
    `https://api.github.com/repos/${ownerName}/${repositoryName}`
  );
  return res.data;
}
