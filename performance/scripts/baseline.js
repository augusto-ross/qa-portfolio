/**
 * Baseline load test — steady-state performance at normal traffic.
 *
 * Load profile: 10 concurrent virtual users for 1 minute with 1 s think time.
 * Thresholds (p95 < 500 ms, error rate < 1%) establish the SLO benchmark
 * that stress and spike tests are measured against.
 */
import http from 'k6/http';
import { check, sleep } from 'k6';

// SLO thresholds: breach causes CI to fail.
export const options = {
  vus: 10,
  duration: '1m',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = 'https://restful-booker.herokuapp.com';

// Each VU runs this loop for the full duration; sleep(1) simulates realistic think time.
export default function () {
  const res = http.get(`${BASE_URL}/booking`);
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
