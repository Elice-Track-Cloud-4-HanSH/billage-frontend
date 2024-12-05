import { useParams } from 'react-router-dom';
import Header from '../components/common/Header';
import ReviewList from '../components/review/ReviewList';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileForm from '../components/user/ProfileForm';

const TargetProfile = () => {
  const [reviews, setReviews] = useState([]);
  const [profile, setProfile] = useState();

  const { id } = useParams();

  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        const response = await axios.get(`/api/user-review/target/${id}`);
        setReviews(response.data);
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

  return (
    <>
      <Header title='프로필' />
      {profile ? <ProfileForm profile={profile} /> : <div>정보를 불러오는 중입니다.</div>}
      <ReviewList reviews={reviews} />
    </>
  );
};

export default TargetProfile;
