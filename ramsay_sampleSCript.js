import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  scenarios: {
    iteration_test: {
      executor: 'per-vu-iterations',
      vus: 1,
      iterations: 2,
      startTime: '0s',  // Make sure this is a string ('5s')
    }
  }
};

const baseUrl = 'https://dev-healthhub.ramsayhealth.co.uk';  // URL should be quoted

export default function () {
  let launch = http.get(baseUrl);

  // Using check to validate the response
  check(launch, {
    'Check if this sentence exists': (r) => r.body.includes('Find an initial consultation near you'),  // Sentence check
    'Check response code': (r) => r.status === 200  // Correct comparison for status code
  });

  let downtime = http.get(baseUrl+'/MVPDowntimeData-DFD/DFDDowntimeFlagData.json')
  check(downtime, {
   // 'Check if this sentence exists': (r) => r.body.includes('Find an initial consultation near you'),  // Sentence check
    'Check response code': (r) => r.status === 200  // Correct comparison for status code
  });

  sleep(1);  // Simulate a delay before the next iteration
}
