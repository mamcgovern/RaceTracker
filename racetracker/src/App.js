import React, { useState, useMemo, useRef, useEffect } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import moment from 'moment-timezone';
import 'moment-timezone';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import Select from 'react-select';

// Import Firebase authentication and Firestore related modules
import { auth, db } from './firebase'; // Import both auth and db
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore'; // Import Firestore functions
import SignIn from './SignIn';
import Navbar from './Navbar';

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
    'F1': 'f1',
    'Taylor Swift': 'ts',
    'Nascar': 'nascar'
};

// --- New component for creating events (only visible to admins) ---
const CreateEventForm = ({ user, onCreateEvent }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(''); // MM/DD/YYYY format
    const [time, setTime] = useState(''); // HH:MM AM/PM format
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [description, setDescription] = useState('');
    const [formError, setFormError] = useState('');
    const [formLoading, setFormLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setFormLoading(true);

        // Basic validation
        if (!title || !date || !category) {
            setFormError('Title, Date, and Category are required.');
            setFormLoading(false);
            return;
        }

        const newEvent = {
            title,
            date,
            time: time || '', // Allow empty time
            location: location || '',
            category,
            subcategory: subcategory || '', // Allow empty subcategory
            description: description || '',
            // Add a timestamp for ordering, and the creator's UID
            createdAt: new Date(),
            createdBy: user.uid,
            creatorEmail: user.email
        };

        try {
            await onCreateEvent(newEvent); // Call the prop function to add to Firestore
            // Clear form
            setTitle('');
            setDate('');
            setTime('');
            setLocation('');
            setCategory('');
            setSubcategory('');
            setDescription('');
            setFormError('');
        } catch (error) {
            setFormError(`Failed to create event: ${error.message}`);
            console.error("Error creating event:", error);
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <div className="card mt-4 mb-4">
            <div className="card-header">
                <h3>Create New Event</h3>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Title:</label>
                        <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Date (MM/DD/YYYY):</label>
                        <input type="text" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Time (e.g., 8:00 AM, optional):</label>
                        <input type="text" className="form-control" value={time} onChange={(e) => setTime(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Location (optional):</label>
                        <input type="text" className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Category:</label>
                        <input type="text" className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Subcategory (optional):</label>
                        <input type="text" className="form-control" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Description (optional):</label>
                        <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} rows="3"></textarea>
                    </div>
                    {formError && <div className="alert alert-danger">{formError}</div>}
                    <button type="submit" className="btn btn-success" disabled={formLoading}>
                        {formLoading ? 'Creating...' : 'Create Event'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const MainAppContent = ({ user, handleLogout }) => {
    // New state for events (will be fetched from Firestore)
    const [events, setEvents] = useState([]);
    const [isEventsLoading, setIsEventsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false); // New state to track admin status

    // ... (rest of your state variables are unchanged) ...
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

    // --- EFFECT HOOKS ---

    // 1. Effect for handleClickOutside (unchanged)
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
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showCategoryPopup]);

    // 2. NEW: Effect to fetch events from Firestore
    useEffect(() => {
        const fetchEvents = async () => {
            setIsEventsLoading(true);
            try {
                const eventsCollectionRef = collection(db, 'events');
                // Optional: Order events as you like, e.g., by date
                const q = query(eventsCollectionRef, orderBy('date', 'asc')); // Assuming 'date' field exists and is sortable
                const querySnapshot = await getDocs(q);
                const fetchedEvents = querySnapshot.docs.map(doc => ({
                    id: doc.id, // Store Firestore document ID
                    ...doc.data()
                }));
                setEvents(fetchedEvents);
            } catch (error) {
                console.error("Error fetching events from Firestore:", error);
                // Handle error (e.g., show a message to the user)
            } finally {
                setIsEventsLoading(false);
            }
        };

        fetchEvents();
    }, []); // Empty dependency array means fetch once on mount

    // 3. NEW: Effect to check user's custom claims for admin status
    useEffect(() => {
        const checkAdminStatus = async () => {
            if (user) {
                try {
                    // Force refresh ID token to get latest claims
                    const idTokenResult = await user.getIdTokenResult(true);
                    setIsAdmin(!!idTokenResult.claims.admin); // Set isAdmin based on 'admin' custom claim
                } catch (error) {
                    console.error("Error getting ID token result:", error);
                    setIsAdmin(false);
                }
            } else {
                setIsAdmin(false);
            }
        };
        checkAdminStatus();
    }, [user]); // Re-run when user object changes (e.g., after login/logout)

    // --- FUNCTIONS (adjusted to use Firestore data) ---

    // `events` is now a state variable, no longer imported from JSON
    // The `useMemo` for `sortedEvents` will now depend on the `events` state
    const sortedEvents = useMemo(() => {
        const sortableEvents = [...events]; // `events` now comes from state

        sortableEvents.sort((a, b) => {
            const momentA = moment(a.date, ['MM/DD/YYYY', 'MM/DD/YY']);
            const momentB = moment(b.date, ['MM/DD/YYYY', 'MM/DD/YY']);

            if (!momentA.isValid() || !momentB.isValid()) {
                console.warn(`Warning: Invalid date encountered during sorting. A: "${a.date}", B: "${b.date}"`);
                return 0;
            }

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
    }, [events, selectedCategories]); // Dependency on `events` state

    // `hierarchicalCategories` will also depend on `events` state
    const hierarchicalCategories = useMemo(() => {
        const categoriesWithChildren = new Map();
        const standaloneCategories = new Set();

        events.forEach(event => { // `events` now comes from state
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
    }, [events]); // Dependency on `events` state


    // NEW: Function to add a new event to Firestore
    const handleCreateEvent = async (newEventData) => {
        if (!user || !isAdmin) {
            throw new Error("You must be an admin to create events.");
        }
        try {
            const docRef = await addDoc(collection(db, 'events'), newEventData);
            // Update local state by adding the new event, ensuring 'id' is present
            setEvents(prevEvents => [{ id: docRef.id, ...newEventData }, ...prevEvents]);
            console.log("Event written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
            throw e; // Re-throw to be caught by the form
        }
    };


    // --- All other functions (unchanged from your original code) ---
    const convertToTimeZone = (date, time, timeZone) => {
        const eventDateMomentBase = moment(date, ['MM/DD/YYYY', 'MM/DD/YY']);

        if (!eventDateMomentBase.isValid()) {
            console.warn(`Warning: Invalid date in convertToTimeZone: "${date}"`);
            return { newDate: 'Invalid Date', newTime: '' };
        }

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
            year: eventDateMomentBase.year(),
            month: eventDateMomentBase.month(),
            day: eventDateMomentBase.date(),
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

    const timeZones = useMemo(() => moment.tz.names()
        .map(zone => {
            const nowInZone = moment().tz(zone);
            const offsetMinutes = nowInZone.utcOffset();
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
            const offsetA = moment().tz(a.value).utcOffset();
            const offsetB = moment().tz(b.value).utcOffset();
            if (offsetA !== offsetB) {
                return offsetA - offsetB;
            }
            return a.label.localeCompare(b.label);
        }), []);


    const calendarEvents = useMemo(() => {
        const calendarEvents = sortedEvents.map(event => {
            const eventStartMoment = moment(event.date, ['MM/DD/YYYY', 'MM/DD/YY']);

            let startMoment;

            if (event.time && event.time.trim() !== '') {
                const parts = event.time.split(' ');
                let timeString = parts[0];
                const period = parts[1];

                const [h, m] = timeString.split(':').map(Number);
                const hours = (h % 12) + (period === 'PM' ? 12 : 0);
                const minutes = m;

                startMoment = moment.tz({
                    year: eventStartMoment.year(),
                    month: eventStartMoment.month(),
                    day: eventStartMoment.date(),
                    hour: hours,
                    minute: minutes
                }, 'America/Chicago');
            } else {
                startMoment = moment.tz({
                    year: eventStartMoment.year(),
                    month: eventStartMoment.month(),
                    day: eventStartMoment.date(),
                    hour: 0,
                    minute: 0
                }, 'America/Chicago');
            }

            const displayMoment = startMoment.tz(activeOption);

            const allDay = !event.time || event.time.trim() === '';

            let endMoment = displayMoment.clone();
            if (!allDay) {
                endMoment.add(5, 'hour');
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
    }, [sortedEvents, activeOption]);

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
            }
            else {
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
        const currentDateMoment = moment().startOf('day');
        const eventDateMoment = moment(event.date, ['MM/DD/YYYY', 'MM/DD/YY']);

        const { newDate, newTime } = convertToTimeZone(event.date, event.time, activeOption);

        if (!eventDateMoment.isValid()) {
            console.warn(`Warning: Skipping event with invalid date in renderEvent: "${event.date}"`);
            return null;
        }

        if (showAllEvents || eventDateMoment.isSameOrAfter(currentDateMoment)) {
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


    // --- JSX Return for MainAppContent ---
    if (isEventsLoading) {
        return (
            <div>
                <Navbar />
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container-fluid">
                        <span className="navbar-brand">Welcome, {user.email}</span>
                        <button className="btn btn-outline-danger" onClick={handleLogout}>
                            Log Out
                        </button>
                    </div>
                </nav>
                <div className="container mt-4">
                    <p>Loading events...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <span className="navbar-brand">Welcome, {user.email}</span>
                    <button className="btn btn-outline-danger" onClick={handleLogout}>
                        Log Out
                    </button>
                </div>
            </nav>

            <div className="container">
                 {/* Conditionally render CreateEventForm for admins */}
                {isAdmin && (
                    <CreateEventForm user={user} onCreateEvent={handleCreateEvent} />
                )}

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
                            key={activeOption + '-' + selectedCategories.size} // Re-renders calendar when timezone or categories change
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
};

const EventDetailsPopup = ({ event, onClose, activeTimeZone }) => {
    if (!event) return null;

    const eventDateMomentBase = moment(event.date, ['MM/DD/YYYY', 'MM/DD/YY']);

    if (!eventDateMomentBase.isValid()) {
        console.error(`Error: Invalid event date in EventDetailsPopup: "${event.date}"`);
        return null;
    }

    let eventMoment;
    const year = eventDateMomentBase.year();
    const month = eventDateMomentBase.month();
    const day = eventDateMomentBase.date();

    if (event.time && event.time.trim() !== '') {
        const parts = event.time.split(' ');
        let timeString = parts[0];
        const period = parts[1];

        const [h, m] = timeString.split(':').map(Number);
        const hours = (h % 12) + (period === 'PM' ? 12 : 0);
        const minutes = m;

        eventMoment = moment.tz({
            year: year,
            month: month,
            day: day,
            hour: hours,
            minute: minutes
        }, 'America/Chicago');
    } else {
        eventMoment = moment.tz({
            year: year,
            month: month,
            day: day,
            hour: 0,
            minute: 0
        }, 'America/Chicago');
    }

    const displayMoment = eventMoment.tz(activeTimeZone);

    const displayDate = displayMoment.format('ddd, MMM D, YYYY'); // Added YYYY for clarity
    const displayTime = event.time ? displayMoment.format('h:mm A z (Z)') : 'All Day';

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


const App = () => {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => { // Made async to get claims
            setUser(currentUser);
            // If a user is logged in, attempt to refresh their token to get latest claims
            if (currentUser) {
                try {
                    await currentUser.getIdToken(true); // Force token refresh
                } catch (error) {
                    console.error("Error refreshing token on auth state change:", error);
                }
            }
            setAuthLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log('Logged out successfully!');
        } catch (error) {
            console.error('Logout error:', error);
            alert('Failed to log out. Please try again.');
        }
    };

    const centeringWrapperClasses = "d-flex align-items-center justify-content-center py-4 bg-body-tertiary";
    const centeringWrapperStyle = { minHeight: '100vh' };

    if (authLoading) {
        return (
            <div className={centeringWrapperClasses} style={centeringWrapperStyle}>
                <div>Loading authentication...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className={centeringWrapperClasses} style={centeringWrapperStyle}>
                <SignIn />
            </div>
        );
    }

    return <MainAppContent user={user} handleLogout={handleLogout} />;
};

export default App;