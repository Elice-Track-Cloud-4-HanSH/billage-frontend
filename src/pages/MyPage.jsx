import ServiceSection from '../components/user/ServiceSection';
import ReviewList from '../components/review/ReviewList';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileForm from '../components/user/ProfileForm';
import ReviewCount from '../components/user/ReviewCount';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

const MyPage = () => {
  const [reviews, setReviews] = useState([]);
  const [profile, setProfile] = useState();
  const [hasMore, setHasMore] = useState(true);
  const [lastStandard, setLastStandard] = useState(null);

  const navigate = useNavigate();

  const options = [
    { name: '관심목록', nav: '/myfavorites' },
    { name: '내가 빌려주는 물건', nav: '/mysales' },
    { name: '내가 빌린 물건', nav: '/mypurchase' },
    { name: '작성한 리뷰', nav: '/myreview' },
  ];

  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        const response = await axios.get('/api/user-review/target', {
          params: { size: 20 },
        });
        setReviews(response.data.content);
        setHasMore(response.data.hasNext);
        setLastStandard(response.data.lastStandard);
      } catch (error) {
        console.error('리뷰를 가져오는 데 실패했습니다.', error);
      }
    };

    const fetchTargetData = async () => {
      try {
        const response = await axios.get('/api/users/get-profile');
        setProfile(response.data);
      } catch (error) {
        console.error('해당 유저의 정보를 가져오는 데 실패했습니다.', error);
      }
    };

    fetchReviewData();
    fetchTargetData();
  }, []);

  const fetchMoreData = async () => {
    if (!hasMore) {
      return;
    }

    try {
      const response = await axios.get('/api/user-review/target', {
        params: { lastStandard: lastStandard, size: 20 },
      });
      setReviews((prevReviews) => [...prevReviews, ...response.data.content]);
      setHasMore(response.data.hasNext);
      setLastStandard(response.data.lastStandard);
    } catch (error) {
      console.error('데이터를 가져오는 데 실패했습니다.', error);
    }
  };

  return (
    <>
      <header className='d-flex align-items-center px-3 py-2 border-bottom justify-content-between'>
        <h1 className='m-0 fs-4'>마이페이지</h1>
        <button
          type='button'
          className='btn'
          style={{ backgroundColor: '#F16366', borderColor: '#F16366', color: 'white' }}
          onClick={() => {
            navigate('/logout');
          }}
        >
          {' '}
          로그아웃{' '}
        </button>
      </header>
      {profile ? (
        <ProfileForm profile={profile} mypage={true} />
      ) : (
        <div>정보를 불러오는 중입니다.</div>
      )}
      <ServiceSection subject='나의 거래' options={options} />
      {profile ? <ReviewCount profile={profile} /> : <div>정보를 불러오는 중입니다.</div>}
      <InfiniteScroll
        dataLength={reviews.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p>마지막 기록입니다.</p>}
      >
        <ReviewList reviews={reviews} reviewType={false} />
      </InfiniteScroll>
    </>
  );
};

export default MyPage;
