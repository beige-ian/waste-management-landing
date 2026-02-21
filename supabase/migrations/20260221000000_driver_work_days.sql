-- 기사 근무요일 컬럼 추가
-- work_days: [0,1,2,3,4,5,6] 형태 JSONB (0=일, 1=월 ... 6=토)
-- NULL = 제한 없음 (매일 근무)
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS work_days JSONB DEFAULT NULL;
