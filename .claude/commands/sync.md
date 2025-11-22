# GitHub에서 최신 코드 받기

다른 Mac에서 작업하기 전에 최신 코드를 받으세요:

```bash
git pull
```

**또는 상태 확인 후 받기:**
```bash
git status
git pull
```

---

### 만약 충돌이 발생하면:
```bash
# 충돌 확인
git status

# 원격 버전으로 덮어쓰기 (주의!)
git checkout --theirs .

# 커밋
git add .
git commit -m "Merge: sync with remote"
```
