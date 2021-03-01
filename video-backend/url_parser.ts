/**
 * There are several host's that provide embeddable
 * video sources such as; youtube, vimeo and perhaps more
 * that i'm not aware of. Each service has their own unique
 * url. This function should find the hostname than parse
 * the url accordingly.
 * @param url source of the video
 * @returns should provide a valid iframe embed link
 */
// src="https://www.youtube.com/embed/bDErK6iOG3Q"
export type VideoLink = [source: string, id: string];
export class URLHandler {
  constructor(private url: string) {}

  handleMsg(): string | null {
    const url = new URL(this.url);
    switch (url.hostname) {
      case "youtu.be":
      case "www.youtube.com":
        return this.youtube(url);
      case "vimeo.com":
      case "www.vimeo.com":
        return this.url;
      default:
        console.log(url);
        return null;
    }
  }
  private youtube(url: URL): string {
    let finalId: string;
    if (url.search.length) {
      const [, id] = url.search.split("=");
      finalId = id;
    } else {
      const [, id] = url.pathname.split("/");
      finalId = id;
    }
    return finalId;
  }
  // private vimeo(url: URL): string {
  //   const [, id] = url.pathname.split("/");
  //   return url;
  // }
}
