export function formatRelativeDate(dateString) {
  if (!dateString) return null;
  const target = new Date(dateString + 'T00:00:00');
  const now = new Date();
  
  // reset hours for pure date comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const compareDate = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  
  const diffTime = compareDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return { text: 'Today', status: 'today' };
  if (diffDays === 1) return { text: 'Tomorrow', status: 'tomorrow' };
  if (diffDays === -1) return { text: 'Yesterday', status: 'overdue' };
  if (diffDays < -1) {
    return {
      text: `${Math.abs(diffDays)}d overdue`,
      status: 'overdue'
    };
  }

  // Format as readable date (e.g., Oct 25)
  const options = { month: 'short', day: 'numeric' };
  return {
    text: target.toLocaleDateString(undefined, options),
    status: 'upcoming'
  };
}

export function isOverdue(dateString) {
  if (!dateString) return false;
  const target = new Date(dateString + 'T23:59:59');
  return target.getTime() < Date.now();
}

export function isDueToday(dateString) {
  if (!dateString) return false;
  const target = new Date(dateString + 'T00:00:00');
  const now = new Date();
  return (
    target.getFullYear() === now.getFullYear() &&
    target.getMonth() === now.getMonth() &&
    target.getDate() === now.getDate()
  );
}
