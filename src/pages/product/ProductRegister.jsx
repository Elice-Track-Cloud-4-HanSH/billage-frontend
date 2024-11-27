import React from "react";
import Header from "../../components/common/Header";
import ProductForm from "../../components/product/ProductForm";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 리다이렉트를 위해 필요
import "@/styles/product/ProductForm.css";

const ProductRegister = () => {
    const navigate = useNavigate(); // 리다이렉트를 위한 useNavigate 훅 사용

    const handleSubmit = async (formData) => {
        const data = new FormData();

        // FormData에 데이터 추가
        data.append("title", formData.title);
        data.append("categoryId", formData.categoryId);
        data.append("description", formData.description);
        data.append("dayPrice", formData.dayPrice);
        if (formData.weekPrice) data.append("weekPrice", formData.weekPrice);
        if (formData.latitude) data.append("latitude", formData.latitude);
        if (formData.longitude) data.append("longitude", formData.longitude);

        // 이미지 처리
        formData.productImages.forEach((image, index) => {
            data.append(`productImages[${index}].imageUrl`, image.file); // 파일 추가
            data.append(`productImages[${index}].thumbnail`, image.thumbnail); // 썸네일 여부 추가
        });

        try {
            const response = await axios.post("/api/products", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("등록 성공:", response.data);

            // 반환된 productId로 상세 페이지로 이동
            const { productId } = response.data;
            if (productId) {
                navigate(`/product/${productId}`);
            }
        } catch (error) {
            console.error("등록 실패:", error);
        }
    };

    return (
        <>
            <Header title="대여 상품 등록" />
            <div className="layout-container">
                <div className="layout-wrapper">
                    <div className="layout-content">
                        <ProductForm onSubmit={handleSubmit} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductRegister;
