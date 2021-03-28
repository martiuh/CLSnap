export interface MessengerInterface {
  namespace: string;
  action: string;
  payload: any;
}

export function messenger(params: MessengerInterface) {}
