export const ValueProposition = () => {
  const values = [
    {
      icon: '📊',
      title: '체계적인 관리',
      description: '입주민별 분리수거 현황을 한눈에 파악하고 체계적으로 관리하세요.',
    },
    {
      icon: '📱',
      title: '간편한 소통',
      description: '입주민과의 공지사항 전달, 민원 처리를 간편하게 진행합니다.',
    },
    {
      icon: '💰',
      title: '비용 절감',
      description: '분리수거 관리에 소요되는 시간과 비용을 대폭 줄일 수 있습니다.',
    },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">우리의 솔루션</h2>
          <p className="text-xl text-gray-600">
            건물주가 원하는 3가지를 모두 제공합니다
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300"
            >
              <div className="text-5xl mb-4">{value.icon}</div>
              <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
              <p className="text-gray-600 text-lg">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
