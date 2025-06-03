import React, { useState, useMemo, useRef, useEffect } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import moment from 'moment-timezone';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import Select from 'react-select';

import eventsData from './data/Events.json';

const localizer = momentLocalizer(moment);

const eventClassNames = {
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

const App = () => {
    const [showAllEvents, setShowAllEvents] = useState(false);
    const [activeOption, setActiveOption] = useState('America/Chicago');
    const [selectedCategories, setSelectedCategories] = useState(new Set());
    const [showCategoryPopup, setShowCategoryPopup] = useState(false);
    const [viewMode, setViewMode] = useState('list');
    const [showEventDetailsPopup, setShowEventDetailsPopup] = useState(false);
    const [selectedEventDetails, setSelectedEventDetails] = useState(null);

    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState('month');

    const categoryPopupRef = useRef(null);
    const categoryButtonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (categoryPopupRef.current && !categoryPopupRef.current.contains(event.target) &&
                categoryButtonRef.current && !categoryButtonRef.current.contains(event.target)) {
                setShowCategoryPopup(false);
            }
        };

        if (showCategoryPopup) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        };

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showCategoryPopup]);

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

    const getParentCheckboxState = (parentItem, currentSelections) => {
        const { name: parentName, children } = parentItem;

        if (children.length === 0) {
            return {
                checked: currentSelections.has(parentName),
                indeterminate: false
            };
        }

        const selectedChildrenCount = children.filter(child => currentSelections.has(child.name)).length;

        const allChildrenSelected = selectedChildrenCount === children.length;
        const someChildrenSelected = selectedChildrenCount > 0 && selectedChildrenCount < children.length;

        return {
            checked: allChildrenSelected,
            indeterminate: someChildrenSelected
        };
    };

    const events = useMemo(() => eventsData || [], []); 

    // MODIFIED: Generate timeZones with UTC offset in labels for clarity
    const timeZones = useMemo(() => moment.tz.names()
        .map(zone => {
            // Get a moment in this timezone (e.g., for the current date)
            // to determine its offset reliably (considering DST)
            const nowInZone = moment().tz(zone);
            const offsetMinutes = nowInZone.utcOffset(); // Offset in minutes
            const offsetHours = offsetMinutes / 60;

            let formattedOffset;
            if (offsetHours === 0) {
                formattedOffset = 'UTC+0';
            } else {
                const sign = offsetHours > 0 ? '+' : '';
                formattedOffset = `UTC${sign}${offsetHours}`;
            }

            const label = zone.replace(/_/g, ' ');

            return {
                value: zone,
                label: `${label} (${formattedOffset})`
            };
        })
        .sort((a, b) => {
            // Sort by offset first, then alphabetically for better grouping
            const offsetA = moment().tz(a.value).utcOffset();
            const offsetB = moment().tz(b.value).utcOffset();
            if (offsetA !== offsetB) {
                return offsetA - offsetB;
            }
            return a.label.localeCompare(b.label);
        }), []);


    const hierarchicalCategories = useMemo(() => {
        const categoriesWithChildren = new Map();
        const standaloneCategories = new Set();

        events.forEach(event => {
            if (event.category) {
                if (event.subcategory) {
                    if (!categoriesWithChildren.has(event.category)) {
                        categoriesWithChildren.set(event.category, new Set());
                    }
                    categoriesWithChildren.get(event.category).add(event.subcategory);
                } else {
                    standaloneCategories.add(event.category);
                }
            }
        });

        categoriesWithChildren.forEach((_val, key) => standaloneCategories.delete(key));

        const result = [];

        Array.from(categoriesWithChildren.keys()).sort().forEach(categoryName => {
            const children = Array.from(categoriesWithChildren.get(categoryName)).sort();
            result.push({
                name: categoryName,
                children: children.map(subName => ({ name: subName }))
            });
        });

        Array.from(standaloneCategories).sort().forEach(categoryName => {
            result.push({ name: categoryName, children: [] });
        });

        return result;
    }, [events]);

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
            const filtered = sortableEvents.filter(event => {
                return selectedCategories.has(event.category) || selectedCategories.has(event.subcategory);
            });
            return filtered;
        }
    }, [events, selectedCategories]);

    const calendarEvents = useMemo(() => {
        const currentDate = new Date();
        const calendarEvents = sortedEvents
            .filter(event => {
                const [month, day, year] = event.date.split('/').map(Number);
                const eventDate = new Date(2000 + year, month - 1, day);
                return showAllEvents || eventDate >= currentDate;
            })
            .map(event => {
            const [month, day, year] = event.date.split('/').map(Number);
            let startMoment;

            if (event.time && event.time.trim() !== '') {
                const parts = event.time.split(' ');
                let timeString = parts[0];
                const period = parts[1];

                const [h, m] = timeString.split(':').map(Number);
                const hours = (h % 12) + (period === 'PM' ? 12 : 0);
                const minutes = m;

                startMoment = moment.tz({
                    year: 2000 + year,
                    month: month - 1,
                    day: day,
                    hour: hours,
                    minute: minutes
                }, 'America/Chicago');
            } else {
                startMoment = moment.tz({
                    year: 2000 + year,
                    month: month - 1,
                    day: day,
                    hour: 0,
                    minute: 0
                }, 'America/Chicago');
            }

            const displayMoment = startMoment.tz(activeOption);

            const allDay = !event.time || event.time.trim() === '';

            let endMoment = displayMoment.clone();
            if (!allDay) {
                endMoment.add(1, 'hour');
            } else {
                endMoment.add(1, 'day').startOf('day');
            }

            return {
                title: event.title,
                start: displayMoment.toDate(),
                end: endMoment.toDate(),
                allDay: allDay,
                resource: event
            };
        });
        return calendarEvents;
    }, [sortedEvents, activeOption, showAllEvents]);

    const handleOptionChange = (selectedOption) => {
        setActiveOption(selectedOption.value);
    };

    const handleParentCategoryChange = (parentItem) => {
        setSelectedCategories(prev => {
            const newSet = new Set(prev);
            const { name: parentName, children } = parentItem;

            const { checked: isFullyChecked, indeterminate: isIndeterminate } = getParentCheckboxState(parentItem, prev);

            if (isFullyChecked || isIndeterminate) {
                newSet.delete(parentName);
                children.forEach(child => newSet.delete(child.name));
            } else {
                newSet.add(parentName);
                children.forEach(child => newSet.add(child.name));
            }
            return newSet;
        });
    };

    const handleChildCategoryChange = (childName, parentItem) => {
        setSelectedCategories(prev => {
            const newSet = new Set(prev);
            const { name: parentName, children } = parentItem;

            if (newSet.has(childName)) {
                newSet.delete(childName);
            } else {
                newSet.add(childName);
            }

            const { checked: isParentNowChecked, indeterminate: isParentNowIndeterminate } = getParentCheckboxState(parentItem, newSet);

            if (isParentNowChecked) {
                newSet.add(parentName);
            } else if (isParentNowIndeterminate) {
                newSet.delete(parentName);
            } else {
                 newSet.delete(parentName);
            }
            return newSet;
        });
    };

    const handleAllCategoriesToggle = () => {
        setSelectedCategories(new Set());
    };

    const makeMenu = () => {
        return (
            <div>
                <button
                    className={`btn ${viewMode === 'list' && !showAllEvents ? 'btn-primary' : 'btn-outline-secondary'}`}
                    style={{ margin: '5px' }}
                    onClick={() => { setViewMode('list'); setShowAllEvents(false); }}
                >
                    Upcoming Events
                </button>
                <button
                    className={`btn ${viewMode === 'list' && showAllEvents ? 'btn-primary' : 'btn-outline-secondary'}`}
                    style={{ margin: '5px' }}
                    onClick={() => { setViewMode('list'); setShowAllEvents(true); }}
                >
                    All Events
                </button>
                <button
                    className={`btn ${viewMode === 'calendar' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    style={{ margin: '5px' }}
                    onClick={() => setViewMode('calendar')}
                >
                    Calendar View
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
                <hr style={{ borderTop: '1px solid #eee', margin: '10px 0' }} />

                {hierarchicalCategories.map(item => (
                    <div key={item.name} style={{ marginBottom: '5px' }}>
                        <label style={{ display: 'block' }}>
                            <input
                                type="checkbox"
                                ref={el => {
                                    if (el) {
                                        const { checked, indeterminate } = getParentCheckboxState(item, selectedCategories);
                                        el.checked = checked;
                                        el.indeterminate = indeterminate;
                                    }
                                }}
                                onChange={() => handleParentCategoryChange(item)}
                            />{' '}
                            {item.name}
                        </label>
                        {item.children.length > 0 && (
                            <div style={{ marginLeft: '20px', borderLeft: '1px dotted #ccc', paddingLeft: '5px' }}>
                                {item.children.map(child => (
                                    <label key={child.name} style={{ display: 'block', marginBottom: '5px' }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.has(child.name)}
                                            onChange={() => handleChildCategoryChange(child.name, item)}
                                        />{' '}
                                        {child.name}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </>
        );
    };

    const CategoryFilterPopup = () => {
        return (
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <button
                    ref={categoryButtonRef}
                    className="btn btn-outline-secondary"
                    onClick={() => setShowCategoryPopup(prev => !prev)}
                    style={{ marginLeft: '10px' }}
                >
                    Filter Categories
                </button>

                {showCategoryPopup && (
                    <div
                        ref={categoryPopupRef}
                        style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            zIndex: 1000,
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            padding: '15px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            minWidth: '220px',
                            color: 'black'
                        }}
                    >
                        {CategoryCheckboxes()}
                    </div>
                )}
            </div>
        );
    };

    const singleEvent = (event) => {
        const className = eventClassNames[event.subcategory] || eventClassNames[event.category] || eventClassNames['Other'];

        if(event.subcategory !== "") {
            return (
                <button className={`unclickable-button ${className}`}>
                    {event.subcategory && (
                        <>
                            <span style={{ fontSize: 'larger'}}>
                                {event.subcategory}
                            </span>
                        </>
                    )}
                    {event.title && (
                        <>
                            <br />
                            <span>
                                {event.title}
                            </span>
                        </>
                    )}
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
        }
        return (
            <button className={`unclickable-button ${className}`}>
                {event.category && (
                    <>
                        <span style={{ fontSize: 'larger'}}>
                            {event.category}
                        </span>
                    </>
                )}
                {event.title && (
                    <>
                        <br />
                        <span>
                            {event.title}
                        </span>
                    </>
                )}
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

    const renderEvent = (event) => {
        const currentDate = new Date();
        const [month, day, year] = event.date.split('/').map(Number);
        const eventDate = new Date(2000 + year, month - 1, day);

        const { newDate, newTime } = convertToTimeZone(event.date, event.time, activeOption);

        if (showAllEvents || eventDate >= currentDate) {
            return (
                <div key={`${event.title}-${event.date}`}>
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
        <React.Fragment key={`${el.title}-${el.date}`}>
            {renderEvent(el)}
        </React.Fragment>
    ));

    const eventPropGetter = (event) => {
        const originalEvent = event.resource;
        const categoryClass = eventClassNames[originalEvent.subcategory] ||
                              eventClassNames[originalEvent.category] ||
                              eventClassNames['Other'];
        return {
            className: categoryClass,
        };
    };

    const handleSelectCalendarEvent = (calendarEvent) => {
        setSelectedEventDetails(calendarEvent.resource);
        setShowEventDetailsPopup(true);
    };

    const handleCloseEventDetailsPopup = () => {
        setShowEventDetailsPopup(false);
        setSelectedEventDetails(null);
    };

    const handleNavigate = (newDate) => {
        setCurrentDate(newDate);
    };

    const handleViewChange = (newView) => {
        setCurrentView(newView);
    };

    return (
        <div>
            <div className="container">

                <div className="mb-4">
                    <div className="d-flex justify-content-center mb-3">
                        {makeMenu()}
                    </div>

                    <div className="d-flex flex-column flex-md-row justify-content-center align-items-center">
                        <div className="me-md-3 mb-3 mb-md-0">
                            {makeTimeZoneMenu()}
                        </div>
                        <CategoryFilterPopup />
                    </div>
                </div>

                <hr className="featurette-divider" />

                {viewMode === 'list' ? (
                    allEvents
                ) : (
                    <div style={{ height: '700px', margin: '20px 0' }}>
                        <Calendar
                            localizer={localizer}
                            events={calendarEvents}
                            startAccessor="start"
                            endAccessor="end"
                            eventPropGetter={eventPropGetter}
                            onSelectEvent={handleSelectCalendarEvent}
                            date={currentDate}
                            view={currentView}
                            onNavigate={handleNavigate}
                            onView={handleViewChange}
                            key={activeOption + '-' + selectedCategories.size + '-' + showAllEvents}
                            style={{ height: '100%' }}
                            views={['month', 'week', 'day', 'agenda']}
                            scrollToTime={moment().toDate()}
                        />
                    </div>
                )}
            </div>

            {showEventDetailsPopup && selectedEventDetails && (
                <EventDetailsPopup
                    event={selectedEventDetails}
                    onClose={handleCloseEventDetailsPopup}
                    activeTimeZone={activeOption}
                />
            )}
        </div>
    );
}

const EventDetailsPopup = ({ event, onClose, activeTimeZone }) => {
    if (!event) return null;

    const [month, day, year] = event.date.split('/').map(Number);
    let eventMoment = moment.tz({
        year: 2000 + year,
        month: month - 1,
        day: day,
        hour: event.time ? (parseInt(event.time.split(':')[0]) % 12) + (event.time.includes('PM') ? 12 : 0) : 0,
        minute: event.time ? parseInt(event.time.split(':')[1]) : 0
    }, 'America/Chicago'); // Assuming original data is always in America/Chicago

    const displayMoment = eventMoment.tz(activeTimeZone);

    const displayDate = displayMoment.format('ddd, MMM D, YYYY');
    const displayTime = event.time ? displayMoment.format('h:mm A z') : 'All Day'; // 'z' displays the timezone abbreviation

    return (
        <div className="event-details-overlay">
            <div className="event-details-popup">
                <button className="close-button" onClick={onClose}>&times;</button>
                <h2>{event.title}</h2>
                <p><strong>Date:</strong> {displayDate}</p>
                <p><strong>Time:</strong> {displayTime}</p>
                {event.location && <p><strong>Location:</strong> {event.location}</p>}
                {event.category && <p><strong>Category:</strong> {event.category}</p>}
                {event.subcategory && <p><strong>Subcategory:</strong> {event.subcategory}</p>}
                {event.description && <p><strong>Description:</strong> {event.description}</p>}
            </div>
        </div>
    );
};

export default App;