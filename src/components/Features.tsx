export const Features = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _features = [
    {
      icon: '📱',
      title: '모바일 앱',
      description: '입주민이 앱으로 분리수거 규칙을 배우고, 질문할 수 있어요. 건물주님께는 필요한 알림만 가요.',
    },
    {
      icon: '🤖',
      title: '자동 관리',
      description: 'IoT 센서가 수거장 상태를 24/7 감시해요. 앱으로 언제든 확인할 수 있습니다.',
    },
    {
      icon: '💬',
      title: '챗봇 지원',
      description: '입주민이 묻는 질문을 AI가 자동으로 답변해요. 전화/카톡이 많이 줄어들어요.',
    },
    {
      icon: '📊',
      title: '데이터 대시보드',
      description: '분리수거율, 민원 현황, 비용 절감 등 모든 지표를 한눈에 볼 수 있어요.',
    },
    {
      icon: '🔔',
      title: '자동 공지',
      description: '수거 일정, 규칙 변경 등을 자동으로 입주민에게 전송해요.',
    },
    {
      icon: '🏢',
      title: '맞춤 설정',
      description: '건물 규모, 입주민 수에 맞게 시스템을 설정해서 사용할 수 있습니다.',
    },
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* 섹션 타이틀 */}
        <div className="mb-16 text-center animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            분리수거함이 필요하신가요?
          </h2>
          <p className="text-lg text-slate-600 font-light">
            필요하시면 무료로 설치해드리고 관리해드려요.
          </p>
        </div>

        {/* 수거 과정 이미지 */}
        <div className="mb-16 rounded-2xl overflow-hidden shadow-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <img src="/수거과정.png" alt="수거 과정" className="w-full h-auto" />
        </div>
      </div>
    </section>
  );
};
