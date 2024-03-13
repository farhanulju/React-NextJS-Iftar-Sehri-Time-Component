import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const PrayerTimes = () => {
  const [location, setLocation] = useState(null);
  const [times, setTimes] = useState({ sehri: '', iftar: '' });
  const [error, setError] = useState(null);
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    const consentCookie = Cookies.get('locationConsent');
    if (consentCookie === 'true') {
      setShowButton(false);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          fetchPrayerTimes(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          setError(error.message);
          fetchPrayerTimes(23.8210796, 90.3394617);
        }
      );
    } else {
      fetchPrayerTimes(23.8210796, 90.3394617);
    }
  }, []);

  const fetchPrayerTimes = async (latitude, longitude) => {
    try {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayResponse = await axios.get(`http://api.aladhan.com/v1/timings/${today.toLocaleDateString('en-GB').split('/').join('-')}`, {
        params: {
          latitude,
          longitude,
          method: 4,
          iso8601: true,
          tune: '0,-2,0,0,0,+4,0,0,0',
        },
      });
      const tomorrowResponse = await axios.get(`http://api.aladhan.com/v1/timings/${tomorrow.toLocaleDateString('en-GB').split('/').join('-')}`, {
        params: {
          latitude,
          longitude,
          method: 4,
          iso8601: true,
          tune: '0,-2,0,0,0,+4,0,0,0',
        },
      });
      const { data: todayData } = todayResponse;
      const { data: tomorrowData } = tomorrowResponse;

      if (todayData.code === 200 && tomorrowData.code === 200) {
        const { Fajr: todaySehri, Maghrib: todayIftar } = todayData.data.timings;
        const { Fajr: tomorrowSehri, Maghrib: tomorrowIftar } = tomorrowData.data.timings;

        setTimes({
          sehri: {
            today: todaySehri,
            tomorrow: tomorrowSehri,
          },
          iftar: {
            today: todayIftar,
            tomorrow: tomorrowIftar,
          },
        });
      }
    } catch (error) {
      console.error('Error fetching prayer times:', error);
    }
  };

  const handleLocationConsent = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        fetchPrayerTimes(position.coords.latitude, position.coords.longitude);
        setShowButton(false);
        Cookies.set('locationConsent', 'true', { expires: 365 });
      },
      (error) => {
        setError(error.message);
      }
    );
  };

  const getFormattedTime = (isoTime) => {
    const prayerTime = new Date(isoTime);
    return prayerTime.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Dhaka',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const isTomorrow = (prayerType) => {
    const currentTime = new Date();
    const prayerTime = new Date(times[prayerType].today);
    return prayerTime < currentTime;
  };

  return (
    <div className="bg-gradient-to-br from-red-900 to-black shadow-lg rounded-lg p-6 mx-auto max-w-md mt-4">
      <h2 className="text-3xl font-bold mb-6 text-white text-center hidden">Ramadan Times</h2>
      <div className="flex justify-around">
        <div className="text-center">
          <span className="inline-block bg-red-600 text-white px-4 py-2 rounded-full mb-2">
            Sehri Time
          </span>
          <p className="text-white font-semibold text-xl">
            {isTomorrow('sehri')
              ? `Tomorrow ${getFormattedTime(times.sehri.tomorrow)}`
              : getFormattedTime(times.sehri.today)}
          </p>
        </div>
        <div className="text-center">
          <span className="inline-block bg-white text-black px-4 py-2 rounded-full mb-2">
            Iftar Time
          </span>
          <p className="text-white font-semibold text-xl">
            {isTomorrow('iftar')
              ? `Tomorrow ${getFormattedTime(times.iftar.tomorrow)}`
              : getFormattedTime(times.iftar.today)}
          </p>
        </div>
      </div>
      {showButton && (
        <div className="text-center mt-6">
          <button
            className="bg-red-900 text-white px-3 py-1 rounded-md text-sm"
            onClick={handleLocationConsent}
          >
            Based on Mirpur. Get yours now.
          </button>
          {error && (
            <p className="text-white text-center">{error}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PrayerTimes;

