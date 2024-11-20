/**
 * @author inon13 (https://github.com/inon-13)
 * @license MIT
 */

// Parse Date and Time into structured object
function parseDateTime(dateTimeString) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [datePart, timePart] = dateTimeString.split(", ");
  const [month, day, year] = datePart.split("/").map(Number);
  const [time, meridian] = timePart.split(" ");
  const [hours, minutes, seconds] = time.split(":").map(Number);

  const isAM = meridian === "am"
  const hours24 = isAM
    ? hours === 12
      ? 0
      : hours
    : hours === 12
    ? 12
    : hours + 12;

  return {
    date: {
      month: month || null,
      day: day || null,
      year: year || null,
      monthName: months[month - 1] || null,
    },
    time: {
      hours: hours || null,
      minutes: minutes || null,
      seconds: seconds || null,
      am: isAM,
      "24hours": hours24 || null,
    },
  };
}

function mergeLanguages(langList) {
  const seenBaseLangs = new Set();
  const result = [];

  langList.forEach((lang) => {
    const [baseLang] = lang.split("-");

    if (!seenBaseLangs.has(baseLang)) {
      if (!lang.includes("-")) {
        if (!langList.some((l) => l.startsWith(`${baseLang}-`))) {
          result.push(lang);
        }
      } else {
        result.push(lang);
        seenBaseLangs.add(baseLang);
      }
    }
  });

  return result;
}

function normalizeLanguages(langList) {
  const baseLangs = new Set();
  const result = {};

  langList.forEach((lang) => {
    const [baseLang] = lang.split("-");

    if (!baseLangs.has(baseLang)) {
      baseLangs.add(baseLang);
      if (!lang.includes("-")) {
        result[baseLang] = lang;
      } else {
        result[baseLang] = baseLang;
      }
    }
  });

  return Object.values(result);
}

// Browser Detection
function BrowserDetector(userAgent) {
  const BROWSERS = {
    chrome: "Google Chrome",
    brave: "Brave",
    crios: "Google Chrome",
    edge: "Microsoft Edge",
    edg: "Microsoft Edge",
    fennec: "Mozilla Firefox",
    jsdom: "JsDOM",
    mozilla: "Mozilla Firefox",
    msie: "Microsoft Internet Explorer",
    opera: "Opera",
    opios: "Opera",
    opr: "Opera",
    rv: "Microsoft Internet Explorer",
    safari: "Safari",
    samsungbrowser: "Samsung Browser",
    electron: "Electron",
  };

  const PLATFORMS = {
    android: "Android",
    androidTablet: "Android Tablet",
    cros: "Chrome OS",
    fennec: "Android Tablet",
    ipad: "IPad",
    iphone: "IPhone",
    jsdom: "JsDOM",
    linux: "Linux",
    mac: "Macintosh",
    tablet: "Android Tablet",
    win: "Windows",
    "windows phone": "Windows Phone",
    xbox: "Microsoft Xbox",
  };

  function parseFloat2Dec(num) {
    const regex = new RegExp("^-?\\d+(?:.\\d{0,2})?");
    const match = Number(num).toString().match(regex);
    return match ? match[0] : null;
  }

  const ua = userAgent || window.navigator.userAgent || null;
  const uaLower = ua.toLowerCase().replace(/\s\s+/g, " ");

  const browser =
    /(edge)\/([\w.]+)/.exec(uaLower) ||
    /(edg)[/]([\w.]+)/.exec(uaLower) ||
    /(opr)[/]([\w.]+)/.exec(uaLower) ||
    /(jsdom)[/]([\w.]+)/.exec(uaLower) ||
    /(samsungbrowser)[/]([\w.]+)/.exec(uaLower) ||
    /(electron)[/]([\w.]+)/.exec(uaLower) ||
    /(chrome)[/]([\w.]+)/.exec(uaLower) ||
    /(crios)[/]([\w.]+)/.exec(uaLower) ||
    /(opios)[/]([\w.]+)/.exec(uaLower) ||
    /(version)(applewebkit)[/]([\w.]+).*(safari)[/]([\w.]+)/.exec(uaLower) ||
    /(webkit)[/]([\w.]+).*(version)[/]([\w.]+).*(safari)[/]([\w.]+)/.exec(
      uaLower
    ) ||
    /(applewebkit)[/]([\w.]+).*(safari)[/]([\w.]+)/.exec(uaLower) ||
    /(webkit)[/]([\w.]+)/.exec(uaLower) ||
    /(opera)(?:.*version|)[/]([\w.]+)/.exec(uaLower) ||
    /(msie) ([\w.]+)/.exec(uaLower) ||
    /(fennec)[/]([\w.]+)/.exec(uaLower) ||
    (uaLower.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec(uaLower)) ||
    (uaLower.indexOf("compatible") < 0 &&
      /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(uaLower)) ||
    [];

  const platform =
    /(ipad)/.exec(uaLower) ||
    /(ipod)/.exec(uaLower) ||
    /(iphone)/.exec(uaLower) ||
    /(jsdom)/.exec(uaLower) ||
    /(windows phone)/.exec(uaLower) ||
    /(xbox)/.exec(uaLower) ||
    /(win)/.exec(uaLower) ||
    /(tablet)/.exec(uaLower) ||
    (/(android)/.test(uaLower) &&
      !/(mobile)/.test(uaLower) && ["androidTablet"]) ||
    /(android)/.exec(uaLower) ||
    /(mac)/.exec(uaLower) ||
    /(linux)/.exec(uaLower) ||
    /(cros)/.exec(uaLower) ||
    [];

  let browserName = browser[5] || browser[3] || browser[1] || null;
  const platformName = platform[0] || null;
  const version = browser[4] || browser[2] || null;

  if (
    browserName === "chrome" &&
    typeof window.navigator?.brave?.isBrave === "function"
  ) {
    browserName = "brave";
  }

  const detected = {
    name: BROWSERS[browserName] || null,
    platform: PLATFORMS[platformName] || null,
    version: version || null,
    shortVersion: version ? parseFloat2Dec(parseFloat(version)) : null,
    tablet: Boolean(
      platformName === "tablet" || platformName === "androidTablet"
    ),
    mobile: Boolean(
      platformName === "android" ||
        platformName === "androidTablet" ||
        platformName === "tablet" ||
        platformName === "ipad" ||
        platformName === "ipod" ||
        platformName === "iphone" ||
        platformName === "windows phone"
    ),
  };
  return detected;
}

// Main function to collect all user info
async function collectUserInfo() {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");

    const gpuVendor = gl?.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || null;
    const gpuRenderer =
      gl?.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || null;

    const wtfismyipdata = await fetch("https://wtfismyip.com/json").then(
      (res) => res.json()
    );
    const detailedIpInfo = await fetch(
      `https://get.geojs.io/v1/ip/geo/${wtfismyipdata.YourFuckingIPAddress}.json`
    ).then((response) => response.json());

    const detector = new BrowserDetector(window.navigator.userAgent);

    const info = {
      networkInfo: {
        ip: {
          address: wtfismyipdata.YourFuckingIPAddress || null,
          hostname: wtfismyipdata.YourFuckingHostname || null,
        },
        location: {
          country: wtfismyipdata.YourFuckingCountry || null,
          countryCode: {
            alpha2: wtfismyipdata.YourFuckingCountryCode || null,
            alpha3: detailedIpInfo.country_code3 || null,
          },
          city: detailedIpInfo.city || null,
          region: detailedIpInfo.region || null,
          continentCode: detailedIpInfo.continent_code || null,
          latitude: detailedIpInfo.latitude || null,
          longitude: detailedIpInfo.longitude || null,
        },
        isp: wtfismyipdata.YourFuckingISP || null,
        organization: {
          name: detailedIpInfo.organization_name || null,
          asn: detailedIpInfo.asn || null,
        },
        torExit: wtfismyipdata.YourFuckingTorExit || null,
      },
      systemInfo: {
        platform: detector.platform || null,
        browser: {
          name: detector.name || null,
          version: detector.version || null,
          versionShort: detector.shortVersion || null,
          tablet: detector.tablet,
          mobile: detector.mobile,
        },
        gpu: {
          vendor: gpuVendor || null,
          renderer: gpuRenderer || null,
        },
        cpu: {
          threads: navigator.hardwareConcurrency || null,
        },
        memory: {
          device: navigator.deviceMemory || null,
          browser: window.performance.memory
            ? Math.round(
                window.performance.memory.jsHeapSizeLimit / 1024 / 1024
              )
            : null,
        },
        languageInfo: {
          systemLanguages: navigator.languages || null,
          shortenedLanguages: mergeLanguages(navigator.languages) || null,
          baseLanguages: normalizeLanguages(navigator.languages) || null,
        }
      },
      screenInfo: {
        size: {
          window: {
            width: window.innerWidth || null,
            height: window.innerHeight || null,
          },
          screen: {
            width: window.screen.width || null,
            height: window.screen.height || null,
          },
        },
        display: {
          pixelDepth: window.screen.pixelDepth || null,
          orientation: screen.orientation?.type || null,
        },
      },
      timeInfo: {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
        ipTimezone: detailedIpInfo.timezone || null,
        currentTime: parseDateTime(new Date().toLocaleString()) || null,
        potentialProxy:
          Intl.DateTimeFormat().resolvedOptions().timeZone !==
          detailedIpInfo.timezone,
      },
      browserState: {
        online: navigator.onLine || null,
        touchSupport: "ontouchstart" in window || null,
        referrer: document.referrer || null,
      }
    };

    return info;
  } catch (err) {
    console.error("Error collecting user info:", err);
  }
}

var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;
console.log(battery); 