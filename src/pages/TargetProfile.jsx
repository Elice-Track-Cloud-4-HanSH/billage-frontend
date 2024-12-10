import { useParams } from 'react-router-dom';
import Header from '../components/common/Header';
import ReviewList from '../components/review/ReviewList';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileForm from '../components/user/ProfileForm';
import ReviewCount from '../components/user/ReviewCount';
import InfiniteScroll from 'react-infinite-scroll-component';

const TargetProfile = () => {
  const [reviews, setReviews] = useState([]);
  const [profile, setProfile] = useState();
  const [hasMore, setHasMore] = useState(true);
  const [lastStandard, setLastStandard] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        const response = await axios.get(`/api/user-review/target/${id}`, {
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
        const response = await axios.get(`/api/users/profile/${id}`);
        setProfile(response.data);
      } catch (error) {
        console.error('해당 유저의 정보를 가져오는 데 실패했습니다.', error);
      }
    };

    if (id) {
      fetchReviewData();
      fetchTargetData();
    }
  }, [id]);

  const fetchMoreData = async () => {
    if (!hasMore) {
      return;
    }

    try {
      const response = await axios.get(`/api/user-review/target/${id}`, {
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
      <Header title='프로필' />
      {profile ? (
        <>
          <ProfileForm profile={profile} mypage={false} />
          <ReviewCount profile={profile} />
        </>
      ) : (
        <div>정보를 불러오는 중입니다.</div>
      )}
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

export default TargetProfile;
