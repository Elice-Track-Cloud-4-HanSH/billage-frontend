import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosCredential } from "@/utils/axiosCredential";
import '@/styles/product/ProductList.css';
import Header from "@/components/common/Header.jsx";

const FavoriteProductList = () => {
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavoriteProducts = async () => {
            try {
                const response = await axiosCredential.get('/api/favorites');
                setFavoriteProducts(response.data);
            } catch (error) {
                console.error('Error fetching favorite products:', error);
            }
        };

        fetchFavoriteProducts();
    }, []);

    const handleProductClick = (productId) => {
        navigate(`/products/${productId}`);
    };

    return (
        <div className='favorite-product-list-container'>
            <Header title="관심 내역" />
            <div className='product-list p-3'>
                {favoriteProducts.map((product) => (
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
                                <i className='bi bi-heart-fill text-danger'></i> {product.favoriteCnt}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FavoriteProductList;
