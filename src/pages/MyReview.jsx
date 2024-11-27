import Header from '../components/common/Header';
import Tab from '../components/common/Tab';
import ReviewList from '../components/review/ReviewList';
import axios from 'axios';
import { useState, useEffect } from 'react';

const MyReview = () => {
  const [reviews, setReviews] = useState([]);

  const tabs = [
    { name: '상품 후기', value: 'product-review' },
    { name: '거래자 후기', value: 'user-review' },
  ];

  const handleTabChange = async (value) => {
    try {
      const response = await axios.get(`/api/${value}`);
      setReviews(response.data);
    } catch (error) {
      console.error('리뷰를 가져오는 데 실패했습니다.', error);
    }
  };

  const defaultTab = 'product-review';

  useEffect(() => {
    handleTabChange(defaultTab);
  }, []);

  return (
    <>
      <Header title='작성한 리뷰' />
      <Tab tabs={tabs} onChangeTab={handleTabChange} defaultTab={defaultTab} />
      <ReviewList reviews={reviews} />
    </>
  );
};

export default MyReview;
