import test from 'ava';
import slack from '.';

// This test was ported from legacy API. Needs revising.
test.skip('Slack integration', (t) => {
  return slack('Running slack test')
    .then(() => {
      // If Slack is on
      // if (!x) {
      //   t.ok(true, 'Slack notifications not running in current environment');
      //   return t.end();
      // }
      // If Slack is off
      t.ok(true, 'Sends slack webhook');
      return t.end();
    });
});
