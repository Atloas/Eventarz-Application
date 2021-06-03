export const initialState = {
  // username, roles
  currentUser: null,
  // uuid, name, group (uuid, name), eventDate, publishedDate, organizer (username), participantCount, maxParticipants, participants [username], joined, organized
  eventDetails: null,
  // uuid, name, founder (username), createdDate, members [username], events [uuid, name, description, eventDate, organizer (username), participantCount, maxParticipants], joined, founded
  groupDetails: null,
  // uuid, name, description?, founder? (username), memberCount
  foundGroups: [],
  // uuid, name, group, eventDate, organizer (username)
  foundEvents: [],
  // uuid, username
  foundUsers: [],
  // type, text
  message: null
}

export function reducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, currentUser: action.payload }
    case 'LOGOUT':
      return { ...state, currentUser: initialState.currentUser }
    case 'SET_MESSAGE':
      return { ...state, message: action.payload }
    case 'CLEAR_MESSAGE':
      return { ...state, message: initialState.message }
    // case 'SET_REDIRECT':
    //   return { ...state, redirect: action.payload }
    // case 'CLEAR_REDIRECT':
    //   return { ...state, message: initialState.redirect }
    // case 'SET_MY_GROUPS':
    //   return { ...state, myGroups: action.payload }
    case 'SET_FOUND_GROUPS':
      return { ...state, foundGroups: action.payload }
    case 'SET_GROUP_DETAILS':
      return { ...state, groupDetails: action.payload }
    case 'CLEAR_GROUP_DETAILS':
      return { ...state, groupDetails: initialState.groupDetails }
    // case 'SET_MY_EVENTS':
    //   return { ...state, myEvents: action.payload }
    // case 'SET_HOME_EVENTS':
    //   return { ...state, homeEvents: action.payload }
    case 'SET_FOUND_EVENTS':
      return { ...state, foundEvents: action.payload }
    case 'SET_EVENT_DETAILS':
      return { ...state, eventDetails: action.payload }
    case 'CLEAR_EVENT_DETAILS':
      return { ...state, eventDetails: initialState.eventDetails }
    case 'SET_FOUND_USERS':
      return { ...state, foundUsers: action.payload }
    default:
      return state;
  }
}
