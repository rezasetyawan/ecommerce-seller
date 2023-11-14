export const toRupiah = (price: number) => {
  return "Rp. " + price.toLocaleString("id-ID");
};

export const formatDate = (millisecondsTimestamp: string): string => {
  const dateObject = new Date(parseInt(millisecondsTimestamp));
  const options: object = {
    year: "numeric",
    month: "long",
    day: "2-digit",
  };
  const formattedDate = dateObject.toLocaleString(undefined, options);
  return formattedDate;
};

export const getFileNameFromUrl = (url: string, folderName: string): string | null => {
  const index = url.indexOf(folderName)

  if (folderName.includes('/')) {
    throw new Error("Folder contains a forward slash ('/').");
  }

  if (index !== -1) {
    const result = url.substring(index + `${folderName}/`.length);
    return result;
  } else {
    return null;
  }
}

export const getTextAfterSomeText = (text: string, separatorText: string) => {
  const index = text.indexOf(separatorText)
  if (index !== -1) {
    return text.substring(index + separatorText.length);
  } else {
    return text;
  }
}

