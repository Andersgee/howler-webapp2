export const tagsEvent = {
  info: (eventId: bigint) => `event-info-${eventId}`,
  isJoined: (p: { eventId: bigint; userId: bigint }) => `event-isJoined-${p.eventId}-${p.userId}`,
};
