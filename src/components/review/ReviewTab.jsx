import PropTypes from "prop-types";

const ReviewTab = ({ activeTab, onTabChange }) => {
  return (
    <div className="nav nav-pills mb-3" id="pills-tab" role="tablist">
      <button
        className={`nav-link ${activeTab === "product" ? "active" : ""}`}
        id="pills-product-tab"
        data-bs-toggle="pill"
        data-bs-target="#pills-product"
        type="button"
        role="tab"
        onClick={() => onTabChange("product")}
      >
        상품 후기
      </button>
      <button
        className={`nav-link ${activeTab === "user" ? "active" : ""}`}
        id="pills-user-tab"
        data-bs-toggle="pill"
        data-bs-target="#pills-user"
        type="button"
        role="tab"
        onClick={() => onTabChange("user")}
      >
        거래자 후기
      </button>
    </div>
  );
};

ReviewTab.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default ReviewTab;
