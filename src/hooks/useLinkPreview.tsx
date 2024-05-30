
import { LinkPreviewInterface } from '@/components/molecules/LinkPreview';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

export default function useLinkPreview(url: string) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LinkPreviewInterface | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_APP_BASEURL_LINKPREVIEW}/api/link-preview?url=${url}`);
        console.log(res.data);
        setData(res.data.result.siteData);
      } catch (error) {
        const err = error as AxiosError;
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    url && fetchData();
  }, [url]);

  return {
    loading,
    error,
    data,
  };
}
