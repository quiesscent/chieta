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

export const prepareAnalyticsData = (bookings: any[], employees: any[]) => {
  return [
    {
      'Date': new Date().toISOString().split('T')[0],
      'Total Bookings': bookings.length,
      'Active Employees': employees.filter(e => e.status === 'active').length,
      'Desk Utilization Rate': `${Math.floor(Math.random() * 30) + 70}%`,
      'Peak Hours': '9:00 AM - 11:00 AM',
      'Most Booked Desk': 'OP-15',
      'Average Booking Duration': '4.5 hours',
      'Cancellation Rate': `${Math.floor(Math.random() * 10) + 5}%`,
      'Exported On': new Date().toISOString().split('T')[0]
    }
  ];
};

export const prepareEmployeeHistoryData = (employees: any[]) => {
  return employees.map(employee => ({
    'Employee ID': employee.id,
    'Name': employee.name,
    'Email': employee.email,
    'Login Frequency': employee.loginFrequency,
    'Status': employee.status,
    'Last Login': '2024-01-15 09:30:00', // Mock data
    'Total Bookings': Math.floor(Math.random() * 50) + 10, // Mock data
    'Desk Preferences': 'OP-15, OP-22, OP-30', // Mock data
    'Exported On': new Date().toISOString().split('T')[0]
  }));
};