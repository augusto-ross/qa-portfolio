/**
 * Spike test — sudden traffic surge to validate resilience under abrupt load.
 *
 * Load profile: ramps from 0 to 100 VUs in 10 s, sustains for 30 s, then recovers.
 * Thresholds are relaxed (p95 < 1 s, error < 5%) to account for the temporary
 * degradation that is expected during an instantaneous load spike.
 */
import http from 'k6/http';
import { check, sleep } from 'k6';

// Relaxed thresholds reflect acceptable degradation under spike conditions.
export const options = {
  stages: [
    { duration: '10s', target: 0 },
    { duration: '10s', target: 100 },
    { duration: '30s', target: 100 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.05'],
  },
};

const BASE_URL = 'https://restful-booker.herokuapp.com';

// Single GET per VU iteration; status check confirms the endpoint stays available under spike load.
export default function () {
  const res = http.get(`${BASE_URL}/booking`);
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
