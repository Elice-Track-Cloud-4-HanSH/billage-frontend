import { useEffect, useState } from 'react';
import Header from '../../components/common/Header';
import RentalForm from './RentalForm';
import axios from 'axios';

const SetToRented = () => {
  const [purchasers, setPurchasers] = useState();

  const loadPurchasers = async () => {
    try {
      const response = await axios.get('/api/rental-record/set-to-rented');
      setPurchasers(response.data);
    } catch (error) {
      console.error('구매 희망자 정보를 가져오는 데 실패했습니다.', error);
    }
  };

  useEffect(() => {
    loadPurchasers();
  }, []);

  return (
    <>
      <Header title='대여 중으로 변경' />
      <RentalForm purchasers={purchasers} />
    </>
  );
};

export default SetToRented;
