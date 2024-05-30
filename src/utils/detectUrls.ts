function detectUrls(text: string): string[] {
  // Pola regex untuk mencocokkan URL
  const urlPattern = /https?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+/g;
  
  // Cari semua URL dalam teks
  const urls = text.match(urlPattern) || [];
  return urls;
}

export default detectUrls