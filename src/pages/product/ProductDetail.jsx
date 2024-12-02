import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/common/Header"; // Header 컴포넌트 import

const ProductDetail = () => {
    const { productId } = useParams(); // URL에서 productId 가져오기
    const navigate = useNavigate(); // navigate 초기화
    const [product, setProduct] = useState(null); // 상품 데이터 상태 관리
    const [loading, setLoading] = useState(true); // 로딩 상태 관리
    const [error, setError] = useState(null); // 에러 상태 관리

    // 상품 상세 정보를 가져오는 함수
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`/api/products/${productId}`);
                setProduct(response.data); // 데이터 설정
                setLoading(false); // 로딩 완료
            } catch (err) {
                console.error("상품 정보를 가져오는 중 오류 발생:", err);
                setError("상품 정보를 불러오지 못했습니다.");
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

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
            <Header title="상품 상세 정보" />

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
                <div className="reviews">
                    {product.reviews.length > 0 ? (
                        product.reviews.map((review, index) => (
                            <div key={index} className="review" style={{ borderBottom: "1px solid #ddd", marginBottom: "10px", paddingBottom: "10px" }}>
                                <p>리뷰 ID: {review.reviewId}</p>
                                <p>평점: {review.score}점</p>
                                <p>내용: {review.content}</p>
                                <p>작성자 ID: {review.id}</p>
                                {review.imageUrl && (
                                    <img
                                        src={review.imageUrl}
                                        alt="작성자 프로필 이미지"
                                        style={{ width: "100px", marginTop: "10px" }}
                                    />
                                )}
                                <p>내용: {review.subject}</p>
                            </div>
                        ))
                    ) : (
                        <p>리뷰가 없습니다.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProductDetail;
