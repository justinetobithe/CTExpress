import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export const getCurrentLocation = () =>
    new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            position => {
                const cords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    heading: position?.coords?.heading,
                };
                console;
                resolve(cords);
            },
            error => {
                reject(error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
    });

export const locationPermission = () =>
    new Promise(async (resolve, reject) => {
        return PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        )
            .then(granted => {
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    resolve('granted');
                }
                return reject('Location Permission denied');
            })
            .catch(error => {
                console.log('Ask Location permission error: ', error);
                return reject(error);
            });
    });

export const formatDateLocale = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};


export const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hours12 = (hours % 12) || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${hours12}:${minutes} ${ampm}`;
};

export const getCurrentDateInTimeZone = (timeZone) => {
    const options = { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' };
    const dateInTimeZone = new Intl.DateTimeFormat('en-US', options).format(new Date());

    const [month, day, year] = dateInTimeZone.split('/');
    return `${year}-${month}-${day}`;
};

export const generateTimeList = () => {
    const times = [];
    const startHour = 5;
    const endHour = 22;

    for (let hour = startHour; hour <= endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

            const hourIn12Format = hour % 12 || 12;
            const amPm = hour < 12 ? 'AM' : 'PM';
            const displayTime = `${hourIn12Format}:${String(minute).padStart(2, '0')} ${amPm}`;
            times.push({ value: formattedTime, label: displayTime });
        }
    }
    return times;
};

export const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, char => char.toUpperCase());
};

export const generateUniqueString = () => { 
    return Math.floor(1000 + Math.random() * 9000).toString();
};

