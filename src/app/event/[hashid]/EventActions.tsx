"use client";

import { actionRevalidateTag } from "#src/app/actions";
import { GoogleMaps } from "#src/components/GoogleMaps";
import { ControlDirections } from "#src/components/GoogleMaps/control-directions";
import { ControlFullscreen } from "#src/components/GoogleMaps/control-fullscreen";
import { latLngLiteralFromPoint } from "#src/components/GoogleMaps/google-maps-point-latlng";
import { ShareButton } from "#src/components/ShareButton";
import { type GeoJson } from "#src/db/types-geojson";
import { api, type RouterOutputs } from "#src/hooks/api";
import { IconEdit } from "#src/icons/Edit";
import { IconWhere } from "#src/icons/Where";
import { downloadEventAsIcs } from "#src/lib/ics";
import { useStore } from "#src/store";
import { dialogDispatch } from "#src/store/slices/dialog";
import { Button, buttonVariants } from "#src/ui/button";
import { hashidFromId } from "#src/utils/hashid";
import { type TokenUser } from "#src/utils/jwt/schema";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
//import { useToast } from "#src/ui/use-toast";
//import { UserImage32x32 } from "#src/components/user/UserImage";
//import { absUrl } from "#src/utils/url";

type Props = {
  event: NonNullable<RouterOutputs["event"]["getById"]>;
  user: TokenUser | null;
  isCreator: boolean;
  isJoined: boolean;
  isFollowing: boolean;
};

export function EventActions(props: Props) {
  const [showMap, setShowMap] = useState(false);

  return (
    <>
      <div className="flex flex-wrap justify-center gap-4 px-4 py-6">
        {props.isCreator && (
          <Link href={`/event/${hashidFromId(props.event.id)}/edit`} className={buttonVariants({ variant: "icon" })}>
            <IconEdit /> Edit
          </Link>
        )}
        <ShareButton title={props.event.title} />

        {props.event.location && (
          <Button variant="icon" onClick={() => setShowMap((prev) => !prev)}>
            <IconWhere /> {showMap ? "close map" : "show map"}
          </Button>
        )}
        {props.isCreator ? null : props.isJoined ? (
          <LeaveButton user={props.user} id={props.event.id} />
        ) : (
          <JoinButton user={props.user} id={props.event.id} />
        )}

        <Button variant="icon" onClick={() => downloadEventAsIcs(props.event)}>
          .ics
        </Button>
      </div>
      {props.event.location && <Map show={showMap} location={props.event.location} />}
    </>
  );
}

function JoinButton({ user, id }: { user: TokenUser | null; id: bigint }) {
  const { mutate, isPending } = api.event.join.useMutation({
    onSuccess: ({ tag }) => actionRevalidateTag(tag),
  });
  const handleClick = () => {
    if (user) {
      mutate({ id });
    } else {
      dialogDispatch({ type: "show", name: "profilebutton" });
    }
  };
  return (
    <Button disabled={isPending} onClick={handleClick}>
      Join
    </Button>
  );
}

function LeaveButton({ user, id }: { user: TokenUser | null; id: bigint }) {
  const { mutate, isPending } = api.event.leave.useMutation({
    onSuccess: ({ tag }) => actionRevalidateTag(tag),
  });
  const handleClick = () => {
    if (user) {
      mutate({ id });
    } else {
      dialogDispatch({ type: "show", name: "profilebutton" });
    }
  };
  return (
    <Button disabled={isPending} onClick={handleClick}>
      Leave
    </Button>
  );
}

function Map({ show, location }: { show: boolean; location: GeoJson["Point"] }) {
  const googleMaps = useStore.use.googleMaps();
  const didRun = useRef(false);
  useEffect(() => {
    if (!googleMaps || !show) return;

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
        <ControlDirections location={location} />
        <ControlFullscreen />
      </div>
    )
  );
}
