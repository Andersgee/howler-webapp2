export const tagsUser = {
  info: (p: { userId: bigint }) => `user-info-${p.userId}`,
  isFollowing: (p: { userId: bigint; followerId: bigint }) => `user-isfollowing-${p.userId}-${p.followerId}`,
};
