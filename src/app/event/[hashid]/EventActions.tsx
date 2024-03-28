"use client";

import { actionRevalidateTag } from "#src/app/actions";
import { GoogleMaps } from "#src/components/GoogleMaps";
import { ControlDirections } from "#src/components/GoogleMaps/control-directions";
import { latLngLiteralFromPoint } from "#src/components/GoogleMaps/google-maps-point-latlng";
import { ShareButton } from "#src/components/ShareButton";
import { UserImage32x32 } from "#src/components/user/UserImage";
import { type GeoJson } from "#src/db/types-geojson";
import { api, type RouterOutputs } from "#src/hooks/api";
import { IconEdit } from "#src/icons/Edit";
import { IconWhere } from "#src/icons/Where";
import { useStore } from "#src/store";
import { dialogDispatch } from "#src/store/slices/dialog";
import { Button, buttonVariants } from "#src/ui/button";
import { useToast } from "#src/ui/use-toast";
import { hashidFromId } from "#src/utils/hashid";
import { type TokenUser } from "#src/utils/jwt/schema";
import { absUrl } from "#src/utils/url";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
        {!props.isCreator && (
          <FollowUnfollowButton event={props.event} user={props.user} isFollowing={props.isFollowing} />
        )}
        <ShareButton title={props.event.title} />

        {props.event.location && (
          <Button variant="icon" onClick={() => setShowMap((prev) => !prev)}>
            <IconWhere /> {showMap ? "close map" : "show map"}
          </Button>
        )}
        {!props.isCreator && <JoinLeaveButton user={props.user} id={props.event.id} isJoined={props.isJoined} />}
        <Button variant="icon" onClick={() => downloadEventAsIcs(props.event)}>
          .ics
        </Button>
      </div>
      {props.event.location && <Map show={showMap} location={props.event.location} />}
    </>
  );
}

function FollowUnfollowButton({
  user,
  isFollowing,
  event,
}: {
  user: TokenUser | null;
  isFollowing: boolean;
  event: NonNullable<RouterOutputs["event"]["getById"]>;
}) {
  const maybeRequestNotifications = useStore.use.maybeRequestNotifications();
  const { toast } = useToast();
  const onDenied = () =>
    toast({
      variant: "default",
      title: "You have blocked notifications",
      description:
        "Open your browser preferences or click the lock near the address bar to change your notification preferences.",
    });

  const userFollowOrUnfollow = api.user.followOrUnfollow.useMutation({
    onSuccess: (tag) => actionRevalidateTag(tag),
  });

  const handleClick = async () => {
    if (user) {
      await maybeRequestNotifications(onDenied);
      userFollowOrUnfollow.mutate({ id: event.creatorId, join: isFollowing ? false : true });
    } else {
      dialogDispatch({ type: "show", name: "profilebutton" });
    }
  };

  return (
    <Button onClick={handleClick} variant="icon" disabled={userFollowOrUnfollow.isPending}>
      <UserImage32x32 image={event.creatorImage ?? ""} alt={event.creatorName} />{" "}
      <span className="ml-1">{isFollowing ? "Unfollow" : "Follow"}</span>
    </Button>
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
  return (
    <Button disabled={eventJoinOrLeave.isPending} onClick={handleClick}>
      {isJoined ? "Leave" : "Join"}
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
      </div>
    )
  );
}

export function downloadEventAsIcs(event: NonNullable<RouterOutputs["event"]["getById"]>) {
  const hashid = hashidFromId(event.id);
  const filename = `howler-event-${hashid}.ics`;

  const summary = event.title.replaceAll("\n", " ");
  const dtstamp = event.createdAt.toISOString().slice(0, 19).replaceAll("-", "").replaceAll(":", "");
  const dtstart = event.date.toISOString().slice(0, 19).replaceAll("-", "").replaceAll(":", "");
  const p = event.location ? latLngLiteralFromPoint(event.location) : undefined;
  const geo = p ? `${p.lat.toFixed(6)};${p.lng.toFixed(6)}` : undefined;
  const eventurl = absUrl(`/event/${hashid}`);

  const endDate = new Date(event.date.getTime() + 1000 * 60 * 60 * 2); //dont have endDate on events yet... go 2 hours for now
  const dtend = endDate.toISOString().slice(0, 19).replaceAll("-", "").replaceAll(":", "");

  //https://www.kanzaki.com/docs/ical/
  const x = ["BEGIN:VCALENDAR"];
  x.push("VERSION:2.0");
  x.push("PRODID:-//HOWLER//EVENT//EN");

  x.push("BEGIN:VEVENT");
  x.push(`UID:howler-event-${hashid}`);
  x.push(`SUMMARY:${summary}`);
  x.push(`DTSTAMP:${dtstamp}Z`);
  x.push(`DTSTART:${dtstart}Z`);
  x.push(`DTEND:${dtend}Z`);
  //x.push(`URL:${eventurl}`);
  x.push(`DESCRIPTION:Howl by ${event.creatorName}: ${eventurl}`);
  if (geo) {
    x.push(`GEO:${geo}`);
  }
  if (event.locationName) {
    x.push(`LOCATION:${event.locationName}`);
  }

  x.push("END:VEVENT");
  x.push("END:VCALENDAR");

  const text = x.join("\n");
  const file = new File([text], filename, { type: "text/calendar" });

  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}
