export const downloadCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV values
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const prepareBookingHistoryData = (bookings: any[]) => {
  return bookings.map(booking => ({
    'Booking ID': booking.id,
    'Desk/Office': booking.deskId,
    'Date': booking.date,
    'Time': booking.time || 'N/A',
    'Status': booking.status,
    'Type': booking.type || 'desk',
  }));
};

export const prepareEmployeeHistoryData = (employee: any) => {
  const mockHistory = [
    { date: '2024-01-15', action: 'Checked in', desk: 'OP-15', time: '09:30', duration: '8 hours' },
    { date: '2024-01-14', action: 'Booked desk', desk: 'OP-22', time: '14:20', duration: '4 hours' },
    { date: '2024-01-13', action: 'Checked out', desk: 'OP-08', time: '18:00', duration: '7 hours' },
    { date: '2024-01-12', action: 'Checked in', desk: 'E-01', time: '08:45', duration: '8.5 hours' },
    { date: '2024-01-11', action: 'Checked in', desk: 'OP-15', time: '09:15', duration: '7.5 hours' },
  ];

  return mockHistory.map(item => ({
    'Employee Name': employee.name,
    'Employee Email': employee.email,
    'Date': item.date,
    'Action': item.action,
    'Desk/Office': item.desk,
    'Time': item.time,
    'Duration': item.duration,
  }));
};