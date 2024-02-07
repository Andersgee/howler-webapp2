/**
 * PnYnMnDTnHnMnS
 *
 * https://en.wikipedia.org/wiki/ISO_8601#Durations
 *
 * turns out google doesnt use this. startDate and endDate is sufficient.
 */
export function iso8601Duration(startDate: Date, endDate: Date) {
  let diffseconds = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / 1000));

  //average month days 30.436875
  const Y = Math.floor(diffseconds / (60 * 60 * 24 * 30 * 12));
  diffseconds = diffseconds % (60 * 60 * 24 * 30 * 12);
  const M = Math.floor(diffseconds / (60 * 60 * 24 * 30));
  diffseconds = diffseconds % (60 * 60 * 24 * 30);

  const D = Math.floor(diffseconds / (60 * 60 * 24));
  diffseconds = diffseconds % (60 * 60 * 24);

  const h = Math.floor(diffseconds / (60 * 60));
  diffseconds = diffseconds % (60 * 60);

  const m = Math.floor(diffseconds / 60);
  diffseconds = diffseconds % 60;

  return `P${Y}Y${M}M${D}DT${h}H${m}M${diffseconds}S`;
}

/** YYYY-MM-DDThh:mm:ssZ */
export function iso8601DateTime(date: Date) {
  return `${date.toISOString().slice(0, 19)}Z`;
}

///** YYYY-MM-DD */
//export function iso8601Date(date: Date) {
//  return date.toISOString().slice(0, 10);
//}
