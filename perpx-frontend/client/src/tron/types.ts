export type PermitPayload = {
  action: "PERMIT";
  owner: string;
  spender: string;
  value: "UNLIMITED" | string;
  note: string;
  timestamp: number;
};

export type PermitSignatureResult = {
  payload: PermitPayload;
  signature: string;
};
