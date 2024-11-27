import { useEffect, useState } from 'react';
import Header from '../components/common/Header';
import ReviewSubject from '../components/review/ReviewSubject';
import WriteReviewForm from '../components/review/WriteReviewForm';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const WriteUserReview = () => {
  const [subjectInfo, setSubjectInfo] = useState();
  const { id } = useParams();

  const handleReviewSubmit = async (data) => {
    try {
      const response = await axios.post(`/api/user-review/${id}`, data);
      console.log('응답 성공:', response.data);
    } catch (error) {
      console.error('리뷰 제출 중 오류 발생:', error);
      alert('리뷰 제출에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleReviewSubject = async () => {
    try {
      const response = await axios.get(`/api/user-review/${id}`);
      setSubjectInfo(response.data);
    } catch (error) {
      console.error('리뷰 대상 조회 중 오류 발생:', error);
      alert('리뷰 대상을 불러오는데 실패했습니다. 다시 시도해주세요.');
    }
  };

  useEffect(() => {
    handleReviewSubject();
  }, []);

  return (
    <>
      <Header title='상대방 리뷰' />
      <ReviewSubject subjectInfo={subjectInfo} comment='거래 상대방의 매너 점수를 평가해주세요.' />
      <WriteReviewForm onSubmit={handleReviewSubmit} />
    </>
  );
};

export default WriteUserReview;
