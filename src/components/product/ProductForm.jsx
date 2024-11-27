import React, { useState } from "react";
import ProductImages from "./ProductImages";
import CategoryPopup from "../category/CategoryPopup";
import "@/styles/product/ProductForm.css";

const ProductForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        title: "",
        categoryId: null,
        categoryName: "", // 선택된 카테고리 이름 저장
        description: "",
        dayPrice: "",
        weekPrice: "",
        latitude: 0,
        longitude: 0,
        productImages: [], // { file, thumbnail } 형태로 저장
    });

    const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCategorySelect = (categoryId, categoryName) => {
        setFormData({ ...formData, categoryId, categoryName });
    };

    const handleImageUpload = (images) => {
        setFormData({ ...formData, productImages: images }); // 이미지 데이터를 업데이트
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 필수 필드 유효성 검사
        if (!formData.title || !formData.categoryId || !formData.description || !formData.dayPrice) {
            alert("모든 필수 항목을 입력하세요.");
            return;
        }

        // 부모 컴포넌트로 전달
        onSubmit(formData);
    };

    return (
        <form className="product-form" onSubmit={handleSubmit}>
            {/* 이미지 업로드 */}
            <ProductImages onUpload={handleImageUpload} />

            {/* 제목 */}
            <div>
                <label>제목</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="제목"
                    required
                />
            </div>

            {/* 카테고리 선택 */}
            <div>
                <label>카테고리</label>
                <button type="button" onClick={() => setIsCategoryPopupOpen(true)}>
                    {formData.categoryName || "카테고리 선택"}
                </button>
            </div>

            {/* 상세 설명 */}
            <div>
                <label>자세한 설명</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="올릴 상품의 내용을 작성해 주세요."
                    required
                />
            </div>

            {/* 가격 */}
            <div>
                <label>가격</label>
                <input
                    type="number"
                    name="dayPrice"
                    value={formData.dayPrice}
                    onChange={handleChange}
                    placeholder="일 단위 가격"
                    required
                />
                <input
                    type="number"
                    name="weekPrice"
                    value={formData.weekPrice}
                    onChange={handleChange}
                    placeholder="주 단위 가격 (선택)"
                />
            </div>

            <button type="submit">내 물건 등록</button>

            {/* 카테고리 팝업 */}
            <CategoryPopup
                isOpen={isCategoryPopupOpen}
                onClose={() => setIsCategoryPopupOpen(false)}
                onSelectCategory={(categoryId, categoryName) =>
                    handleCategorySelect(categoryId, categoryName)
                }
            />
        </form>
    );
};

export default ProductForm;
