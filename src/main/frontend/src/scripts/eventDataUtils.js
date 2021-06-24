export function processEventData(data, username) {
  var joined = data.participants.some(participant => participant.username === username);
  var organized = data.organizer.username === username;
  var processedData = { ...data, organized: organized, joined: joined };
  return processedData;
}

export function putHappenedEventsInTheBack(events) {
  var upcomingEvents = events.filter(event => !event.happened);
  var happenedEvents = events.filter(event => event.happened);
  return upcomingEvents.concat(happenedEvents)
}