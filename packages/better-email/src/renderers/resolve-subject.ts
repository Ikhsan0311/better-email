import type { EmailContext, EmailContextFor, EmailType } from '../types';

type SubjectMap = { [K in EmailType]?: string | ((context: EmailContextFor<K>) => string) };

export function resolveSubject(rendererName: string, subjects: SubjectMap, context: EmailContext): string {
  const resolver = subjects[context.type];
  if (!resolver) {
    throw new Error(`[${rendererName}] No subject found for email type: ${context.type}`);
  }
  return typeof resolver === 'function' ? (resolver as (context: EmailContext) => string)(context) : resolver;
}
