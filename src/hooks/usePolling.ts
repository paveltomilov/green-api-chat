import { useEffect, useRef } from 'react';
import { receiveNotification, deleteNotification } from '../api/greenApi';
import type { Credentials, GreenApiNotification } from '../types';

interface UsePollingProps {
  credentials: Credentials;
  onNewMessage: (notification: GreenApiNotification) => void;
}

export const usePolling = ({ credentials, onNewMessage }: UsePollingProps) => {
  const onNewMessageRef = useRef(onNewMessage);

  useEffect(() => {
    onNewMessageRef.current = onNewMessage;
  }, [onNewMessage]);

  useEffect(() => {
    let isActive = true;

    const poll = async () => {
      while (isActive) {
        try {
          const data = await receiveNotification(credentials);

          if (data) {
            onNewMessageRef.current(data);
            await deleteNotification(credentials, data.receiptId);
          }
        } catch (error) {
          console.error('Polling error:', error);
          await new Promise((r) => setTimeout(r, 5000));
        }
      }
    };

    poll();

    return () => {
      isActive = false;
    };
  }, [credentials]);
};