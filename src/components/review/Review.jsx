import PropTypes from "prop-types";

const Review = ({ review }) => {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`fa fa-star${i <= rating ? " checked" : ""}`}
        ></span>
      );
    }
    return stars;
  };

  return (
    <>
      <div>
        <div>
          <img src={review.imageUrl} alt="이미지" />
        </div>
        <div>
          <h5>{review.subject}</h5>
          <div>{renderStars(review.score)}</div>
        </div>
        <div>
          <p>{review.content}</p>
        </div>
      </div>
    </>
  );
};

Review.propTypes = {
    review: PropTypes.shape({
      imageUrl: PropTypes.string,
      subject: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
      content: PropTypes.string.isRequired,
    }).isRequired, 
  };

export default Review;
