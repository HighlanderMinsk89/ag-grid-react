import React from 'react';
import { Button } from '@chakra-ui/react';
import { useHttp } from '../../hooks/useHttp';
import { useNotification } from '../../hooks/useNotification';

export const FlushCacheButton = () => {
  const { request } = useHttp();
  const { notificate } = useNotification();

  const flushCache = async () => {
    const resp = await request('/api/employee/flush-cache');
    if (resp) notificate('Success', resp.message, 'success');
  };

  return (
    <Button
      size="sm"
      variant="solid"
      bg="blue.300"
      onClick={flushCache}
      alignSelf="flex-start"
      ml="8"
    >
      Clear Cache
    </Button>
  );
};
