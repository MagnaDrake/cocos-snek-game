export const API_URL = getURL();
export const CONFIG_API_PATH = "/config";
export const CONFIG_FULL_API_URL_PATH = `${API_URL}${CONFIG_API_PATH}`;

function getURL() {
    if (window.location.href.includes("localhost")) {
        return "http://localhost:8080/public";
    }
    const url = `${window.location.origin}/api/snake-pvp-server`;

    // TO-DO: revert this to the dynamic url above
    // const url = "https://play.test.shopee.co.id/api/snake-pvp-server";
    console.log(url);
    return url;
}
