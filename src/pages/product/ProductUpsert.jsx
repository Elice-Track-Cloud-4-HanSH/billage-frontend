import React, { useEffect, useState } from "react";
import Header from "../../components/common/Header";
import ProductForm from "../../components/product/ProductForm";
import {axiosCredential} from "@/utils/axiosCredential";
import { useNavigate, useParams } from "react-router-dom"; // 리다이렉트를 위해 필요
import "@/styles/product/ProductForm.css";

// 상품 등록 및 수정 페이지 (통합)
const ProductUpsert = ({ isEdit }) => {
    const { productId } = useParams(); // URL에서 productId 가져오기 (수정 시 필요)
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState(null);
    const [existingImages, setExistingImages] = useState([]);
    const [deletedImages, setDeletedImages] = useState([]); // 삭제할 이미지 저장

    useEffect(() => {
        if (isEdit && productId) {
            // 초기 상품 정보 가져오기 (수정 시)
            const fetchProduct = async () => {
                try {
                    const response = await axiosCredential.get(`/api/products/${productId}`);
                    const product = response.data.productDetail;
                    setInitialData({
                        title: product.title,
                        categoryId: product.category.categoryId,
                        categoryName: product.category.categoryName,
                        description: product.description,
                        dayPrice: product.dayPrice,
                        weekPrice: product.weekPrice,
                        latitude: product.latitude !== null ? product.latitude : 0,
                        longitude: product.longitude !== null ? product.longitude : 0,
                        productImages: [], // 새로 추가한 이미지
                    });
                    setExistingImages(product.productImages);
                } catch (error) {
                    console.error("상품 정보를 불러오는 중 오류 발생:", error);
                }
            };

            fetchProduct();
        } else {
            setInitialData({
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
        }
    }, [isEdit, productId]);


    // formDate(새로 추가한 이미지), 삭제한 이미지, 기존 이미지
    const handleSubmit = async (formData) => {
        console.log("받은 formData: ", formData);
        console.log("부모에 저장된 기존 이미지: ", existingImages);
        console.log("부모에 저장된 삭제할 이미지: ", deletedImages);

        try {
            if (isEdit) {
                // 수정 API 호출
                // 먼저 삭제할 이미지 API 호출
                console.log("받아온? 삭제할 이미지: ", deletedImages);
                if (deletedImages.length > 0) {
                    await axiosCredential.delete(`/api/products/images?productId=${productId}`, {
                        data: deletedImages,
                    });
                }

                // 수정할 데이터 구성
                const updateData = new FormData();
                updateData.append("title", formData.title);
                updateData.append("categoryId", formData.categoryId);
                updateData.append("description", formData.description);
                updateData.append("dayPrice", formData.dayPrice);
                if (formData.weekPrice) updateData.append("weekPrice", formData.weekPrice);
                if (formData.latitude) updateData.append("latitude", formData.latitude);
                if (formData.longitude) updateData.append("longitude", formData.longitude);

                // 새로 추가된 이미지 정보 추가
                formData.productImages.forEach((image, index) => {
                    updateData.append(`productImages[${index}].imageUrl`, image.file);
                    updateData.append(`productImages[${index}].thumbnail`, image.thumbnail);
                });

                // 기존 이미지 정보 추가
                existingImages.forEach((image, index) => {
                    updateData.append(`existProductImages[${index}].imageId`, image.imageId);
                    updateData.append(`existProductImages[${index}].imageUrl`, image.imageUrl);
                    updateData.append(`existProductImages[${index}].thumbnail`, image.thumbnail);
                });


                await axiosCredential.put(`/api/products/${productId}`, updateData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                alert("대여 상품이 수정되었습니다.");
                navigate(`/products/${productId}`, {replace: true});
            } else {
                // 등록 API 호출
                const data = new FormData();
                data.append("title", formData.title);
                data.append("categoryId", formData.categoryId);
                data.append("description", formData.description);
                data.append("dayPrice", formData.dayPrice);
                if (formData.weekPrice) data.append("weekPrice", formData.weekPrice);
                if (formData.latitude) data.append("latitude", formData.latitude);
                if (formData.longitude) data.append("longitude", formData.longitude);

                // 이미지 처리
                formData.productImages.forEach((image, index) => {
                    data.append(`productImages[${index}].imageUrl`, image.file);
                    data.append(`productImages[${index}].thumbnail`, image.thumbnail);
                });

                const response = await axiosCredential.post("/api/products", data, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                const { productId } = response.data;
                if (productId) {
                    alert("대여 상품이 등록되었습니다.");
                    navigate(`/products/${productId}`, {replace: true});
                }
            }
        } catch (error) {
            console.error(isEdit ? "수정 중 오류 발생:" : "등록 실패:", error);
        }
    };

    const updateExistingImages = (updatedImages) => {
      setExistingImages(updatedImages);
    };

    const handleImageDelete = (deletedImage) => {
      setDeletedImages([...deletedImages, deletedImage]);
      setExistingImages(existingImages.filter((img) => img.imageId !== deletedImage.imageId));
    };

    return (
        <>
            <Header title={isEdit ? "대여 상품 수정" : "대여 상품 등록"} />
            <div className="layout-container">
                <div className="layout-wrapper">
                    <div className="layout-content">
                        {(isEdit && initialData) || !isEdit ? (
                            <ProductForm
                                onSubmit={handleSubmit}
                                initialData={initialData} // 넘겨주는 값
                                existingImages={existingImages} // 넘겨주는 값
                                onExistingImageUpdate = {updateExistingImages} // 받아오는 기존 이미지 업데이트 정보
                                onImageDelete={handleImageDelete} // 받아오는 삭제 이미지 정보
                                isEdit={isEdit}
                            />
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    );
};

// 등록 페이지 컴포넌트
export const ProductRegister = () => <ProductUpsert isEdit={false} />;

// 수정 페이지 컴포넌트
export const ProductEdit = () => <ProductUpsert isEdit={true} />;
