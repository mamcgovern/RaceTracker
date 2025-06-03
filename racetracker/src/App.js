import React, { useState, useMemo, useRef, useEffect } from 'react'; // Import useRef and useEffect
import './App.css';
import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import moment from 'moment-timezone';
import Select from 'react-select';

import eventsData from './data/Events.json';

const App = () => {
    const events = useMemo(() => eventsData || [], []);

    // isSmallScreen can be removed as Bootstrap handles responsive layout for menus now
    // const isSmallScreen = window.innerWidth <= 800;

    const [showAllEvents, setShowAllEvents] = useState(false);
    const [activeOption, setActiveOption] = useState('America/Chicago');
    const [selectedCategories, setSelectedCategories] = useState(new Set());
    // --- NEW STATE FOR POPUP ---
    const [showCategoryPopup, setShowCategoryPopup] = useState(false);

    // --- REFS FOR POPUP AND BUTTON ---
    const categoryPopupRef = useRef(null);
    const categoryButtonRef = useRef(null);

    // --- useEffect for clicking outside to close popup ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if click is outside the popup and not on the button itself
            if (categoryPopupRef.current && !categoryPopupRef.current.contains(event.target) &&
                categoryButtonRef.current && !categoryButtonRef.current.contains(event.target)) {
                setShowCategoryPopup(false);
            }
        };

        if (showCategoryPopup) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showCategoryPopup]);


    const timeZones = useMemo(() => moment.tz.names().map(zone => ({
        value: zone,
        label: zone.replace(/_/g, ' ')
    })), []);

    const categoryValues = useMemo(() => {
        const categories = new Set();
        events.forEach(event => {
            if (event.category) categories.add(event.category);
            if (event.subcategory) categories.add(event.subcategory);
        });
        return Array.from(categories).sort();
    }, [events]);

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
                    style={{ margin: '5px' }}
                    onClick={() => setShowAllEvents(false)}
                >
                    Upcoming Events
                </button>
                <button
                    className={`btn ${showAllEvents ? 'btn-primary' : 'btn-outline-secondary'}`}
                    style={{ margin: '5px' }}
                    onClick={() => setShowAllEvents(true)}
                >
                    All Events
                </button>
            </div>
        );
    };

    const makeTimeZoneMenu = () => {
        return (
            <div style={{ textAlign: 'left', minWidth: '180px' }}>
                <Select
                    options={timeZones}
                    onChange={handleOptionChange}
                    value={timeZones.find(zone => zone.value === activeOption)}
                    isSearchable
                    placeholder="Select timezone..."
                />
            </div>
        );
    };

    const handleCategoryChange = (category) => {
        setSelectedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(category)) {
                newSet.delete(category);
            } else {
                newSet.add(category);
            }
            return newSet;
        });
    };

    const handleAllCategoriesToggle = () => {
        setSelectedCategories(new Set());
    };

    // --- REFACTORED: This is now just the checkbox content ---
    const CategoryCheckboxes = () => {
        return (
            <>
                <strong style={{ display: 'block', marginBottom: '5px' }}>Filter by Category:</strong>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                    <input
                        type="checkbox"
                        checked={selectedCategories.size === 0}
                        onChange={handleAllCategoriesToggle}
                    />{' '}
                    All Categories
                </label>
                {categoryValues.map(cat => (
                    <label key={cat} style={{ display: 'block', marginBottom: '5px' }}>
                        <input
                            type="checkbox"
                            checked={selectedCategories.has(cat)}
                            onChange={() => handleCategoryChange(cat)}
                        />{' '}
                        {cat}
                    </label>
                ))}
            </>
        );
    };

    // --- NEW: Category Filter Popup Component ---
    const CategoryFilterPopup = () => {
        return (
            // This div provides the relative positioning context for the popup
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <button
                    ref={categoryButtonRef} // Attach ref to the button
                    className="btn btn-outline-secondary" // Or btn-primary
                    onClick={() => setShowCategoryPopup(prev => !prev)}
                    style={{ marginLeft: '10px' }} // Spacing from timezone selector
                >
                    Filter Categories
                </button>

                {showCategoryPopup && (
                    <div
                        ref={categoryPopupRef} // Attach ref to the popup content
                        style={{
                            position: 'absolute',
                            top: '100%', // Position directly below the button
                            right: 0,   // Align to the right of the button
                            zIndex: 1000, // Ensure it's on top of other content
                            backgroundColor: 'white', // Ensure good contrast
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            padding: '15px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            minWidth: '200px',
                            color: 'black' // Text color for contrast on white background
                        }}
                    >
                        {CategoryCheckboxes()} {/* Render the checkbox content */}
                    </div>
                )}
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
            'Flo': 'flo',
            'F1': 'f1'
        };
        return (
            <button className={`unclickable-button ${classNames[event.subcategory] || classNames[event.category] || classNames['Other']}`}>
                {event.title}
                {event.location && (
                    <>
                        <br />
                        <span style={{ fontSize: 'smaller', fontStyle: 'italic' }}>
                            {event.location}
                        </span>
                    </>
                )}
            </button>
        );
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

        if (selectedCategories.size === 0) {
            return sortableEvents;
        } else {
            return sortableEvents.filter(event =>
                selectedCategories.has(event.category) || selectedCategories.has(event.subcategory)
            );
        }
    }, [events, selectedCategories]);

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

                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center mb-4">
                    <div className="mb-3 mb-lg-0 text-center">
                        {makeMenu()}
                    </div>

                    <div className="d-flex flex-column flex-md-row align-items-center ms-lg-auto">
                        <div className="me-md-3 mb-3 mb-md-0">
                            {makeTimeZoneMenu()}
                        </div>
                        {/* --- REPLACED makeCategoryMenu WITH CategoryFilterPopup --- */}
                        <CategoryFilterPopup />
                    </div>
                </div>

                <hr className="featurette-divider" />
                {allEvents}
            </div>
        </div>
    );
}

export default App;