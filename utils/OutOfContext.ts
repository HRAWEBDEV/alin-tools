export class OutOfContext extends Error {
 constructor(contextName: string) {
  super(`use${contextName} must be used within a ${contextName}Provider`);
  this.name = 'OutOfContextError';

  if (Error.captureStackTrace) {
   Error.captureStackTrace(this, OutOfContext);
  }
 }
}
