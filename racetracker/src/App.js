import React, { useState } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import moment from 'moment-timezone';
import Select from 'react-select';

import eventsData from './data/Events.json';

const App = () => {
    const events = eventsData;

    const isSmallScreen = window.innerWidth <= 800;

    const [showAllEvents, setShowAllEvents] = useState(false);
    const [activeOption, setActiveOption] = useState('America/Chicago');

    const timeZones = moment.tz.names().map(zone => ({
        value: zone,
        label: zone.replace(/_/g, ' ')
    }));

    const convertToTimeZone = (date, time, timeZone) => {
        const [month, day, year] = date.split('/').map(Number);
        const [timeString, period] = time.split(' ');
        const [hours, minutes] = timeString.split(':').map(Number);

        let eventDate = moment.tz({
            year: 2000 + year,
            month: month - 1, // Month is 0-indexed in JavaScript Date and Moment
            day: day,
            hour: hours % 12 + (period === 'PM' ? 12 : 0), // Adjust for AM/PM
            minute: minutes
        }, 'America/Chicago'); // Assuming source timezone is America/Chicago

        eventDate = eventDate.tz(timeZone); // Convert to the selected timezone

        // **** THIS IS THE LINE TO CHANGE ****
        const newDate = eventDate.format('ddd, MMM D'); // Updated format

        const newTime = eventDate.format('h:mm A'); // Keep time format as is

        return { newDate, newTime };
    };

    const handleOptionChange = (selectedOption) => {
        setActiveOption(selectedOption.value);
    };

    const makeMenu = () => {
        return (
            <div>
                <button className={`btn ${showAllEvents ? 'btn-outline-secondary' : 'btn-primary'}`} style={{ textAlign: 'center', margin: '10px' }} onClick={() => setShowAllEvents(false)}>Upcoming Events</button>
                <button className={`btn ${showAllEvents ? 'btn-primary' : 'btn-outline-secondary'}`} style={{ textAlign: 'center', margin: '10px' }} onClick={() => setShowAllEvents(true)}>All Events</button>
            </div>
        );
    };

    const makeTimeZoneMenu = () => {
        return (
            <div style={{ width: isSmallScreen ? 'auto' : '25%', margin: 'auto', textAlign: 'left' }}>
                <Select
                    options={timeZones}
                    onChange={handleOptionChange}
                    value={timeZones.find(zone => zone.value === activeOption)}
                    isSearchable
                />
            </div>
        );
    };

    const singleEvent = (event) => {
        const classNames = {
            'Concert': 'concert',
            'Ceremony': 'ceremony',
            'Release': 'release',
            'Football': 'football',
            'Other': 'other'
        };

        return (<button className={`unclickable-button ${classNames[event.category] || classNames['Other']}`}>{event.title}</button>);
    };

    const renderEvent = (event) => {
        const currentDate = new Date();
        const [month, day, year] = event.date.split('/').map(Number);
        const eventDate = new Date(2000 + year, month - 1, day);

        const { newDate, newTime } = event.time ? convertToTimeZone(event.date, event.time, activeOption) : { newDate: event.date, newTime: '' };

        if (showAllEvents || eventDate >= currentDate) {
            return (
                <div key={event.title}>
                    <div className="row">
                        <div className="col" style={{ textAlign: 'right' }}>
                            <p className="lead title">{newDate} {newTime && <em className="date">@ {newTime}</em>}</p>
                        </div>
                        <div className="col">
                            {singleEvent(event)}
                        </div>
                    </div>
                    <hr className="featurette-divider" />
                </div>
            );
        }
        return null;
    };

    const allEvents = events.map((el) => (
        <div key={el.title}>
            {renderEvent(el)}
        </div>
    ));

    return (
        <div>
            <div className="container">
                <h1 className="page-title">Events</h1>
                <hr className="featurette-divider" />
                <div style={{ textAlign: "center" }}>
                    {makeMenu()}
                </div>
                <div style={{ textAlign: "right" }}>
                    {makeTimeZoneMenu()}
                </div>
                <hr className="featurette-divider" />
                {allEvents}
            </div>
        </div>
    );
}

export default App;