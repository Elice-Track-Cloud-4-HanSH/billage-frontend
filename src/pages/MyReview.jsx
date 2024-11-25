import Header from "../components/common/Header";
import ReviewTab from "../components/review/Reviewtab";
import ReviewList from "../components/review/ReviewList";
import Navbar from "../components/common/Navbar";
import axios from "axios";
import { useState, useEffect } from "react";

const MyReview = () => {
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("product");

  const fetchReviews = async (tab) => {
    try {
      const url =
        tab === "product" ? "/api/product-review" : "/api/user-review";
      const response = await axios.get(url);
      setReviews(response.data);
    } catch (error) {
      console.error("리뷰를 가져오는 데 실패했습니다.", error);
    }
  };

  useEffect(() => {
    fetchReviews(activeTab);
  }, [activeTab]);

  return (
    <>
      <Header title="작성한 리뷰" />
      <ReviewTab activeTab={activeTab} onTabChange={setActiveTab} />
      <ReviewList reviews={reviews} />
      <Navbar />
    </>
  );
};

export default MyReview;
