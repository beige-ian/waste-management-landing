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
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
      >
        {/* Modal Container */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#FFFFFF',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0px 8px 28px -6px rgba(24,39,75,0.12), 0px 18px 88px -4px rgba(24,39,75,0.14)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            alignItems: 'flex-end',
            maxWidth: '480px',
            width: '90%',
            boxSizing: 'border-box'
          }}
        >
          {/* Content Section */}
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'flex-start',
            width: '100%'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              flex: 1
            }}>
              {/* Title */}
              <div style={{
                display: 'flex',
                gap: '6px',
                alignItems: 'center',
                width: '100%'
              }}>
                <p style={{
                  fontFamily: 'Pretendard',
                  fontWeight: 700,
                  fontSize: '20px',
                  lineHeight: '28px',
                  letterSpacing: '-0.1px',
                  color: '#46474C',
                  margin: 0,
                  whiteSpace: 'pre'
                }}>
                  첫 달 무료체험 문의하기 신청 완료!
                </p>
              </div>

              {/* Description */}
              <div style={{
                fontFamily: 'Pretendard',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: '-0.08px',
                color: '#46474C',
                maxHeight: '96px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%'
              }}>
                <p style={{ margin: 0, marginBottom: '0' }}>담당자가 24시간 안에 연락드릴게요.</p>
                <p style={{ margin: 0 }}>모르는 번호로 전화가 와도 꼭 받아주세요!</p>
              </div>
            </div>
          </div>

          {/* Button Section */}
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'flex-start'
          }}>
            <button
              onClick={onClose}
              style={{
                background: '#3385FF',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '48px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Pretendard',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: '-0.08px',
                color: '#FFFFFF',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#2874E6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#3385FF';
              }}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
