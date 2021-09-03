import test from 'ava';
import { loadTestConfig } from '../../test/config';
import { sign, verify } from '.';

test.before(async () => {
  await loadTestConfig();
});

const USER_ID = '5a27827fa5337063e5d4fffa';

test('Signs JWTs from Mongo IDs', (t) => {
  const result = sign(USER_ID);
  t.truthy(verify(result), 'Returns valid JWT');
});
