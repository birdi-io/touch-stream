import { Binary } from 'mongodb';

// Assumes keys are unique
function makeMap(arr, key = '_id') {
  return arr.reduce((acc, val) => {
    acc[val[key]] = val;
    return acc;
  }, {});
}

const comparisonFields = [
  'scheduledStartTime', 'scheduledEndTime',
  'comp', 'round', 'teamA', 'teamB', 'location',
];
// Shallow compare matches
// Returns true if equal
function areObjectsEqualShallow(objA, objB, fields = comparisonFields) {
  return !fields.some((field) => objA[field] !== objB[field]);
}

export function lowerTeamCase(match) {
  return Object.assign(match, {
    teamA: match.teamA ? match.teamA.toLowerCase() : null,
    teamB: match.teamB ? match.teamB.toLowerCase() : null,
  });
}

export function convertDates(match) {
  return Object.assign(match, {
    scheduledStartTime: new Date(match.scheduledStartTime),
    scheduledEndTime: new Date(match.scheduledEndTime),
  });
}

function useNativeID(list) {
  return list.map((match) => {
    const updated = { ...match, _id: new Binary(match.id, Binary.SUBTYPE_UUID) };
    delete updated.id;
    return updated;
  });
}

export function getChanges(localMatches, remoteMatches) {
  const localMatchMap = makeMap(localMatches);
  // Update id to UUID
  const remoteMatchMap = makeMap(remoteMatches);
  const additions = remoteMatches.filter((match) => !localMatchMap[match.id.toString()]);
  const removals = localMatches
    .filter((match) => !remoteMatchMap[match.id]);
  const patches = remoteMatches
    .filter((match) => {
      if (!localMatchMap[match.id.toString()]) return false;
      return !areObjectsEqualShallow(localMatchMap[match.id], match);
    })
    .map((match) => {
      const broadcastInfo = {
        youtubeId: localMatchMap[match.id].youtubeId,
        broadcastStatus: localMatchMap[match.id].broadcastStatus,
      };
      return { ...localMatchMap[match.id], ...match, ...broadcastInfo };
    });
  return {
    patches: useNativeID(patches),
    removals: useNativeID(removals),
    additions: useNativeID(additions),
  };
}
