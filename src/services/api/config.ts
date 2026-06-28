export const getApiBase = (): string => {
  return 'https://api.telegramecommerce.shop';
};

export const fileUrl = (fileId: string, botId: string | number): string => {
  return `${getApiBase()}/telegram/file/${encodeURIComponent(fileId)}?bot_id=${botId}`;
};

export const getImageUrl = (
  imageUrl: string | null | undefined,
  botId: string | number,
): string | null => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;

  let fileId = imageUrl;
  try {
    const parsed = JSON.parse(imageUrl);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const photo = parsed.find((m: any) => m.type === 'photo') || parsed[0];
      fileId = photo.file_id;
    }
  } catch {
    // not JSON, use raw value
  }

  return fileUrl(fileId, botId);
};
