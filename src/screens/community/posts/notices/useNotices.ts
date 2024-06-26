import {useGetNoticesQuery, Notice} from '../../../../redux/services/community';
import {useState, useEffect} from 'react';

interface MetaData {
  totalItems: number;
  perPage: number;
  currentPage: number;
  totalPages: number;
}

interface ApiResponse {
  data: {
    noticeList: Notice[];
    meta: MetaData;
  };
}

const useNotices = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const {data, isLoading, isError,refetch} = useGetNoticesQuery(page);
  
  useEffect(() => {
    const fetchData = async () => {
      if (data) {
        const {noticeList, meta}: ApiResponse['data'] = data.data;
        if (noticeList && meta) {
          if (page === 1) {
            setNotices(noticeList);
          } else {
            setNotices(prevNotices => [...prevNotices, ...noticeList]);
          }
          setTotalPages(meta.totalPages);
          setHasMore(meta.currentPage < meta.totalPages);
          setIsLoadingMore(false);
        }
      }
    };

    fetchData();
  }, [data, page]);

  const fetchMorePosts = (nextPage: number) => {
    if (!isLoadingMore && nextPage <= totalPages) {
      setIsLoadingMore(true);
      setPage(nextPage);
    }
  };

  return {notices, fetchMorePosts, isLoadingMore, hasMore,isLoading,refetch};
};

export default useNotices;
