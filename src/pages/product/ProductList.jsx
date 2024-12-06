import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosCredential } from "@/utils/axiosCredential";
import CategoryPopup from '@/components/category/CategoryPopup';
import '@/styles/product/ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [login, setLogin] = useState([]);
    const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState({ id: 1, name: '전체' });
    const [rentalStatus, setRentalStatus] = useState('ALL');
    const [activityArea, setActivityArea] = useState(null); // 활동 지역 정보 상태 추가
    const[search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosCredential.get('/api/products', {
                    params: {
                        categoryId: selectedCategory.id,
                        rentalStatus: rentalStatus,
                        search: search.trim() === '' ? 'ALL' : search
                    }
                });
                setProducts(response.data.products);
                setLogin(response.data.login);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        const fetchActivityArea = async () => {
            try {
                const response = await axiosCredential.get('/api/activity-area');
                setActivityArea(response.data); // 활동 지역 정보 저장
            } catch (error) {
                console.error('Error fetching activity area:', error);
            }
        };

        fetchProducts();
        fetchActivityArea(); // 활동 지역 정보 가져오기
    }, [selectedCategory, rentalStatus, search]);

    const handleProductClick = (productId) => {
        navigate(`/products/${productId}`);
    };

    const handleOpenPopup = () => {
        setIsCategoryPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsCategoryPopupOpen(false);
    };

    const handleSelectCategory = (categoryId, categoryName) => {
        setSelectedCategory({ id: categoryId, name: categoryName });
    };

    const handleRentalStatusChange = (event) => {
        const value = event.target.value;
        setRentalStatus(value);
    };

    const handleActivityAreaClick = () => {
        navigate('/map'); // 활동 지역 설정 페이지로 이동
    };

    const handleSearchInputChange = (event) => {
        setSearch(event.target.value);
    }

    const handleSearch = () => {
        if (search.trim() === '') {
            setSearch('ALL'); // 검색어가 없으면 'ALL'로 설정
        }
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
                        : '활동지역 설정'} ▼
                </div>
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
                <select
                    className='sorting-select'
                    value={rentalStatus}
                    onChange={handleRentalStatusChange}
                >
                    <option value="ALL">전체</option>
                    <option value="AVAILABLE">대여 판매 중</option>
                </select>
                {login && (
                    <button
                        className='sorting-button'
                        onClick={() => navigate('/products/register')}
                    >
                        + 글쓰기
                    </button>
                )}
            </div>
            <div className='product-list p-3'>
                {products.map((product) => (
                    <div
                        className={`product-card d-flex align-items-center p-3 bg-white ${product.expectedReturnDate ? 'rented' : ''}`}
                        key={product.productId}
                        onClick={() => handleProductClick(product.productId)} style={{ cursor: 'pointer' }}>
                        <img
                            src={product.thumbnailUrl || 'https://via.placeholder.com/60'}
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
                                서울 성북구 교동 14
                                <span className='ml-3' style={{ paddingLeft: '30px' }}>{new Date(product.updatedAt).toLocaleDateString()}</span>
                            </p>
                            <p className='product-price mb-0'>
                                {product.dayPrice.toLocaleString()}원 / 일
                            </p>
                            {product.weekPrice && (
                                <p className='product-price mb-0'>
                                    {product.weekPrice.toLocaleString()}원 / 주
                                </p>
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
                                )} {product.favoriteCnt}
                            </p>
                        </div>
                    </div>
                ))}
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
