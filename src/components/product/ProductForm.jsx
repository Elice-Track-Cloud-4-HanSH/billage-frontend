import React, { useState, useEffect } from "react";
import ProductImages from "./ProductImages";
import CategoryPopup from "../category/CategoryPopup";
import LocationPicker from "../map/LocationPicker";
import "@/styles/product/ProductForm.css";

const ProductForm = ({ onSubmit, initialData, existingImages, onExistingImageUpdate, onImageDelete, isEdit }) => {
    const [formData, setFormData] = useState(initialData || {
        title: "",
        categoryId: null,
        categoryName: "",
        description: "",
        dayPrice: "",
        weekPrice: "",
        latitude: null,
        longitude: null,
        productImages: [],
    });

    const [errors, setErrors] = useState({
        dayPrice: "",
        weekPrice: "",
    });

    const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);
    const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
    const [locationText, setLocationText] = useState("거래 희망 장소 선택");

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            if (initialData.latitude && initialData.longitude) {
                setLocationText(
                    `선택 완료 (위도: ${initialData.latitude.toFixed(5)}, 경도: ${initialData.longitude.toFixed(5)})`
                );
            }
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "dayPrice" || name === "weekPrice") {
            // 숫자 유효성 검사
            if (value === "" || /^[0-9\b]+$/.test(value)) {
                setFormData({ ...formData, [name]: value });
                setErrors({ ...errors, [name]: "" }); // 에러 메시지 제거
            } else {
                setErrors({ ...errors, [name]: "가격은 숫자만 입력 가능합니다." });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleCategorySelect = (categoryId, categoryName) => {
        setFormData({ ...formData, categoryId, categoryName });
    };

    const handleLocationSelect = (location) => {
        if (location && location.latitude !== undefined && location.longitude !== undefined) {
            setFormData({ ...formData, latitude: location.latitude, longitude: location.longitude });
            setLocationText(
                `선택 완료 (위도: ${location.latitude.toFixed(5)}, 경도: ${location.longitude.toFixed(5)})`
            );
            setIsLocationPickerOpen(false);
        } else {
            console.error("잘못된 위치 데이터:", location);
            alert("유효한 위치를 선택해주세요.");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title || !formData.categoryId || !formData.description || !formData.dayPrice) {
            alert("모든 필수 항목을 입력하세요.");
            return;
        }

        if (errors.dayPrice || errors.weekPrice) return;

        onSubmit(formData);
    };

    return (
        <form className="product-form" onSubmit={handleSubmit}>
            <ProductImages
                initialImages={existingImages}
                onExistingImageUpdate={onExistingImageUpdate}
                onNewImageUpload={(newImages) => setFormData({ ...formData, productImages: newImages })}
                onImageDelete={onImageDelete}
            />

            <div>
                <div className="product-form-label">
                    <label>제목</label>
                </div>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="제목"
                    required
                />
            </div>

            <div style={{textAlign: "left"}}>
                <div className="product-form-label">
                    <label>카테고리</label>
                </div>
                <button type="button" className="product-form-button" onClick={() => setIsCategoryPopupOpen(true)}>
                    {formData.categoryName || "카테고리 선택"}
                </button>
            </div>

            <div>
                <div className="product-form-label">
                    <label>자세한 설명</label>
                </div>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="올릴 상품의 내용을 작성해 주세요."
                    required
                />
            </div>

            <div style={{textAlign: "left"}}>
                <div className="product-form-label">
                    <label>거래 희망 장소</label>
                </div>
                <button type="button" className="product-form-button" onClick={() => setIsLocationPickerOpen(true)}>
                    {locationText}
                </button>
            </div>
            {isLocationPickerOpen && (
                <LocationPicker
                    onLocationSelect={handleLocationSelect}
                    onCancel={() => setIsLocationPickerOpen(false)}
                />
            )}

            <div>
                <div className="product-form-label">
                    <label>가격</label>
                </div>
                <div className="price-container">
                    <div className="price-unit">
                        <input
                            type="text"
                            name="dayPrice"
                            value={formData.dayPrice}
                            onChange={handleChange}
                            placeholder="가격을 입력해 주세요."
                            required
                        />
                        <span>/ 일</span>
                    </div>
                    {errors.dayPrice && <div style={{ color: "red", fontSize: "0.9rem", textAlign: "left", paddingLeft: "40px" }}>{errors.dayPrice}</div>}
                    <div className="price-unit">
                        <input
                            type="text"
                            name="weekPrice"
                            value={formData.weekPrice}
                            onChange={handleChange}
                            placeholder="가격을 입력해 주세요. (선택)"
                        />
                        <span>/ 주</span>
                    </div>
                    {errors.weekPrice && <div style={{ color: "red", fontSize: "0.9rem", textAlign: "left", paddingLeft: "40px" }}>{errors.weekPrice}</div>}
                </div>
            </div>

            <button type="submit" className="product-form-button">{isEdit ? "수정" : "등록"}</button>

            <CategoryPopup
                isOpen={isCategoryPopupOpen}
                onClose={() => setIsCategoryPopupOpen(false)}
                onSelectCategory={handleCategorySelect}
            />


        </form>
    );
};

export default ProductForm;
