import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosCredential } from '@/utils/axiosCredential';
import Header from '@/components/common/Header'; // Header 컴포넌트 import
import ReviewList from '@/components/review/ReviewList';
import ProductDetailNavbar from '@/components/product/ProductDetailNavbar';
import '@/styles/product/ProductDetail.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import useAuth from '@/hooks/useAuth';
import defaultProfileImage from '@/styles/default_profile.png';
import ReviewCount from '../../components/user/ReviewCount';
import { FaStar } from 'react-icons/fa';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';

const ProductDetail = () => {
  const { productId } = useParams(); // URL에서 productId 가져오기
  const navigate = useNavigate(); // navigate 초기화
  const [product, setProduct] = useState(null); // 상품 데이터 상태 관리
  const [reviews, setReviews] = useState([]); // 리뷰 데이터 상태 관리
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [error, setError] = useState(null); // 에러 상태 관리
  const [isFavorite, setIsFavorite] = useState(false); // 좋아요 상태 관리
  const [checkAuthor, setCheckAuthor] = useState(false); // 작성자 확인 상태 관리
  const sliderRef = useRef(null);
  const mapRef = useRef(null); // mapRef 정의 추가
  const { userInfo } = useAuth();
  const [hasMore, setHasMore] = useState(true);
  const [lastStandard, setLastStandard] = useState(null);

  // 상품 상세 정보를 가져오는 함수
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosCredential.get(`/api/products/${productId}`);
        setProduct(response.data.productDetail); // 데이터 설정
        setCheckAuthor(response.data.checkAuthor);
      } catch (err) {
        console.error('상품 정보를 가져오는 중 오류 발생:', err);
        setError('상품 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axiosCredential.get(
          `/api/product-review/product-details/${productId}`,
          {
            params: { size: 20 },
          }
        );
        setReviews(response.data.content);
        setHasMore(response.data.hasNext);
        setLastStandard(response.data.lastStandard);
      } catch (err) {
        console.error('리뷰 정보를 가져오는 중 오류 발생:', err);
        setError('리뷰 정보를 불러오지 못했습니다.');
      }
    };

    const fetchFavoriteStatus = async () => {
      try {
        const response = await axiosCredential.get(`/api/favorites/${productId}`);
        console.log('현재 회원의 좋아요 상태: ', response.data.favorite);
        setIsFavorite(response.data.favorite); // 좋아요 상태 설정
      } catch (err) {
        console.error('좋아요 상태를 가져오는 중 오류 발생:', err);
        setError('좋아요 정보를 불러오지 못했습니다.');
      }
    };

    fetchProduct();
    fetchReviews();
    fetchFavoriteStatus();
  }, [productId]);

  useEffect(() => {
    if (sliderRef.current) {
      document.querySelectorAll('.slick-dots li div').forEach((dot, index) => {
        dot.style.background = index === 0 ? '#333' : '#ccc';
      });
    }
  }, [sliderRef]);
  useEffect(() => {
    if (product && mapRef.current) {
      const map = new naver.maps.Map(mapRef.current, {
        center: new naver.maps.LatLng(product.latitude, product.longitude),
        zoom: 16,
      });

      // 마커 추가
      new naver.maps.Marker({
        position: new naver.maps.LatLng(product.latitude, product.longitude),
        map,
        title: product.title,
      });
    }
  }, [product]);

  const handleToggleFavorite = async (newFavoriteStatus) => {
    try {
      if (newFavoriteStatus) {
        await axiosCredential.post(`/api/favorites/${productId}`);
      } else {
        await axiosCredential.delete(`/api/favorites/${productId}`);
      }
      setIsFavorite(newFavoriteStatus); // 상태 업데이트
    } catch (err) {
      console.error('좋아요 상태 변경 중 오류 발생:', err);
    }
  };

  const handleEditProduct = () => {
    if (product.rentalStatus !== 'AVAILABLE') {
      alert('현재 대여 중인 상품은 수정할 수 없습니다.');
      return;
    }
    navigate(`/products/${productId}/edit`);
  };

  const handleDeleteProduct = async () => {
    if (product.rentalStatus !== 'AVAILABLE') {
      alert('현재 대여 중인 상품은 삭제할 수 없습니다.');
      return;
    }

    try {
      if (!window.confirm('해당 글을 삭제하시겠습니까?')) {
        return;
      }
      await axiosCredential.delete(`/api/products/${productId}`);
      alert('대여 상품이 삭제되었습니다.');
      navigate('/products');
    } catch (err) {
      console.error('글 삭제 중 오류 발생:', err);
      alert('글을 삭제하는 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>상품 정보가 없습니다.</div>;
  }

  const sliderSettings = {
    dots: true,
    infinite: product.productImages.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    appendDots: (dots) => (
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <ul style={{ margin: '0px', padding: '0px' }}>{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: i === 0 ? '#333' : '#ccc',
          margin: '5px',
        }}
      ></div>
    ),
    afterChange: (current) => {
      document.querySelectorAll('.slick-dots li div').forEach((dot, index) => {
        dot.style.background = index === current ? '#333' : '#ccc';
      });
    },
  };

  const fetchMoreData = async () => {
    if (!hasMore) {
      return;
    }

    try {
      const response = await axios.get(`/api/product-review/product-details/${productId}`, {
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
      <div className='layout-container'>
        <div className='layout-wrapper'>
          <Header title='대여 상품' />

          <div className='layout-content'>
            <div className='product-detail'>
              <div>
                <Slider ref={sliderRef} {...sliderSettings} className='product-image-carousel'>
                  {product.productImages.map((image, index) => (
                    <div key={index}>
                      <img
                        src={image.imageUrl}
                        alt={`Product Image ${index + 1}`}
                        className='carousel-image'
                      />
                    </div>
                  ))}
                </Slider>
              </div>

              <div className='seller-info'>
                <div className='seller-details'>
                  <img
                    src={
                      product.seller.sellerImageUrl &&
                      product.seller.sellerImageUrl.startsWith('/images')
                        ? `${import.meta.env.VITE_AXIOS_BASE_URL}${product.seller.sellerImageUrl}`
                        : product.seller.sellerImageUrl
                          ? product.seller.sellerImageUrl
                          : defaultProfileImage
                    }
                    alt={`${product.seller.sellerNickname}'의 프로필 이미지`}
                    className='seller-profile-image'
                  />
                  <div className='seller-text'>
                    <p className='seller-nickname'>{product.seller.sellerNickname}</p>
                  </div>
                </div>
                {checkAuthor && (
                  <div className='product-buttons'>
                    <button className='btn product-edit' onClick={handleEditProduct}>
                      수정
                    </button>
                    <button
                      className='btn product-delete'
                      onClick={handleDeleteProduct}
                      style={{ marginLeft: '10px' }}
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>

              <div className='product-info'>
                <h1 className='product-title'>
                  {product.rentalStatus === 'RENTED' && (
                    <span className='rental-status'>대여중 </span>
                  )}
                  {product.title}
                </h1>
                {product.expectedReturnDate && (
                  <p className='product-return-date'>반납 예정일: {product.expectedReturnDate}</p>
                )}
                <span className='product-category'>{product.category.categoryName}</span>
                <span style={{ paddingLeft: '20px' }}>
                  {new Date(product.updatedAt).toLocaleString()}
                </span>
                <p className='product-description'>{product.description}</p>
                <p className='product-location'>
                  위치: {product.latitude}, {product.longitude}
                </p>
                <p className='product-views'>조회수: {product.viewCount}</p>
              </div>

              <h2 style={{ marginTop: '20px', fontSize: '1.2em', fontWeight: 'bold' }}>
                거래 희망 장소
              </h2>
              <div
                id='map'
                ref={mapRef}
                style={{ width: '100%', height: '400px', marginTop: '20px' }}
              ></div>

              {/*<h2>리뷰</h2>*/}
              <div className='d-flex justify-content-between gap-2 mt-4'>
                <ReviewCount profile={product} />
                <div className='position-relative'>
                  <span className='fs-1 text-warning'>
                    <FaStar size={70} />
                    <span
                      className='position-absolute top-50 start-50 translate-middle text-dark fw-bold'
                      style={{ fontSize: '25px' }}
                    >
                      {product.avgScore.toFixed(1)}
                    </span>{' '}
                  </span>
                </div>
              </div>
              <InfiniteScroll
                dataLength={reviews.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={<p>마지막 기록입니다.</p>}
              >
                <ReviewList reviews={reviews} reviewType={true} />
              </InfiniteScroll>
            </div>
          </div>

          {/* Bottom Navigation */}
          {product && (
            <ProductDetailNavbar
              isFavorite={isFavorite}
              dayPrice={product.dayPrice}
              weekPrice={product.weekPrice}
              onToggleFavorite={handleToggleFavorite}
              product={product}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
