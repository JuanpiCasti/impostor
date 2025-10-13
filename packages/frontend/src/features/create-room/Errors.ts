import type { $ZodIssue } from "zod/v4/core"

export class CouldNotCreateRoomClientError extends Error {
  data: $ZodIssue[]
  constructor(errData: $ZodIssue[]) {
    super()
    this.data = errData
  }
}

export class CouldNotCreateRoomServerError extends Error {}
