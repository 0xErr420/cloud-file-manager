export function formatDate(dateString) {
  if (!dateString) return '-';

  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  const date = new Date(dateString);

  return new Intl.DateTimeFormat('en-US', options).format(date);
}
