import type { Inquiry } from './inquiryTypes';

function quoteCsvCell(value: unknown): string {
  const normalized = String(value ?? '');
  return `"${normalized.replace(/"/g, '""')}"`;
}

export function createInquiryTextExport(inquiry: Inquiry): string {
  return `
Inquiry Details
----------------
ID: ${inquiry.id}
Time: ${new Date(inquiry.created_at).toLocaleString()}
Status: ${inquiry.status}

Contact:
- Name: ${inquiry.name}
- Email: ${inquiry.email}
- Phone: ${inquiry.phone || 'N/A'}
- Country: ${inquiry.country || 'N/A'}
- Company: ${inquiry.company || 'N/A'}

Request:
- Product Type: ${inquiry.product_type || 'N/A'}
- Quantity: ${inquiry.quantity || 'N/A'}

Message:
${inquiry.message}
  `.trim();
}

export function createInquiriesCsvExport(inquiries: Inquiry[]): string {
  const headers = [
    'ID',
    'Name',
    'Email',
    'Phone',
    'Country',
    'Company',
    'Product Type',
    'Quantity',
    'Status',
    'Date',
    'Message',
  ];
  const rows = inquiries.map(inquiry => [
    inquiry.id,
    quoteCsvCell(inquiry.name),
    inquiry.email,
    inquiry.phone || '',
    inquiry.country || '',
    quoteCsvCell(inquiry.company || ''),
    quoteCsvCell(inquiry.product_type || ''),
    inquiry.quantity || '',
    inquiry.status,
    new Date(inquiry.created_at).toLocaleString(),
    quoteCsvCell(inquiry.message || ''),
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

export function downloadTextFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function createInquiryTextFilename(inquiry: Inquiry): string {
  return `inquiry_${inquiry.id}_${inquiry.name}.txt`;
}

export function createInquiriesCsvFilename(date = new Date()): string {
  return `inquiries_export_${date.toISOString().split('T')[0]}.csv`;
}
