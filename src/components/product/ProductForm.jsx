import React, { useState, useEffect } from "react";
import ProductImages from "./ProductImages";
import CategoryPopup from "../category/CategoryPopup";
import "@/styles/product/ProductForm.css";

const ProductForm = ({ onSubmit, initialData, existingImages, onExistingImageUpdate, onImageDelete, isEdit }) => {
    const [formData, setFormData] = useState(initialData || {
        title: "",
        categoryId: null,
        categoryName: "",
        description: "",
        dayPrice: "",
        weekPrice: "",
        latitude: 0,
        longitude: 0,
        productImages: [],
    });

    const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);

    useEffect(() => {
       if (initialData) {
           setFormData(initialData);
       }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCategorySelect = (categoryId, categoryName) => {
        setFormData({ ...formData, categoryId, categoryName });
    };

    const handleImageUpload = (newImages) => {
        setFormData({ ...formData, productImages: newImages });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title || !formData.categoryId || !formData.description || !formData.dayPrice) {
            alert("모든 필수 항목을 입력하세요.");
            return;
        }

        onSubmit(formData);
    };

    return (
        <form className="product-form" onSubmit={handleSubmit}>
            <ProductImages
                initialImages={existingImages} // 부모로부터 받아온 기존 이미지
                onExistingImageUpdate={onExistingImageUpdate} // 기존 이미지 썸네일 변경
                onNewImageUpload={handleImageUpload} // 새로 추가된 이미지
                onImageDelete={onImageDelete} // 삭제할 이미지
            />

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

            <div>
                <label>카테고리</label>
                <button type="button" onClick={() => setIsCategoryPopupOpen(true)}>
                    {formData.categoryName || "카테고리 선택"}
                </button>
            </div>

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

            <button type="submit">{isEdit ? "수정" : "등록"}</button>

            <CategoryPopup
                isOpen={isCategoryPopupOpen}
                onClose={() => setIsCategoryPopupOpen(false)}
                onSelectCategory={handleCategorySelect}
            />
        </form>
    );
};

export default ProductForm;
