export const loginAction = currentUser => ({
  type: 'LOGIN',
  payload: currentUser
})

export const logoutAction = () => ({
  type: 'LOGOUT'
})

export const setMessageAction = message => ({
  type: 'SET_MESSAGE',
  payload: message
})

export const clearMessageAction = () => ({
  type: 'CLEAR_MESSAGE'
})

export const setFoundGroupsAction = foundGroups => ({
  type: 'SET_FOUND_GROUPS',
  payload: foundGroups
})

export const setGroupDetailsAction = groupDetails => ({
  type: 'SET_GROUP_DETAILS',
  payload: groupDetails
})

export const clearGroupDetailsAction = () => ({
  type: 'CLEAR_GROUP_DETAILS'
})

export const setFoundEventsAction = foundEvents => ({
  type: 'SET_FOUND_EVENTS',
  payload: foundEvents
})

export const setEventDetailsAction = eventDetails => ({
  type: 'SET_EVENT_DETAILS',
  payload: eventDetails
})

export const clearEventDetailsAction = () => ({
  type: 'CLEAR_EVENT_DETAILS'
})

export const setFoundUsersAction = foundUsers => ({
  type: 'SET_FOUND_USERS',
  payload: foundUsers
})