import ava from 'ava';
import { getChanges } from './sync';
import eventsSample from '../../test/fit-events.json';

ava('No changes', (t) => {
  const { patches, removals, additions } = getChanges(eventsSample, eventsSample);
  t.true(patches.length === 0);
  t.true(removals.length === 0);
  t.true(additions.length === 0);
});

ava('Handles additions', (t) => {
  const newEvents = [...eventsSample, Object.assign({}, eventsSample[0], { id: 'test' })];
  const { patches, removals, additions } = getChanges(eventsSample, newEvents);
  t.true(patches.length === 0);
  t.true(removals.length === 0);
  t.true(additions.length === 1);
});

ava('Handles patches', (t) => {
  const newEvents = [...eventsSample, Object.assign({}, eventsSample[0], { scheduledEndTime: (new Date().toISOString()) })];
  const { patches, removals, additions } = getChanges(eventsSample, newEvents);
  t.true(patches.length === 1);
  t.true(removals.length === 0);
  t.true(additions.length === 0);
});

ava('Handles removals', (t) => {
  const newEvents = eventsSample.slice(0, eventsSample.length - 2);
  const { patches, removals, additions } = getChanges(eventsSample, newEvents);
  t.true(patches.length === 0);
  t.true(removals.length === 2);
  t.true(additions.length === 0);
});
