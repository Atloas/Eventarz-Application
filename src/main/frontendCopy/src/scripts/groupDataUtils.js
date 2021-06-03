export function processGroupData(data, username) {
  var joined = data.members.some(member => member.username === username);
  var founded = data.founder.username === username;
  var processedData = { ...data, founded: founded, joined: joined };
  return processedData;
}
