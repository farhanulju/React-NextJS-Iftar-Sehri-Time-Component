# Ramadan Prayer Times Component

This is a React component that displays the Sehri and Iftar prayer times for Ramadan. It fetches the prayer times based on the user's location or defaults to the coordinates of Dhaka, Bangladesh if the user hasn't provided their location.

## Features

- Displays Sehri and Iftar prayer times for the current day and the next day.
- Automatically fetches prayer times based on the user's location (if consent is given).
- Fallbacks to the coordinates of Dhaka, Bangladesh if the user's location is not available.
- Stores the user's location consent in a cookie to avoid prompting for consent on subsequent visits.
- Provides a button to allow users to easily provide their location and get personalized prayer times.

## Installation

To use this component in your React or Next.js project, follow these steps:

1. Install the required dependencies:

```bash
npm install axios js-cookie
```

2. Copy the `PrayerTimes.js` file into your project's components directory.

3. Import the `PrayerTimes` component into the desired page or component where you want to display the prayer times:

```jsx
import PrayerTimes from './components/PrayerTimes';
```

4. Use the `PrayerTimes` component in your JSX:

```jsx
<PrayerTimes />
```

## Usage

The `PrayerTimes` component can be customized using the following props:

- `latitude` (optional): The latitude coordinate for the location. Defaults to `23.8210796` (Dhaka, Bangladesh).
- `longitude` (optional): The longitude coordinate for the location. Defaults to `90.3394617` (Dhaka, Bangladesh).

Example usage with custom coordinates:

```jsx
<PrayerTimes latitude={40.7128} longitude={-74.0060} />
```

## Dependencies

This component relies on the following dependencies:

- `axios`: Used for making HTTP requests to fetch prayer times from the API.
- `js-cookie`: Used for storing and retrieving the user's location consent in a cookie.

Make sure to install these dependencies before using the component.

## API

The component fetches prayer times from the Al Adhan API (http://api.aladhan.com/). It uses the following endpoints:

- `http://api.aladhan.com/v1/timings/{date}`: Fetches prayer times for a specific date.

The API requires the following parameters:

- `latitude`: The latitude coordinate of the location.
- `longitude`: The longitude coordinate of the location.
- `method`: The calculation method for prayer times. Set to `4` in this component.
- `iso8601`: Set to `true` to receive prayer times in ISO 8601 format.
- `tune`: Adjustments for prayer times. Set to `'0,-2,0,0,0,+4,0,0,0'` in this component. Check [aladhan](https://aladhan.com/calculation-methods) for details

## Styling

The component uses Tailwind CSS classes for styling. Make sure you have Tailwind CSS set up in your project for the styles to take effect.

You can customize the styles by modifying the CSS classes in the component's JSX.

## License

This component is open-source and available under the [MIT License](https://opensource.org/licenses/MIT). Feel free to use, modify, and distribute it as needed.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request on the GitHub repository.
