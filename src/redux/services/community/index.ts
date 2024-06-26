import {API_TOKEN} from '@env';
import {baseApi} from '../BaseApiSlice';

// Define a service using a base URL and expected endpoints
export const communityApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    createNotice: builder.mutation<any, any>({
      query: formData => {
// NoticeList
        return {
          url: 'AddNotices',
          method: 'POST',
          body: formData,
          headers: {
            // You may need to set appropriate headers for file upload
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'multipart/form-data', // Usually, not needed because it's set by the browser automatically
          },
        };
      },
       invalidatesTags: ['Post'],
    }),
    createNews: builder.mutation<any, any>({
      query: formData => {
// NoticeList
        return {
          url: 'AddNews',
          method: 'POST',
          body: formData,
          headers: {
            // You may need to set appropriate headers for file upload
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'multipart/form-data', // Usually, not needed because it's set by the browser automatically
          },
        };
      },
       invalidatesTags: ['news'],
    }),
    createEvent: builder.mutation<any, any>({
      query: formData => {
// NoticeList
        return {
          url: 'AddEvent',
          method: 'POST',
          body: formData,
          headers: {
            // You may need to set appropriate headers for file upload
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'multipart/form-data', // Usually, not needed because it's set by the browser automatically
          },
        };
      },
       invalidatesTags: ['event'],
    }),
    getNotices: builder.query<any, number>({
      query: (page) => ({
        url: `NoticeList?page=${page}`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) =>
      {
        console.log('result, error, arg',result, error, arg)
        return (
          result
        ? [...result.data.noticeList.map(({ id }) => ({ type: 'Post' as const, id })), 'Post']
        : ['Post']
        )
      },
    }),
    getNews: builder.query<any, number>({
      query: (page) => ({
        url: `NewsList?page=${page}`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) =>
      {
        console.log('result, error, arg',result, error, arg)
        return (
          result
        ? [...result.data.newsList.map(({ id }) => ({ type: 'news' as const, id })), 'news']
        : ['news']
        )
      },
    }),
    getEvents: builder.query<any, number>({
      query: (page) => ({
        url: `EventList?page=${page}`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) =>
      {
        console.log('result, error, arg',result, error, arg)
        return (
          result
        ? [...result.data.eventList.map(({ id }) => ({ type: 'event' as const, id })), 'event']
        : ['event']
        )
      },
    }),
    // Delete?id=149&machineIP=11&machineId=A1
    deletePost: builder.mutation<any, {id:number|string,machineIp:number|string,machineId:number|string}>({
      query: (payload) => ({
        url: `Delete?id=${payload.id}&machineIP=${payload.machineIp}&machineId=${payload.machineId}`,
        method: 'DELETE',
      }),
       invalidatesTags: ['Post'],
    }),
    deleteNews: builder.mutation<any, {id:number|string,machineIp:number|string,machineId:number|string,machineName:string}>({
      query: (payload) => ({
        url: `DeleteNews?id=${payload.id}&machineName=${payload.machineName}&machineIP=${payload.machineIp}`,
        method: 'DELETE',
      }),
       invalidatesTags: ['news'],
    }),
    deleteEvent: builder.mutation<any, {id:number|string,machineIp:number|string,machineId:number|string,machineName:string}>({
      query: (payload) => ({
        url: `DeleteEvents?id=${payload.id}&machineName=${payload.machineName}&machineIP=${payload.machineIp}`,
        method: 'DELETE',
      }),
       invalidatesTags: ['event'],
    }),
    editNotice: builder.mutation<any, {noticeTitle:string,machineIP:string,machineId:string,noticeDescription:string,files:any,images:any,videos:any,id:string}>({
      query: formData => {
// NoticeList
        return {
          url: 'UpdateNotices',
          method: 'POST',
          body: formData,
          headers: {
            // You may need to set appropriate headers for file upload
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'multipart/form-data', // Usually, not needed because it's set by the browser automatically
          },
        };
      },
       invalidatesTags: ['Post'],
  }),
  }),
});

export const {useCreateNoticeMutation,useGetNoticesQuery,useDeletePostMutation,useEditNoticeMutation,useCreateNewsMutation,useCreateEventMutation,useDeleteNewsMutation,useGetEventsQuery,useGetNewsQuery,useDeleteEventMutation} = communityApi;
