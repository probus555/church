import {useGetNewsQuery, News, } from '../../../../redux/services/community';
import {useState, useEffect} from 'react';

interface MetaData {
  totalItems: number;
  perPage: number;
  currentPage: number;
  totalPages: number;
}

interface ApiResponse {
  data: {
    newsList: News[];
    meta: MetaData;
  };
}

const useNews = () => {
  const [news, setNews] = useState<News[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const {data, isLoading, isError, refetch} = useGetNewsQuery(page); // Assuming useGetNewsQuery is correctly configured
  console.log(totalPages);
  useEffect(() => {
    const fetchData = async () => {
      if (data) {
        const {newsList, meta}: ApiResponse['data'] = data.data;
        if (newsList && meta) {
          if (page === 1) {
            setNews(newsList);
          } else {
            setNews(prevNotices => [...prevNotices, ...newsList]);
          }
          setTotalPages(meta.totalPages);
          setHasMore(meta.currentPage < meta.totalPages);
          setIsLoadingMore(false);
        }
      }
    };

    fetchData();
  }, [data, page]);

  const fetchMoreNews = (nextPage: number) => {
    if (!isLoadingMore && nextPage <= totalPages) {
      setIsLoadingMore(true);
      setPage(nextPage);
    }
  };

  return {news, fetchMoreNews, isLoadingMore, hasMore, isLoading, refetch}; // Return news instead of News
};

export default useNews;
