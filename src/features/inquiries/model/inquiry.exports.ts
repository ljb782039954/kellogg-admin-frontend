import type { Inquiry } from './inquiry.types';

export function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function buildInquiryText(inquiry: Inquiry): string {
  return [
    'Inquiry Details',
    '----------------',
    `ID: ${inquiry.id}`,
    `Time: ${new Date(inquiry.createdAt).toLocaleString()}`,
    `Status: ${inquiry.status}`,
    '',
    'Contact:',
    `- Name: ${inquiry.name}`,
    `- Email: ${inquiry.email}`,
    `- Phone: ${inquiry.phone || 'N/A'}`,
    `- Country: ${inquiry.country || 'N/A'}`,
    `- Company: ${inquiry.company || 'N/A'}`,
    '',
    'Request:',
    `- Product Type: ${inquiry.productType || 'N/A'}`,
    `- Quantity: ${inquiry.quantity || 'N/A'}`,
    '',
    'Message:',
    inquiry.message || '',
  ].join('\n');
}

export function buildInquiriesCsv(inquiries: Inquiry[]): string {
  const headers = ['ID', 'Name', 'Email', 'Phone', 'Country', 'Company', 'Product Type', 'Quantity', 'Status', 'Date', 'Message'];
  const rows = inquiries.map((inq) =>
    [
      inq.id,
      escapeCsvCell(inq.name),
      escapeCsvCell(inq.email),
      escapeCsvCell(inq.phone),
      escapeCsvCell(inq.country),
      escapeCsvCell(inq.company),
      escapeCsvCell(inq.productType),
      escapeCsvCell(inq.quantity),
      escapeCsvCell(inq.status),
      escapeCsvCell(new Date(inq.createdAt).toLocaleString()),
      escapeCsvCell(inq.message),
    ].join(','),
  );
  // UTF-8 BOM for Excel
  return '\uFEFF' + [headers.join(','), ...rows].join('\n');
}

export function buildInquiryTextFilename(inquiry: Inquiry): string {
  const safeName = inquiry.name.replace(/[<>:"/\\|?*]/g, '_');
  return `inquiry_${inquiry.id}_${safeName}.txt`;
}

export function buildInquiriesCsvFilename(date: Date = new Date()): string {
  const ymd = date.toISOString().split('T')[0];
  return `inquiries_export_${ymd}.csv`;
}

export function downloadTextFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
