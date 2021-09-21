export const SOCKET_URL = getURL();
export const SOCKET_PATH = "/socket";
/**
 * Socket url with path, use this when connecting to websocket
 */
export const SOCKET_FULL_PATH_URL = `${SOCKET_URL}${SOCKET_PATH}`;

function getURL() {
    if (window.location.href.includes("localhost")) {
        return "ws://localhost:8080/public";
    }
    const url = `wss://${window.location.host}/api/snake-pvp-server`;

    // TO-DO: revert this to the dynamic url above
    // const url = "wss://play.test.shopee.co.id/api/snake-pvp-server";
    console.log(url);
    return url;
}