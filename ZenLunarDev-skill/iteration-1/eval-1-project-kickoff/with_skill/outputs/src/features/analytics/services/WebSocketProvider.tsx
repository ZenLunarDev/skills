import { WS_URL } from '../../../config/constants';

export interface WebSocketProviderProps {
  children: React.ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  return (
    <div data-websocket-url={WS_URL}>
      {children}
    </div>
  );
}
