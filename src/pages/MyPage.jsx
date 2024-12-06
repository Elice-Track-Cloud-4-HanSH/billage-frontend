import ServiceSection from '../components/user/ServiceSection';

const MyPage = () => {
  const options = [
    { name: '관심목록', nav: '/myfavorites' },
    { name: '내가 빌려주는 물건', nav: '/mysales' },
    { name: '내가 빌린 물건', nav: '/mypurchase' },
    { name: '작성한 리뷰', nav: '/myreview' },
  ];

  return (
    <>
      <ServiceSection subject='나의 거래' options={options} />
    </>
  );
};

export default MyPage;
