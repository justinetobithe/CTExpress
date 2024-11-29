import React, { useEffect } from 'react';
import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';

let channelCounter = 1;

export const sendLocalNotification = async (message, title = 'Notification') => {
    console.log('Preparing to send notification...');

    const currentChannelId = `${channelCounter++}`;

    // Request permissions for iOS
    if (Platform.OS === 'ios') {
        try {
            const result = await PushNotification.requestPermissions();
            console.log('PushNotification Permissions: ', result);
        } catch (error) {
            console.log('Error requesting permissions: ', error);
        }
    }

    // Create the notification channel for Android
    const channelCreated = await new Promise((resolve) => {
        PushNotification.createChannel(
            {
                channelId: currentChannelId,
                channelName: `Notification Channel ${currentChannelId}`,
                channelDescription: `A notification channel for notifications ${currentChannelId}`,
                soundName: 'default',
                importance: PushNotification.Importance.HIGH, // Ensure this is set
                vibrate: true,
            },
            (created) => {
                console.log(`Notification channel created: ${created} with channelId: ${currentChannelId}`);
                resolve(created);
            }
        );
    });

    if (!channelCreated) {
        console.log('Failed to create notification channel.');
        return;
    }

    // Send the notification
    PushNotification.localNotification({
        channelId: currentChannelId,
        title: title,
        message: message,
        smallIcon: 'ic_notification',  // Ensure these icons exist
        largeIcon: 'ic_launcher',      // Ensure these icons exist
        priority: 'high',
        vibrate: true,
        vibration: 300,
        playSound: true,
        soundName: 'default',
    });

    console.log('Notification sent!');
};

// Ensure foreground notifications are handled
PushNotification.configure({
    onNotification: function (notification) {
        console.log('Notification received in foreground', notification);
        // Handle the notification manually if the app is in the foreground
        PushNotification.localNotification(notification);
    },
});
