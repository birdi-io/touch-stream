import envObj from '../secret.dev.json';
Array.from(Object.keys(envObj)).forEach((key) => {
  process.env[key] = envObj[key];
});
import test from 'ava';
import { addYoutubeEvent, deleteYoutubeEvent } from './fit';

test.only('Add yt link to event', async (t) => {
  const response = await addYoutubeEvent('61095ca5-0cd4-499a-88e1-d95e397c9058', 'f_NmPiwMb7Q');
  t.truthy(response.ok, 'Receive OK response');
});

test.only('Delete same link from event', async (t) => {
  const response = await deleteYoutubeEvent('61095ca5-0cd4-499a-88e1-d95e397c9058', 'f_NmPiwMb7Q');
  t.truthy(response.ok, 'Receive OK response');
});
