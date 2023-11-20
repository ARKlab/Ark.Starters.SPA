import { Observable } from "rxjs";
import * as RxOp from "rxjs/operators";

export const ofType = <A extends { type: string }, K extends A["type"]>(k: K) => (
  a: Observable<A>
): Observable<Extract<A, { type: K }>> =>
  a.pipe(RxOp.filter((x): x is Extract<A, { type: K }> => x.type === k));
