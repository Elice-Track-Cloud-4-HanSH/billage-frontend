import Header from '@/components/common/Header';
import RecordList from '@/components/rental-record/RecordList';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Tab from '@/components/common/Tab';
import { TabProvider } from '@/hooks/TabContext';
import InfiniteScroll from 'react-infinite-scroll-component';

const MyPurchase = () => {
  const [activeTab, setActiveTab] = useState('rental-record?type=대여중/구매');
  const [records, setRecords] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [lastStandard, setLastStandard] = useState(null);
  const [lastId, setLastId] = useState(null);

  const tabs = [
    { name: '대여 중', value: 'rental-record?type=대여중/구매' },
    { name: '대여 내역', value: 'rental-record?type=대여내역/구매' },
  ];

  const handleTabChange = async (value) => {
    setActiveTab(value);
    setRecords([]);
    setHasMore(true);
    setLastStandard(null);
    setLastId(null);
    try {
      const response = await axios.get(`/api/${value}`, {
        params: { size: 20 },
      });
      setRecords(response.data.content);
      setHasMore(response.data.hasNext);
      setLastStandard(response.data.lastStandard);
      setLastId(response.data.lastId);
    } catch (error) {
      console.error('대여기록을 가져오는 데 실패했습니다.', error);
    }
  };

  const fetchMoreData = async () => {
    if (!hasMore) {
      return;
    }

    try {
      const response = await axios.get(`/api/${activeTab}`, {
        params: { lastStandard: lastStandard, lastId: lastId, size: 20 },
      });

      setRecords((prevRecords) => [...prevRecords, ...response.data.content]);
      setHasMore(response.data.hasNext);
      setLastStandard(response.data.lastStandard);
      setLastId(response.data.lastId);
    } catch (error) {
      console.error('데이터를 가져오는 데 실패했습니다.', error);
    }
  };

  const defaultTab = 'rental-record?type=대여중/구매';

  useEffect(() => {
    handleTabChange(defaultTab);
  }, []);

  return (
    <TabProvider value={{ activeTab, setActiveTab }}>
      <Header title='내가 빌리는 물건' />
      <Tab tabs={tabs} onChangeTab={handleTabChange} defaultTab={defaultTab} />
      <div id='scrollableDiv' style={{ overflow: 'auto', height: '100%' }}>
        <InfiniteScroll
          dataLength={records.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={<p>마지막 기록입니다.</p>}
          scrollableTarget='scrollableDiv'
        >
          <RecordList records={records} />
        </InfiniteScroll>
      </div>
    </TabProvider>
  );
};

export default MyPurchase;
