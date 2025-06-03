import React, { useState, useMemo } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import moment from 'moment-timezone';
import Select from 'react-select';

import eventsData from './data/Events.json';

const App = () => {
    // --- CHANGE IS HERE ---
    // Change the dependency array from [eventsData] to []
    const events = useMemo(() => eventsData || [], []);

    const isSmallScreen = window.innerWidth <= 800;

    const [showAllEvents, setShowAllEvents] = useState(false);
    const [activeOption, setActiveOption] = useState('America/Chicago');

    const timeZones = useMemo(() => moment.tz.names().map(zone => ({
        value: zone,
        label: zone.replace(/_/g, ' ')
    })), []);

    const convertToTimeZone = (date, time, timeZone) => {
        const [month, day, year] = date.split('/').map(Number);

        let hours = 0;
        let minutes = 0;
        let period = 'AM';

        if (time && time.trim() !== '') {
            const parts = time.split(' ');
            let timeString = parts[0];
            period = parts[1];

            if (timeString && timeString.includes(':')) {
                const [h, m] = timeString.split(':').map(Number);
                hours = h;
                minutes = m;
            }
        }

        let eventDate = moment.tz({
            year: 2000 + year,
            month: month - 1,
            day: day,
            hour: (hours % 12) + (period === 'PM' ? 12 : 0),
            minute: minutes
        }, 'America/Chicago');

        eventDate = eventDate.tz(timeZone);

        const newDate = eventDate.format('ddd, MMM D');
        const newTime = (time && time.trim() !== '') ? eventDate.format('h:mm A') : '';

        return { newDate, newTime };
    };

    const handleOptionChange = (selectedOption) => {
        setActiveOption(selectedOption.value);
    };

    const makeMenu = () => {
        return (
            <div>
                <button
                    className={`btn ${showAllEvents ? 'btn-outline-secondary' : 'btn-primary'}`}
                    style={{ textAlign: 'center', margin: '10px' }}
                    onClick={() => setShowAllEvents(false)}
                >
                    Upcoming Events
                </button>
                <button
                    className={`btn ${showAllEvents ? 'btn-primary' : 'btn-outline-secondary'}`}
                    style={{ textAlign: 'center', margin: '10px' }}
                    onClick={() => setShowAllEvents(true)}
                >
                    All Events
                </button>
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
            'Other': 'other',
            'World of Outlaws': 'woo',
            'Lucas Oil': 'lolms',
            'Flo': 'flo'
        };
        return (<button className={`unclickable-button ${classNames[event.subcategory] || classNames[event.category] || classNames['Other']}`}>{event.title}</button>);
    };

    const sortedEvents = useMemo(() => {
        const sortableEvents = [...events];

        sortableEvents.sort((a, b) => {
            const [monthA, dayA, yearA] = a.date.split('/').map(Number);
            const momentA = moment({ year: 2000 + yearA, month: monthA - 1, day: dayA });

            const [monthB, dayB, yearB] = b.date.split('/').map(Number);
            const momentB = moment({ year: 2000 + yearB, month: monthB - 1, day: dayB });

            return momentA.diff(momentB);
        });
        return sortableEvents;
    }, [events]);

    const renderEvent = (event) => {
        const currentDate = new Date();
        const [month, day, year] = event.date.split('/').map(Number);
        const eventDate = new Date(2000 + year, month - 1, day);

        const { newDate, newTime } = convertToTimeZone(event.date, event.time, activeOption);

        if (showAllEvents || eventDate >= currentDate) {
            return (
                <div key={event.title}>
                    <div className="row">
                        <div className="col" style={{ textAlign: 'right' }}>
                            <p className="lead title">
                                {newDate}
                                {newTime && <em className="date"> @ {newTime}</em>}
                            </p>
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

    const allEvents = sortedEvents.map((el) => (
        <React.Fragment key={el.title}>
            {renderEvent(el)}
        </React.Fragment>
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