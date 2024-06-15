export function extractKentIdNumber(input: string | undefined): number | null {
  if (!input) {
    return null;
  }

  const match = input.match(/kentId(\d+)/);

  if (match && match[1]) {
    return parseInt(match[1]);
  } else {
    return null;
  }
}

export type Treasure = {
  type: "treasure";
  id: string;
};

export type Fragment = {
  type: "fragment";
  fragmentRootId: string;
  fragmentId: string;
};

export type QR = {
  type: "qr";
  text: string;
};

export type ParseResult = Treasure | Fragment | QR;

export function parseQr(text: string): ParseResult {
  const cleanedText = text.replace(
    /^https:\/\/t\.me\/qrBeastBot\/start\?startapp=/,
    "",
  );

  const treasurePattern = /^treasure-(\w+)$/;
  const fragmentPattern = /^fragment-(\w+)-(\w+)$/;

  const treasureMatch = cleanedText.match(treasurePattern);
  if (treasureMatch) {
    return {
      type: "treasure",
      id: treasureMatch[1],
    };
  }

  const fragmentMatch = cleanedText.match(fragmentPattern);
  if (fragmentMatch) {
    return {
      type: "fragment",
      fragmentRootId: fragmentMatch[1],
      fragmentId: fragmentMatch[2],
    };
  }

  return {
    type: "qr",
    text: text,
  };
}
