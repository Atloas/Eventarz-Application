export function processEventData(data, username) {
  var joined = data.participants.some(participant => participant.username === username);
  var organized = data.organizer.username === username;
  var processedData = { ...data, organized: organized, joined: joined };
  return processedData;
}
