import React, { useState, useEffect } from "react";
import axios from "axios";
import "@/styles/category/CategoryPopup.css";

const CategoryPopup = ({isOpen, onClose, onSelectCategory}) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (isOpen) {
            axios
                .get("/api/categories")
                .then((response) => setCategories(response.data))
                .catch((error) => console.error("Error fetching categories:", error));
        }
    }, [isOpen]);

    if (!isOpen) return null; // 팝업이 열리지 않았으면 렌더링하지 않음

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <div className="categories-grid">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="category-item"
                            onClick={() => {
                                onSelectCategory(category.id, category.name); // 카테고리 ID와 이름 전달
                                onClose();
                            }}
                        >
                            <img src={category.imageUrl} alt={category.name}/>
                            <p style={{fontWeight: 'bold'}}>{category.name}</p>
                        </div>
                    ))}
                </div>
                <button className="close-button" onClick={onClose}>
                    닫기
                </button>
            </div>
        </div>
    );
};

export default CategoryPopup;
