export function getCurrentPosition(
  callback: (res: { ok: false } | { ok: true; latLng: { lat: number; lng: number } }) => void
) {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (p) => callback({ ok: true, latLng: { lat: p.coords.latitude, lng: p.coords.longitude } }),
      () => callback({ ok: false })
    );
  } else {
    callback({ ok: false });
  }
}
