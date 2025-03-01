import { useNavigate } from 'react-router-dom';
import '@/styles/product/ProductDetailNavbar.css';
import useAuth from "@/hooks/useAuth";

const ProductDetailNavbar = ({ isFavorite, dayPrice, weekPrice, onToggleFavorite, product, isPressed }) => {
    const navigate = useNavigate();
    const { userInfo } = useAuth();
    const isOwner = userInfo?.userId === product?.seller?.sellerId;

    const handleFavoriteClick = () => {
        if (isPressed) {
            alert("처리 중입니다. 잠시만 기다려주세요.");
            return;
        }

        const newFavoriteStatus = !isFavorite;
        if (onToggleFavorite) {
            onToggleFavorite(newFavoriteStatus);
        }
    };

    return (
        <div className='layout-footer bg-white border-top'>
            <div className='d-flex justify-content-around p-2'>
                <div>
                    {!isOwner && (
                        <button
                            className='btn btn-link favorite-button'
                            onClick={handleFavoriteClick}
                            disabled={isPressed}
                        >
                            {isFavorite ? (
                                <i className='bi bi-heart-fill text-danger favorite-icon'></i>
                            ) : (
                                <i className='bi bi-heart favorite-icon'></i>
                            )}
                        </button>
                    )}
                </div>
                <div className='text-center price-text'>
                    <div>{dayPrice.toLocaleString()}원 / 일</div>
                    {weekPrice && <div>{weekPrice.toLocaleString()}원 / 주</div>}
                </div>
                <div>
                    {!isOwner && (
                        <button
                            className='chat-button'
                            onClick={() =>
                                navigate('/chat', {
                                    state: {
                                        sellerId: product?.seller?.sellerId,
                                        productId: product?.productId,
                                        opponentName: product?.seller?.sellerNickname,
                                    },
                                })
                            }
                        >
                            채팅하기
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};


export default ProductDetailNavbar;
