import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import '@/styles/product/ProductDetailNavbar.css';

const ProductDetailNavbar = ({ isFavorite, dayPrice, weekPrice, onToggleFavorite }) => {
    const navigate = useNavigate();

    const handleFavoriteClick = () => {
        const newFavoriteStatus = !isFavorite;
        if (onToggleFavorite) {
            onToggleFavorite(newFavoriteStatus);
        }
    };

    return (
        <div className='layout-footer bg-white border-top'>
            <div className='d-flex justify-content-around p-2'>
                <button className='btn btn-link favorite-button' onClick={handleFavoriteClick}>
                    {isFavorite ? (
                        <i className='bi bi-heart-fill text-danger favorite-icon'></i>
                    ) : (
                        <i className='bi bi-heart favorite-icon'></i>
                    )}
                </button>
                <div className='text-center price-text'>
                    <div>{dayPrice} / 일</div>
                    {weekPrice && <div>{weekPrice} / 주</div>}
                </div>
                <button className='chat-button' onClick={() => navigate('/chat')}>채팅하기</button>
            </div>
        </div>
    );
};

ProductDetailNavbar.propTypes = {
    isFavorite: PropTypes.bool.isRequired,
    dayPrice: PropTypes.number.isRequired,
    weekPrice: PropTypes.number,
    onToggleFavorite: PropTypes.func
};

export default ProductDetailNavbar;
