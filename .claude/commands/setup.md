# 프로젝트 초기 설정

다른 Mac에서 처음 시작할 때 실행하세요:

```bash
# 1. 프로젝트 클론
git clone git@github.com:beige-ian/waste-management-landing.git
cd waste-management-landing

# 2. 의존성 설치
npm install

# 3. 개발 서버 시작
npm run dev
```

**또는 한 줄로:**
```bash
git clone git@github.com:beige-ian/waste-management-landing.git && cd waste-management-landing && npm install && npm run dev
```

---

### SSH 키 설정
다른 Mac에서 git push를 하려면 SSH 키가 필요합니다:
1. 원래 Mac의 `~/.ssh/id_ed25519` 파일 복사
2. 권한 설정: `chmod 600 ~/.ssh/id_ed25519`
3. 또는 같은 방식으로 새 SSH 키 생성 후 GitHub에 추가
