import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {axiosCredential} from "@/utils/axiosCredential";
import Header from "@/components/common/Header"; // Header 컴포넌트 import
import ReviewList from "@/components/review/ReviewList";
import ProductDetailNavbar from "@/components/product/ProductDetailNavbar";

const ProductDetail = () => {
    const { productId } = useParams(); // URL에서 productId 가져오기
    const navigate = useNavigate(); // navigate 초기화
    const [product, setProduct] = useState(null); // 상품 데이터 상태 관리
    const [reviews, setReviews] = useState([]); // 리뷰 데이터 상태 관리
    const [loading, setLoading] = useState(true); // 로딩 상태 관리
    const [error, setError] = useState(null); // 에러 상태 관리
    const [isFavorite, setIsFavorite] = useState(false); // 좋아요 상태 관리

    // 상품 상세 정보를 가져오는 함수
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axiosCredential.get(`/api/products/${productId}`);
                setProduct(response.data); // 데이터 설정
            } catch (err) {
                console.error("상품 정보를 가져오는 중 오류 발생:", err);
                setError("상품 정보를 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await axiosCredential.get(`/api/product-review/product-details/${productId}`);
                setReviews(response.data); // 리뷰 데이터 설정
            } catch (err) {
                console.error("리뷰 정보를 가져오는 중 오류 발생:", err);
                setError("리뷰 정보를 불러오지 못했습니다.");
            }
        };

        const fetchFavoriteStatus = async () => {
            try {
                const response = await axiosCredential.get(`/api/favorites/${productId}`);
                setIsFavorite(response.data.favorite); // 좋아요 상태 설정
            } catch (err) {
                console.error("좋아요 상태를 가져오는 중 오류 발생:", err);
                setError("좋아요 정보를 불러오지 못했습니다.");
            }
        };

        fetchProduct();
        fetchReviews();
        fetchFavoriteStatus();
    }, [productId]);

    const handleToggleFavorite = async (newFavoriteStatus) => {
        try {
            if (newFavoriteStatus) {
                await axiosCredential.post(`/api/favorites/${productId}`);
            } else {
                await axiosCredential.delete(`/api/favorites/${productId}`);
            }
            setIsFavorite(newFavoriteStatus); // 상태 업데이트
        } catch (err) {
            console.error("좋아요 상태 변경 중 오류 발생:", err);
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

    return (
        <>
            <div className='layout-container'>
                <div className='layout-wrapper'>

                    <Header title="상품 상세 정보" />

                    <div className='layout-content'>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate(`/products/${productId}/edit`)}
                        >
                            수정
                        </button>

                        <div className="product-detail">
                            <h1>{product.title}</h1>
                            <p>카테고리: {product.category.categoryName}</p>
                            <p>설명: {product.description}</p>
                            <p>상태: {product.rentalStatus}</p>
                            <p>일일 대여 가격: {product.dayPrice}원</p>
                            <p>
                                주간 대여 가격:{" "}
                                {product.weekPrice ? `${product.weekPrice}원` : "없음"}
                            </p>
                            <p>위치: {product.latitude}, {product.longitude}</p>
                            <p>조회수: {product.viewCount}</p>
                            <p>마지막 업데이트: {new Date(product.updatedAt).toLocaleString()}</p>

                            <h2>판매자 정보</h2>
                            <div className="seller-info">
                                <img
                                    src={product.seller.sellerImageUrl}
                                    alt={`${product.seller.sellerNickname}의 프로필 이미지`}
                                    style={{ width: "100px", borderRadius: "50%" }}
                                />
                                <p>닉네임: {product.seller.sellerNickname}</p>
                            </div>

                            <h2>상품 이미지</h2>
                            <div className="product-images">
                                {product.productImages.map((image, index) => (
                                    <div key={index} style={{ marginBottom: "20px" }}>
                                        <img
                                            src={image.imageUrl}
                                            alt={`Product Image ${index + 1}`}
                                            style={{ width: "200px", margin: "10px" }}
                                        />
                                        <p>썸네일 여부: {image.thumbnail === "Y" ? "썸네일" : "일반 이미지"}</p>
                                    </div>
                                ))}
                            </div>

                            <h2>리뷰</h2>
                            <ReviewList reviews={reviews} />
                        </div>

                    </div>

                    {/* Bottom Navigation */}
                    {product && (
                        <ProductDetailNavbar
                            isFavorite={isFavorite}
                            dayPrice={product.dayPrice}
                            weekPrice={product.weekPrice}
                            onToggleFavorite={handleToggleFavorite}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default ProductDetail;
