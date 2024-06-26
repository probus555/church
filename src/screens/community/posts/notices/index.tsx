import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import PostCard from '../../../../components/posts';
import CreatePostButton from '../../components/createPost/components/buttons';
import {AnimatedFlashList} from '@shopify/flash-list';
import usePosts, {Notice} from './useNotices';

const Notices = () => {
  const {notices, fetchMorePosts, isLoadingMore, hasMore, isLoading, refetch} =
    usePosts();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  useEffect(() => {
    setCurrentPage(1); // Reset current page when component mounts
  }, []);
  const handleRefresh = () => {
    setIsRefreshing(true);
    refetch().finally(() => {
      setIsRefreshing(false);
    });
  };
  const renderPost = ({item}: {item: Notice}) => <PostCard {...item} type='notice' />;

  const handleEndReached = () => {
    if (!isLoadingMore && hasMore) {
      fetchMorePosts(currentPage + 1); // Fetch next page if not loading and more data is available
      setCurrentPage(prevPage => prevPage + 1); // Increment current page
    }
  };

  return (
    <View style={styles.container}>
      <AnimatedFlashList
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator style={{alignSelf: 'center'}} />
          ) : (
            <></>
          )
        }
        data={notices}
        estimatedItemSize={323}
        renderItem={renderPost}
        keyExtractor={item => item.id.toString()}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5} // Trigger onEndReached when the list is 50% from the bottom
        ListFooterComponent={() =>
          isLoadingMore ? <ActivityIndicator size="small" color="#000" /> : null
        } // Show loading indicator at the bottom
        refreshing={isLoading}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      />
      <CreatePostButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    backgroundColor: '#f0f0f0',
  },
});

export default Notices;
