import { useEffect, useState } from 'react';
import Header from '../../components/common/Header';
import RentalForm from '../../components/rental-record/RentalForm'
import axios from 'axios';
import { useParams } from 'react-router-dom';

const SetToRented = () => {
  const [purchasers, setPurchasers] = useState();
  const { id } = useParams();

  useEffect(() => {
    const loadPurchasers = async () => {
      try {
        const response = await axios.get(`/api/rental-record/set-to-rented/${id}`);
        setPurchasers(response.data);
      } catch (error) {
        console.error('구매 희망자 정보를 가져오는 데 실패했습니다.', error);
      }
    };

    if (id) {
      loadPurchasers();
    }
  }, [id]);

  return (
    <>
      <Header title='대여 중으로 변경' />
      {purchasers ? (
        <RentalForm purchasers={purchasers} />
      )
       : (
        <div>정보를 불러오는 중입니다.</div>
       )}
    </>
  );
};

export default SetToRented;
