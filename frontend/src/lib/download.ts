export const buildDownloadUrl = (resourceUrl: string): string => {
  if (!resourceUrl) return resourceUrl;

  if (resourceUrl.includes('/res.cloudinary.com/') && resourceUrl.includes('/raw/upload/')) {
    return resourceUrl.replace('/raw/upload/', '/raw/upload/fl_attachment/');
  }

  return resourceUrl;
};

export const triggerFileDownload = (resourceUrl: string, filename?: string): void => {
  const link = document.createElement('a');
  link.href = buildDownloadUrl(resourceUrl);
  link.target = '_blank';
  link.rel = 'noopener noreferrer';

  if (filename) {
    link.download = filename;
  } else {
    const clean = resourceUrl.split('?')[0];
    const candidate = clean.split('/').pop();
    if (candidate) {
      link.download = candidate;
    }
  }

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const openInNewTab = (resourceUrl: string): void => {
  const link = document.createElement('a');
  link.href = resourceUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
