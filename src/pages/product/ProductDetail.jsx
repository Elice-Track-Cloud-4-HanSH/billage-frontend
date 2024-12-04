import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosCredential } from "@/utils/axiosCredential";
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
    const [checkAuthor, setCheckAuthor] = useState(false); // 작성자 확인 상태 관리

    // 상품 상세 정보를 가져오는 함수
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axiosCredential.get(`/api/products/${productId}`);
                setProduct(response.data.productDetail); // 데이터 설정
                setCheckAuthor(response.data.checkAuthor);
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
                console.log("현재 회원의 좋아요 상태: ", response.data.favorite);
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

    const handleEditProduct = () => {
        if (product.rentalStatus !== "AVAILABLE") {
            alert("현재 대여 중인 상품은 수정할 수 없습니다.");
            return;
        }
        navigate(`/products/${productId}/edit`);
    };

    const handleDeleteProduct = async () => {
        if (product.rentalStatus !== "AVAILABLE") {
            alert("현재 대여 중인 상품은 삭제할 수 없습니다.");
            return;
        }

        try {
            if (!window.confirm('해당 글을 삭제하시겠습니까?')) {
                return;
            }
            await axiosCredential.delete(`/api/products/${productId}`);
            alert("상품이 삭제되었습니다.");
            navigate("/products");
        } catch (err) {
            console.error("글 삭제 중 오류 발생:", err);
            alert("글을 삭제하는 중 오류가 발생했습니다.");
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
                        {checkAuthor && (
                            <div>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleEditProduct}
                                >
                                    수정
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={handleDeleteProduct}
                                    style={{ marginLeft: "10px" }}
                                >
                                    삭제
                                </button>
                            </div>
                        )}


                        <div className="product-detail">
                            <h1>{product.title}</h1>
                            <p>카테고리: {product.category.categoryName}</p>
                            <p>설명: {product.description}</p>
                            <p>상태: {product.rentalStatus}</p>
                            {product.expectedReturnDate && (
                                <p>반납 예정일: {product.expectedReturnDate}</p>
                            )}
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
