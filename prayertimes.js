import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const PrayerTimes = () => {
  const [location, setLocation] = useState(null);
  const [times, setTimes] = useState({ sehri: '', iftar: '' });
  const [error, setError] = useState(null);
  const [showButton, setShowButton] = useState(true);
  const [loading, setLoading] = useState(true);

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
  
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
  
      const todayResponse = await axios.get(`https://api.aladhan.com/v1/timings/${formatDate(today)}`, {
        params: {
          latitude,
          longitude,
          method: 4,
          iso8601: true,
          tune: '0,-3,0,0,0,+4,0,0,0',
        },
      });
      const tomorrowResponse = await axios.get(`https://api.aladhan.com/v1/timings/${formatDate(tomorrow)}`, {
        params: {
          latitude,
          longitude,
          method: 4,
          iso8601: true,
          tune: '0,-3,0,0,0,+4,0,0,0',
        },
      });
      const { data: todayData } = todayResponse;
      const { data: tomorrowData } = tomorrowResponse;
  console.log(todayData)
      if (todayData.code === 200 && tomorrowData.code === 200) {
        const { Fajr: todaySehri, Maghrib: todayIftar } = todayData.data.timings;
        const { Fajr: tomorrowSehri, Maghrib: tomorrowIftar } = tomorrowData.data.timings;
        setLoading(false);
  
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
      setLoading(false);
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
    const currentDate = new Date();
    const prayerDate = new Date(times[prayerType].today);
    return (
      prayerDate.getDate() > currentDate.getDate() ||
      (prayerDate.getDate() === currentDate.getDate() &&
        prayerDate.getTime() > currentDate.getTime())
    );
  };

  return (
    <div className="bg-gradient-to-br from-red-900 to-black shadow-lg rounded-sm p-6 mx-auto max-w-md mt-4">
      <h2 className="text-3xl font-bold mb-6 text-white text-center hidden">Ramadan Times</h2>
      {loading ? (
        <div className="flex justify-center">
          <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : (
        <>
          <div className="flex justify-around">
        <div className="text-center">
          <span className="inline-block bg-red-600 text-white px-3 py-1 rounded-full mb-2">
            Sehri Time
          </span>
          <p className="text-white font-semibold text-lg">
            {isTomorrow('sehri')
              ? `T'mrw ${getFormattedTime(times.sehri.tomorrow)}`
              : getFormattedTime(times.sehri.today)}
          </p>
        </div>
        <div className="text-center">
          <span className="inline-block bg-white text-black px-3 py-1 rounded-full mb-2">
            Iftar Time
          </span>
          <p className="text-white font-semibold text-lg">
            {isTomorrow('iftar')
              ? `T'mrw ${getFormattedTime(times.iftar.tomorrow)}`
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
      </>
      )}
    </div>
  );
};

export default PrayerTimes;
