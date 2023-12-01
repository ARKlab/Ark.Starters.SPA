
const langPathIndex = 1;

export const setLanguagePath = (path: string, language: string): string => {
    let splitPath = path.trim().split("/");
    splitPath[langPathIndex] = language;
    return splitPath.join("/");
  }

  export const retrieveLanguageFromPath = (path: string): string => {
    let splitPath = path.trim().split("/");
    return splitPath[langPathIndex] ?? "";
  }