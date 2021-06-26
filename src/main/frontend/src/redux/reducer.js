export const initialState = {
  currentUser: null,
  eventDetails: null,
  groupDetails: null,
  foundGroups: [],
  foundEvents: [],
  foundUsers: [],
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
    case 'SET_FOUND_GROUPS':
      return { ...state, foundGroups: action.payload }
    case 'SET_GROUP_DETAILS':
      return { ...state, groupDetails: action.payload }
    case 'CLEAR_GROUP_DETAILS':
      return { ...state, groupDetails: initialState.groupDetails }
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
