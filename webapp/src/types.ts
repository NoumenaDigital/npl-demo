export const Steps = {
  GREETING: 0,
  LOGIN: 1,
  LOGGED_IN: 2,
  CREATE_PROTOCOL: 3,
  PROTOCOL_CREATED: 4,
  SAY_HELLO: 5,
  SAID_HELLO: 6,
} as const;

export type Step = typeof Steps[keyof typeof Steps];
