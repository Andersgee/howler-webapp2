"use client";

import { actionRevalidateTag } from "#src/app/actions";
import { api } from "#src/hooks/api";
import { Button } from "#src/ui/button";

type Props = {
  userId: bigint;
  isFollowing: boolean;
};

export function FollowUnfollowButton({ userId, isFollowing }: Props) {
  const userFollowOrUnfollow = api.user.followOrUnfollow.useMutation({
    onSuccess: (tag) => actionRevalidateTag(tag),
  });

  const handleClick = () => {
    userFollowOrUnfollow.mutate({ id: userId, join: isFollowing ? false : true });
  };

  return (
    <Button onClick={handleClick} disabled={userFollowOrUnfollow.isPending}>
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
