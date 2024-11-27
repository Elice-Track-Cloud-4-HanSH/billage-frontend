import React, { useState } from "react";
import "@/styles/product/ProductForm.css";

const ProductImages = ({ onUpload }) => {
    const [images, setImages] = useState([]);
    const [thumbnailIndex, setThumbnailIndex] = useState(0); // 기본 썸네일 인덱스를 첫 번째로 설정

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);

        // 부모 컴포넌트로 이미지와 썸네일 정보를 전달
        const imageData = files.map((file, index) => ({
            file,
            thumbnail: index === 0 ? "Y" : "N", // 첫 번째 이미지는 기본으로 썸네일
        }));
        onUpload(imageData);
    };

    const handleThumbnailChange = (index) => {
        setThumbnailIndex(index);

        // 썸네일 변경 시 데이터를 업데이트하여 부모 컴포넌트로 전달
        const updatedImages = images.map((file, idx) => ({
            file,
            thumbnail: idx === index ? "Y" : "N", // 선택된 인덱스만 "Y"
        }));
        onUpload(updatedImages);
    };

    return (
        <div>
            <label>이미지</label>
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
            />
            <div style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}>
                {images.map((file, index) => (
                    <div key={index} style={{ marginRight: "10px", textAlign: "center" }}>
                        <img
                            src={URL.createObjectURL(file)}
                            alt={`preview-${index}`}
                            style={{ width: "50px", height: "50px", display: "block", marginBottom: "5px" }}
                        />
                        <label>
                            <input
                                type="radio" // 체크박스 대신 라디오 버튼 사용 (하나만 선택되도록 보장)
                                checked={index === thumbnailIndex}
                                onChange={() => handleThumbnailChange(index)}
                            />
                            썸네일
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductImages;
