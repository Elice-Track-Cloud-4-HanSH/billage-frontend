import { useState, useEffect, useRef } from 'react';

const useInfiniteScroll = (fetchData, hasMore) => {
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);

  const lastElementRef = (node) => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setLoading(true);
          fetchData().finally(() => setLoading(false));
        }
      },
      { threshold: 1.0 }
    );

    if (node) observerRef.current.observe(node);
  };

  return { lastElementRef, loading };
};

export default useInfiniteScroll;
