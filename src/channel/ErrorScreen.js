const ErrorScreen = ({ message }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {message}
      <button>구독하기</button>
      <button>로그인</button>
    </div>
  );
};
export default ErrorScreen;
