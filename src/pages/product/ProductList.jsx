import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosCredential } from "@/utils/axiosCredential";
import CategoryPopup from '@/components/category/CategoryPopup';
import '@/styles/product/ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState({ id: 1, name: '전체' });
    const [rentalStatus, setRentalStatus] = useState('ALL');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosCredential.get('/api/products', {
                    params: {
                        categoryId: selectedCategory.id,
                        rentalStatus: rentalStatus
                    }
                });
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [selectedCategory, rentalStatus]);

    const handleProductClick = (productId) => {
        navigate(`/products/${productId}`);
    }

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

    return (
        <div className='product-list-container'>
            <div className='search-area d-flex align-items-center justify-content-between p-3 bg-white border-bottom'>
                <div className='region-select'>행정구역 ▼</div>
                <input
                    type='text'
                    className='search-input flex-grow-1 mx-2 p-2'
                    placeholder='「 검색 내용 입력 」'
                />
                <img
                    src='https://via.placeholder.com/40'
                    alt='Profile'
                    className='profile-img rounded-circle'
                />
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
                <button className='sorting-button'>정렬 기준 2</button>
            </div>
            <div className='product-list p-3'>
                {products.map((product) => (
                    <div className='product-card d-flex align-items-center mb-3 p-3 bg-white border' key={product.productId}
                    onClick={() => handleProductClick(product.productId)} style={{ cursor: 'pointer' }}>
                        <img
                            src={product.thumbnailUrl || 'https://via.placeholder.com/60'}
                            alt={product.title}
                            className='product-img rounded'
                            style={{ width: '60px', height: '60px' }}
                        />
                        <div className='product-info flex-grow-1 ml-3'>
                            <h5 className='product-title mb-1'>{product.title}</h5>
                            <p className='product-location text-muted mb-1'>
                                서울 성북구 교동 14
                                <span className='ml-3'>수정일자: {new Date(product.updatedAt).toLocaleDateString()}</span>
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
