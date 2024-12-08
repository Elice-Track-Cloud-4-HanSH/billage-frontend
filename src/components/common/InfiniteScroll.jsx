import { useEffect, useRef } from 'react';

const InfiniteScroll = ({ loadMore, loading }) => {
  const observerRef = useRef();

  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore(); // 데이터 로드 트리거
        }
      },
      { threshold: 1.0 } // 요소가 완전히 보일 때 실행
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loadMore, loading]);

  return <div ref={observerRef} style={{ height: '1px' }} />;
};

export default InfiniteScroll;
