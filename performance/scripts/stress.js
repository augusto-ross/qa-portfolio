/**
 * Stress test — gradual load increase to measure sustained capacity limits.
 *
 * Load profile: ramps from 10 to 50 VUs over 90 s, then recovers.
 * Strict thresholds (p95 < 500 ms, error < 1%) match the baseline SLO,
 * confirming quality holds as load climbs toward the system ceiling.
 */
import http from 'k6/http';
import { check, sleep } from 'k6';

// Same strict thresholds as baseline — the system must sustain SLOs as load grows.
export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = 'https://restful-booker.herokuapp.com';

// Single GET per VU iteration; status check detects failures as load climbs.
export default function () {
  const res = http.get(`${BASE_URL}/booking`);
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
