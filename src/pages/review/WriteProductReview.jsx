import Header from '../../components/common/Header';
import ReviewSubject from '../../components/review/ReviewSubject';
import WriteReviewForm from '../../components/review/WriteReviewForm';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const WriteProductReview = () => {
  const [subjectInfo, setSubjectInfo] = useState();
  const { id } = useParams();

  const handleReviewSubmit = async (data) => {
    try {
      const response = await axios.post(`/api/product-review/${id}`, data);
      console.log('응답 성공:', response.data);
    } catch (error) {
      console.error('리뷰 제출 중 오류 발생:', error);
      alert('리뷰 제출에 실패했습니다. 다시 시도해주세요.');
    }
  };

  useEffect(() => {
    const fetchSubjectInfo = async () => {
      try {
        const response = await axios.get(`/api/product-review/${id}`);
        setSubjectInfo(response.data);
      } catch (error) {
        console.error('리뷰 대상 조회 중 오류 발생:', error);
      }
    };

    if (id) {
      fetchSubjectInfo();
    }
  }, [id]);

  return (
    <>
      <Header title='상품 리뷰' />
      {subjectInfo ? (
        <ReviewSubject subjectInfo={subjectInfo} comment='해당 상품에 대한 점수를 평가해주세요.' />
      ) : (
        <div>정보를 불러오는 중입니다...</div> // 로딩 상태
      )}
      <WriteReviewForm onSubmit={handleReviewSubmit} />
    </>
  );
};

export default WriteProductReview;
