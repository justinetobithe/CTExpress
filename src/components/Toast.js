import React from 'react';
import { useToast, Alert, VStack, HStack, Text, IconButton, CloseIcon } from 'native-base';

const Toast = () => {
    const toast = useToast();

    const ToastAlert = ({ id, status, message }) => {
        let bgColor;

        switch (status) {
            case 'success':
                bgColor = 'green.500';
                break;
            case 'error':
                bgColor = 'red.500';
                break;
            case 'info':
            default:
                bgColor = 'blue.500';
                break;
        }

        return (
            <Alert maxWidth="100%" alignSelf="center" status={status} variant="subtle" bg={bgColor}>
                <VStack space={1} flexShrink={1} w="100%">
                    <HStack flexShrink={1} alignItems="center" justifyContent="space-between">
                        <HStack space={2} flexShrink={1} alignItems="center">
                            <Alert.Icon />
                            <Text fontSize="md" fontWeight="medium" color="lightText">
                                {message}
                            </Text>
                        </HStack>
                        <IconButton
                            variant="unstyled"
                            icon={<CloseIcon size="3" color="lightText" />}
                            onPress={() => toast.close(id)}
                        />
                    </HStack>
                </VStack>
            </Alert>
        );
    };

    const showToast = (message, status = "info") => {
        toast.show({
            render: ({ id }) => <ToastAlert id={id} message={message} status={status} />
        });
    };

    return { showToast };
};

export default Toast;
