import http from 'k6/http';
import { check, sleep } from 'k6';

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

export default function () {
  const res = http.get(`${BASE_URL}/booking`);
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
