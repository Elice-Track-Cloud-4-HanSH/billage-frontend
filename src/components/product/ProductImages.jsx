import React, { useState, useEffect } from "react";
// import "@/styles/product/ProductForm.css";
import "@/styles/product/ProductImages.css";

const ProductImages = ({ initialImages, onExistingImageUpdate, onNewImageUpload, onImageDelete }) => {
    const [existingImages, setExistingImages] = useState(initialImages); // 기존 이미지
    const [newImages, setNewImages] = useState([]); // 새로 추가한 이미지
    const [thumbnailIndex, setThumbnailIndex] = useState(null); // 썸네일 인덱스

    useEffect(() => {
        if (initialImages.length > 0 && thumbnailIndex === null) {
            // 초기 이미지가 존재하지만 썸네일 인덱스가 설정되지 않았을 경우
            setExistingImages(initialImages);
            const initialThumbnailIndex = initialImages.findIndex((img) => img.thumbnail === "Y");
            setThumbnailIndex(initialThumbnailIndex >= 0 ? initialThumbnailIndex : null);
        }
    }, [initialImages]);

    useEffect(() => {
        console.log("thumbnailIndex 변경됨:", thumbnailIndex);
    }, [thumbnailIndex]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newImagesToAdd = files.map((file, index) => ({
            file,
            thumbnail: "N",
        }));

        let updatedNewImages = [...newImages, ...newImagesToAdd];

        // 썸네일이 없을 경우 첫 번째 이미지가 썸네일
        if(thumbnailIndex === null && updatedNewImages.length > 0) {
            updatedNewImages[0].thumbnail = "Y";
            setThumbnailIndex(existingImages.length + 0); // 기존 이미지가 없으면 0번 인덱스가 썸네일
        }

        setNewImages(updatedNewImages);
        onNewImageUpload(updatedNewImages);
    };

    const handleThumbnailChange = (index, isExistingImage) => {
        const existingImagesLength = existingImages.length;

        let updatedExistingImages = [...existingImages];
        let updatedNewImages = [...newImages];

        if (isExistingImage) {
            setThumbnailIndex(index);
            console.log("넘겨준 썸네일 인덱스: ", index);
            console.log("저장한 썸네일 인덱스: ", thumbnailIndex);

            // 기존 이미지 썸네일 업데이트
            updatedExistingImages = existingImages.map((img, idx) => ({
                ...img,
                thumbnail: idx === index ? "Y" : "N",
            }));

            // 새로운 이미지 썸네일 정보 업데이트
            updatedNewImages = newImages.map((img) => ({
                ...img,
                thumbnail : "N",
            }));

            setExistingImages(updatedExistingImages);
            setNewImages(updatedNewImages);
            console.log("기존 이미지 썸네일 확인: ", updatedExistingImages);
            console.log("새 이미지 썸네일 확인: ", updatedNewImages);
            onExistingImageUpdate(updatedExistingImages);
            onNewImageUpload(updatedNewImages);
        } else {
            const newIndex = index + existingImagesLength;
            setThumbnailIndex(newIndex);
            console.log("넘겨준 썸네일 인덱스: ", newIndex);
            console.log("저장한 썸네일 인덱스: ", thumbnailIndex);

            // 기존 이미지 썸네일 정보 업데이트
            updatedExistingImages = existingImages.map((img) => ({
                ...img,
                thumbnail: "N",
            }));

            // 새로운 이미지 썸네일 정보 업데이트
            updatedNewImages = newImages.map((img, idx) => ({
                ...img,
                thumbnail: idx === index ? "Y" : "N",
            }));

            setExistingImages(updatedExistingImages);
            setNewImages(updatedNewImages);
            console.log("기존 이미지 썸네일 확인: ", updatedExistingImages);
            console.log("새 이미지 썸네일 확인: ", updatedNewImages);
            onExistingImageUpdate(updatedExistingImages);
            onNewImageUpload(updatedNewImages);
        }
    };

    const handleExistingImageDelete = (index) => {
        const imageToDelete = existingImages[index];
        const updatedExistingImages = existingImages.filter((_, idx) => idx !== index);

        setExistingImages(updatedExistingImages); // 기존 이미지에서 이미지 삭제 후 업데이트

        console.log("기존이미지개수: ", existingImages.length);
        console.log("새이미지개수: ", newImages.length);

        //만약 삭제한 이미지까 썸네일이었다면 첫번째 이미지가 썸네일
        if(index === thumbnailIndex) {
            if(updatedExistingImages.length > 0) {
                setThumbnailIndex(0);
                updatedExistingImages[0].thumbnail = "Y";
                setExistingImages(updatedExistingImages);
                // onExistingImage(updatedExistingImages);
            } else if (newImages.length > 0) {
                setThumbnailIndex(existingImages.length); // 새로운 이미지의 첫 번째
                const updatedNewImages = [...newImages];
                updatedNewImages[0].thumbnail = "Y";
                setNewImages(updatedNewImages);
                onNewImageUpload(updatedNewImages);
            } else {
                setThumbnailIndex(null);
            }
        } else if (index < thumbnailIndex) {
            // 삭제된 이미지가 썸네일 이전의 이미지일 경우 썸네일 인덱스 조정
            setThumbnailIndex((preIndex) => preIndex - 1);
        }

        onExistingImageUpdate(updatedExistingImages);
        onImageDelete(imageToDelete);
    };

    const handleNewImageDelete = (index) => {
        const updatedNewImages = newImages.filter((_, idx) => idx !== index);
        setNewImages(updatedNewImages);

        //만약 삭제한 이미지가 썸네일이었다면 첫번째 이미지가 썸네일
        if(index + existingImages.length === thumbnailIndex) {
            if(existingImages.length > 0) {
                setThumbnailIndex(0);
                const updatedExistingImages = [...existingImages];
                updatedExistingImages[0].thumbnail = "Y";
                setExistingImages(updatedExistingImages);
                onExistingImageUpdate(updatedExistingImages);
            } else if(updatedNewImages.length > 0) {
                setThumbnailIndex(existingImages.length);
                updatedNewImages[0].thumbnail = "Y";
                setNewImages(updatedNewImages);
                onNewImageUpload(updatedNewImages);
            } else {
                setThumbnailIndex(null);
            }
        } else if (index + existingImages < thumbnailIndex) {
            setThumbnailIndex((prevIndex) => prevIndex - 1);
        }

        onNewImageUpload(updatedNewImages);
    };

    return (
        <div>
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
            />
            <div style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}>
                {existingImages.map((image, index) => (
                    <div key={index} style={{ marginRight: "10px", textAlign: "center" }}>
                        <img
                            src={image.imageUrl}
                            alt={`preview-${index}`}
                            style={{ width: "100px", height: "100px", display: "block", marginBottom: "5px" }}
                        />
                        <label>
                            <input
                                type="radio"
                                name="thumbnail"
                                checked={index === thumbnailIndex}
                                onChange={() => handleThumbnailChange(index, true)}
                            />
                            썸네일
                        </label>
                        <button
                            className= "product-image-delete-btn"
                            onClick={() => handleExistingImageDelete(index)}
                        >
                            삭제
                        </button>
                    </div>
                ))}

                {newImages.map((image, index) => (
                    <div key={`new-${index}`} style={{ marginRight: "10px", textAlign: "center" }}>
                        <img
                            src={URL.createObjectURL(image.file)}
                            alt={`preview-new-${index}`}
                            style={{ width: "100px", height: "100px", display: "block", marginBottom: "5px" }}
                        />
                        <label>
                            <input
                                type="radio"
                                name="thumbnail"
                                checked={index + existingImages.length === thumbnailIndex}
                                onChange={() => handleThumbnailChange(index, false)}
                            />
                            썸네일
                        </label>
                        <button
                            className= "product-image-delete-btn"
                            onClick={() => handleNewImageDelete(index)}>
                            삭제
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductImages;
