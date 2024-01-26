"use client";

import { actionRevalidateTag } from "#src/app/actions";
import { GoogleMaps } from "#src/components/GoogleMaps";
import { latLngLiteralFromPoint } from "#src/components/GoogleMaps/google-maps-point-latlng";
import { ShareButton } from "#src/components/ShareButton";
import { type GeoJson } from "#src/db/types-geojson";
import { api, type RouterOutputs } from "#src/hooks/api";
import { IconEdit } from "#src/icons/Edit";
import { IconWhere } from "#src/icons/Where";
import { useStore } from "#src/store";
import { dialogDispatch } from "#src/store/slices/dialog";
import { tagsEvent } from "#src/trpc/routers/eventTags";
import { Button, buttonVariants } from "#src/ui/button";
import { hashidFromId } from "#src/utils/hashid";
import { type TokenUser } from "#src/utils/jwt/schema";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Props = {
  event: NonNullable<RouterOutputs["event"]["getById"]>;
  user: TokenUser | null;
  isCreator: boolean;
  isJoined: boolean;
};

export function EventActions(props: Props) {
  const [showMap, setShowMap] = useState(false);

  return (
    <>
      <div className="mb-2 mt-4 flex gap-2">
        {props.event.location && (
          <Button variant="icon" onClick={() => setShowMap((prev) => !prev)}>
            <IconWhere /> {showMap ? "close map" : "show map"}
          </Button>
        )}
        {props.isCreator && (
          <Link href={`/event/${hashidFromId(props.event.id)}/edit`} className={buttonVariants({ variant: "icon" })}>
            <IconEdit /> Edit
          </Link>
        )}
        <ShareButton title={props.event.title} />

        <JoinLeaveButton user={props.user} id={props.event.id} isJoined={props.isJoined} />
      </div>
      <Map show={showMap} location={props.event.location} />
    </>
  );
}

function JoinLeaveButton({ user, id, isJoined }: { user: TokenUser | null; id: bigint; isJoined: boolean }) {
  const eventJoinOrLeave = api.event.joinOrLeave.useMutation({
    onSuccess: (tag) => actionRevalidateTag(tag),
  });
  const handleClick = () => {
    if (user) {
      eventJoinOrLeave.mutate({ id, join: isJoined ? false : true });
    } else {
      dialogDispatch({ type: "show", name: "profilebutton" });
    }
  };
  return <Button onClick={handleClick}>{isJoined ? "Leave" : "Join"}</Button>;
}

function Map({ show, location }: { show: boolean; location: null | GeoJson["Point"] }) {
  const googleMaps = useStore.use.googleMaps();
  const didRun = useRef(false);
  useEffect(() => {
    if (!googleMaps || !location) return;

    if (!didRun.current) {
      googleMaps.setMode("view-event");
    }
    didRun.current = true;
    //always move center on open
    const latLng = latLngLiteralFromPoint(location);
    googleMaps.primaryMarker.position = latLng;
    googleMaps.map.setOptions({
      center: latLng,
      heading: 0,
      zoom: 11,
    });
  }, [googleMaps, location, show]);

  return (
    show && (
      <div className="h-96 w-full">
        <GoogleMaps />
      </div>
    )
  );
}
