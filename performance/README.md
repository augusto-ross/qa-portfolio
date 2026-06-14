# Performance Tests — k6

Load tests for the Restful Booker API (https://restful-booker.herokuapp.com/).

## Prerequisites
Install k6: https://k6.io/docs/get-started/installation/

## Run
```bash
k6 run scripts/baseline.js   # 10 VUs, 1 minute
k6 run scripts/stress.js     # ramp 10→50 VUs over 2 minutes
k6 run scripts/spike.js      # sudden spike to 100 VUs
```

## Scenarios

| Script | VUs | Duration | Purpose |
|--------|-----|----------|---------|
| `baseline.js` | 10 | 1m | Normal expected traffic |
| `stress.js` | 10→50 | 2m | Gradual load increase |
| `spike.js` | 0→100→0 | ~1m | Sudden traffic burst |

## Thresholds (SLOs)

```javascript
thresholds: {
  http_req_duration: ['p(95)<500'],   // 95th percentile under 500ms
  http_req_failed: ['rate<0.01'],     // error rate under 1%
}
```

These thresholds are enforced in CI — the `performance.yml` workflow fails if they are breached. This turns performance tests from "nice to have" metrics into actual quality gates.
