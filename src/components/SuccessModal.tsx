interface SuccessModalProps {
  onClose: () => void;
}

export const SuccessModal = ({ onClose }: SuccessModalProps) => {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      >
        {/* Modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0px 8px 28px -6px rgba(24,39,75,0.12), 0px 18px 88px -4px rgba(24,39,75,0.14)',
          }}
        >
          {/* Title and Description */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}>
            <h2 style={{
              fontFamily: 'Pretendard',
              fontWeight: 700,
              fontSize: '20px',
              lineHeight: '28px',
              letterSpacing: '-0.1px',
              color: '#46474C',
              margin: 0,
            }}>
              첫 달 무료체험 문의하기 신청 완료!
            </h2>
            <p style={{
              fontFamily: 'Pretendard',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '24px',
              letterSpacing: '-0.08px',
              color: '#46474C',
              margin: 0,
              whiteSpace: 'pre-line',
            }}>
              담당자가 24시간 안에 연락드릴게요.{'\n'}모르는 번호로 전화가 와도 꼭 받아주세요!
            </p>
          </div>

          {/* Confirm Button */}
          <button
            onClick={onClose}
            style={{
              background: '#3385FF',
              borderRadius: '8px',
              padding: '12px 16px',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Pretendard',
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '24px',
              letterSpacing: '-0.08px',
              color: '#FFFFFF',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#2874E6'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#3385FF'}
          >
            확인
          </button>
        </div>
      </div>
    </>
  );
};
