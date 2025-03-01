import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosCredential } from '@/utils/axiosCredential';
import CategoryPopup from '@/components/category/CategoryPopup';
import '@/styles/product/ProductList.css';
import Loading from '@/components/common/Loading';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [login, setLogin] = useState([]);
  const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({ id: 1, name: '전체' });
  const [rentalStatus, setRentalStatus] = useState('ALL');
  const [activityArea, setActivityArea] = useState(null); // 활동 지역 정보 상태 추가
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(''); // 디바운스된 검색어
  const [page, setPage] = useState(0);
  const [isLast, setIsLast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef(null);
  const navigate = useNavigate();

  const fetchProducts = async (reset = false) => {
    if (isLast || isLoading) return;

    setIsLoading(true);
    const pageSize = 10;

    try {
      const response = await axiosCredential.get('/api/products', {
        params: {
          categoryId: selectedCategory.id,
          rentalStatus: rentalStatus,
          search: search.trim() === '' ? 'ALL' : search,
          page,
          pageSize,
        },
      });

      const data = response.data.products;

      if (data.length < pageSize) setIsLast(true);

      setProducts((prev) => {
        if (reset) return data; // 초기화 요청이면 새 데이터로 덮어씌움
        const existingIds = prev.map((product) => product.productId);
        const newProducts = data.filter((product) => !existingIds.includes(product.productId));
        return [...prev, ...newProducts];
      });

      setLogin(response.data.login);
      if (!reset) setPage((prev) => prev + 1); // 초기화가 아니면 페이지 증가
    } catch (error) {
      console.error('Error fetching products:', error);
      setIsLast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActivityArea = async () => {
    try {
      const response = await axiosCredential.get('/api/activity-area');
      setActivityArea(response.data); // 활동 지역 정보 저장
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setActivityArea(null); // 활동 지역을 null로 설정
      } else if (error.response && error.response.status === 401) {
        setActivityArea(null); // 활동 지역을 null로 설정
      } else {
        console.error('Error fetching activity area:', error);
      }
    }
  };
  const handleDeleteActivityArea = async () => {
    try {
      await axiosCredential.delete('/api/activity-area'); // 활동 지역 삭제 요청
      setActivityArea(null); // 활동 지역 상태 초기화
      alert('활동 지역이 삭제되었습니다.');

      // 상품 리스트를 초기화하고 새로 로드
      handleFilterChange();
    } catch (error) {
      console.error('활동 지역 삭제 실패:', error);
      alert('활동 지역 삭제 중 오류가 발생했습니다.');
    }
  };

  // 디바운스를 적용하여 검색어 업데이트
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search.trim() === '' ? 'ALL' : search);
    }, 300); // 300ms 딜레이

    return () => {
      clearTimeout(handler); // 이전 타이머 클리어
    };
  }, [search]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchProducts();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.disconnect();
    };
  }, [page, isLast, isLoading]); // 페이지 상태 변경 시만 작동

  // 필터 변경 시 초기화 및 데이터 로드
  useEffect(() => {
    fetchActivityArea(); // 활동 지역 정보 가져오기
  }, []); // 필터 상태 변경 시만 작동(디바운스된 검색어 기준)

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleOpenPopup = () => {
    setIsCategoryPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsCategoryPopupOpen(false);
  };

  const handleFilterChange = () => {
    setProducts([]);
    setPage(0);
    setIsLast(false);
  }

  const handleSelectCategory = (categoryId, categoryName) => {
    setSelectedCategory({ id: categoryId, name: categoryName });
    handleFilterChange();
  };

  const handleRentalStatusChange = (event) => {
    const value = event.target.value;
    setRentalStatus(value);
    handleFilterChange();
  };

  const handleActivityAreaClick = () => {
    navigate('/map'); // 활동 지역 설정 페이지로 이동
  };

  const handleSearchInputChange = (event) => {
    setSearch(event.target.value);
    handleFilterChange();
  };

  const handleSearch = () => {
    if (search.trim() === '') {
      setSearch('ALL'); // 검색어가 없으면 'ALL'로 설정
    }
    handleFilterChange();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className='product-list-container'>
      <div className='search-area d-flex align-items-center justify-content-between p-3 bg-white border-bottom'>
        <div
          className='region-select'
          onClick={handleActivityAreaClick}
          style={{ cursor: 'pointer' }}
        >
          {activityArea
            ? `${activityArea.sidoNm} ${activityArea.sggNm} ${activityArea.emdNm}`
            : '활동지역 설정'}{' '}
          ▼
        </div>
        {activityArea && ( // 활동 지역이 설정된 경우에만 삭제 버튼 표시
          <button className='btn btn-danger delete-button' onClick={handleDeleteActivityArea}>
            삭제
          </button>
        )}

        <input
          type='text'
          className='search-input flex-grow-1 mx-2 p-2'
          placeholder='검색 내용 입력'
          value={search}
          onChange={handleSearchInputChange}
          onKeyUp={handleKeyPress}
        />
        <button className='btn btn-link search-button' onClick={handleSearch}>
          <i className='fa fa-search favorite-icon'></i>
        </button>
      </div>
      <div className='sorting-criteria p-2 d-flex justify-content-between bg-light'>
        <button className='sorting-button' onClick={handleOpenPopup}>
          {selectedCategory.name}
        </button>
        <select className='sorting-select' value={rentalStatus} onChange={handleRentalStatusChange}>
          <option value='ALL'>전체</option>
          <option value='AVAILABLE'>대여 판매 중</option>
        </select>
        {login && (
          <button className='sorting-button' onClick={() => navigate('/products/register')}>
            + 글쓰기
          </button>
        )}
      </div>
      <div className='product-list p-3'>
        {products.map((product) => (
          <div
            className={`product-card d-flex align-items-center p-3 bg-white ${product.expectedReturnDate ? 'rented' : ''}`}
            key={product.productId}
            onClick={() => handleProductClick(product.productId)}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={product.thumbnailUrl || 'https://elice-billage.duckdns.org/images/default-product.png'}
              alt={product.title}
              className='product-img rounded'
            />
            {product.expectedReturnDate && (
              <div className='expected-return-tag'>
                대여 중
                <p className='return-date mb-1'>
                  {new Date(product.expectedReturnDate).toLocaleDateString()}
                </p>
              </div>
            )}
            <div className='product-info flex-grow-1 ml-3'>
              <h5 className='product-title mb-1'>{product.title}</h5>
              <p className='product-location text-muted mb-1'>
                {product.address || '주소 정보 없음'}
                <span className='ml-3' style={{ paddingLeft: '30px' }}>
                  {new Date(product.updatedAt).toLocaleDateString()}
                </span>
              </p>
              <p className='product-price mb-0'>{product.dayPrice.toLocaleString()}원 / 일</p>
              {product.weekPrice && (
                <p className='product-price mb-0'>{product.weekPrice.toLocaleString()}원 / 주</p>
              )}
            </div>
            <div className='product-stats text-right'>
              <p className='view-count mb-1'>
                <i className='bi bi-person'></i> {product.viewCount}
              </p>
              <p className='like-count mb-0'>
                {product.favorite ? (
                  <i className='bi bi-heart-fill text-danger'></i>
                ) : (
                  <i className='bi bi-heart'></i>
                )}{' '}
                {product.favoriteCnt}
              </p>
            </div>
          </div>
        ))}

        {!isLoading && !isLast && <div ref={observerRef} style={{ height: '10px' }} />}
        <Loading isLoading={isLoading} />
        {isLast && <p className='mx-auto'>마지막 상품입니다</p>}
      </div>

      <CategoryPopup
        isOpen={isCategoryPopupOpen}
        onClose={handleClosePopup}
        onSelectCategory={handleSelectCategory}
      />
    </div>
  );
};

export default ProductList;
