import { useToast } from '@chakra-ui/toast';

export const useNotification = () => {
  const toast = useToast();

  const notificate = (title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: 4000,
      isClosable: true,
      position: 'top-right',
    });
  };

  return { notificate };
};
