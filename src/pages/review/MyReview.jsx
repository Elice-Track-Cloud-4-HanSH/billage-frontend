import Header from '../../components/common/Header';
import Tab from '../../components/common/Tab';
import ReviewList from '../../components/review/ReviewList';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { TabProvider } from '../../hooks/TabContext';
import InfiniteScroll from 'react-infinite-scroll-component';

const MyReview = () => {
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('product-review');
  const [hasMore, setHasMore] = useState(true);
  const [lastStandard, setLastStandard] = useState(null);

  const tabs = [
    { name: '상품 후기', value: 'product-review' },
    { name: '거래자 후기', value: 'user-review' },
  ];

  const handleTabChange = async (value) => {
    setActiveTab(value);
    setReviews([]);
    setHasMore(true);
    setLastStandard(null);
    try {
      const response = await axios.get(`/api/${value}`, {
        params: { size: 20 },
      });
      setReviews(response.data.content);
      setHasMore(response.data.hasNext);
      setLastStandard(response.data.lastStandard);
    } catch (error) {
      console.error('리뷰를 가져오는 데 실패했습니다.', error);
    }
  };

  const fetchMoreData = async () => {
    if (!hasMore) {
      return;
    }

    try {
      const response = await axios.get(`/api/${activeTab}`, {
        params: { lastStandard: lastStandard, size: 20 },
      });

      setReviews((prevReviews) => [...prevReviews, ...response.data.content]);
      setHasMore(response.data.hasNext);
      setLastStandard(response.data.lastStandard);
    } catch (error) {
      console.error('데이터를 가져오는 데 실패했습니다.', error);
    }
  };

  const defaultTab = 'product-review';

  useEffect(() => {
    handleTabChange(defaultTab);
  }, []);

  return (
    <>
      <TabProvider value={{ activeTab, setActiveTab }}>
        <Header title='작성한 리뷰' />
        <Tab tabs={tabs} onChangeTab={handleTabChange} defaultTab={defaultTab} />
        <div id='scrollableDiv' style={{ overflow: 'auto', height: '100%' }}>
          <InfiniteScroll
            dataLength={reviews.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={<p>마지막 기록입니다.</p>}
            scrollableTarget='scrollableDiv'
          >
            <ReviewList reviews={reviews} />
          </InfiniteScroll>
        </div>
      </TabProvider>
    </>
  );
};

export default MyReview;
