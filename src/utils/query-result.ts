import type { DeleteResult, InsertResult, UpdateResult } from "kysely";

type UpdateResultType = {
  numUpdatedRows: bigint;
  numChangedRows?: bigint;
};

type DeleteResultType = {
  numDeletedRows: bigint;
};

type InsertResultType = {
  insertId?: bigint;
  numInsertedOrUpdatedRows?: bigint;
};

/** return plain object instead of class */
export function updateResultObject(r: UpdateResult): UpdateResultType {
  return { numChangedRows: r.numChangedRows, numUpdatedRows: r.numUpdatedRows };
}

/** return plain object instead of class */
export function deleteResultObject(r: DeleteResult): DeleteResultType {
  return { numDeletedRows: r.numDeletedRows };
}

/** return plain object instead of class */
export function insertResultObject(r: InsertResult): InsertResultType {
  return { insertId: r.insertId, numInsertedOrUpdatedRows: r.numInsertedOrUpdatedRows };
}
