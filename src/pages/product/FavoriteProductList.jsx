import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosCredential } from "@/utils/axiosCredential";
import '@/styles/product/ProductList.css';
import Header from "@/components/common/Header.jsx";
import Loading from '@/components/common/Loading';

const FavoriteProductList = () => {
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [isLast, setIsLast] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const observerRef = useRef(null);
    const navigate = useNavigate();

    const fetchFavoriteProducts = async () => {
        if (isLast || isLoading) return;

        setIsLoading(true);
        const pageSize = 10;

        console.log(`Fetching page: ${page}`); // 페이지 번호 확인
        try {
            const response = await axiosCredential.get('/api/favorites', {
                params: { page, pageSize },
            });
            const data = response.data;

            console.log(`Fetched data length: ${data.length}`); // 반환된 데이터 크기 확인

            if (data.length < pageSize) setIsLast(true);
            setFavoriteProducts((prev) => [...prev, ...data]);
            setPage((prev) => prev + 1); // 다음 페이지로 증가
        } catch (error) {
            console.error('Error fetching favorite products:', error);
            setIsLast(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!observerRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchFavoriteProducts();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(observerRef.current);

        return () => {
            observer.disconnect();
        };

    }, [page, isLast, isLoading]);

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

                {!isLoading && !isLast && <div ref={observerRef} style={{ margin: '1px' }} />}
                <Loading isLoading={isLoading} />
                {isLast && <p className='mx-auto'>마지막 상품입니다</p>}
            </div>
        </div>
    );
};

export default FavoriteProductList;
