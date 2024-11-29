export const timeDiffFormat = (lastSentTime, currentTime) => {
  const lastSentTimeToDate = new Date(lastSentTime);
  const diffMs = currentTime - lastSentTimeToDate;

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  } else if (diffHours < 24) {
    return `${diffHours}시간 전`;
  } else if (diffDays < 31) {
    return `${diffDays}일 전`;
  } else {
    return `${diffMonths}달 전`;
  }
};
