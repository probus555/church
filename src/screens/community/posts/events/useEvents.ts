import {useGetEventsQuery, Event} from '../../../../redux/services/community';
import {useState, useEffect} from 'react';

interface MetaData {
  totalItems: number;
  perPage: number;
  currentPage: number;
  totalPages: number;
}

interface ApiResponse {
  data: {
    eventList: Event[];
    meta: MetaData;
  };
}

const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const {data, isLoading, isError, refetch} = useGetEventsQuery(page); // Assuming useGetEventsQuery is correctly configured
  console.log(totalPages);
  useEffect(() => {
    const fetchData = async () => {
      if (data) {
        const {eventList, meta}: ApiResponse['data'] = data.data;
        if (eventList && meta) {
          if (page === 1) {
            setEvents(eventList);
          } else {
            setEvents(prevNotices => [...prevNotices, ...eventList]);
          }
          setTotalPages(meta.totalPages);
          setHasMore(meta.currentPage < meta.totalPages);
          setIsLoadingMore(false);
        }
      }
    };

    fetchData();
  }, [data, page]);

  const fetchMoreEvents = (nextPage: number) => {
    if (!isLoadingMore && nextPage <= totalPages) {
      setIsLoadingMore(true);
      setPage(nextPage);
    }
  };

  return {events, fetchMoreEvents, isLoadingMore, hasMore, isLoading, refetch}; // Return events instead of Events
};

export default useEvents;
