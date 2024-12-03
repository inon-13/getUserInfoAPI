/**
 * @author inon13 (https://github.com/inon-13)
 * @license MIT
 */

function AdvancedDateParsing(dateTimeString) {
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

function LanguageListParser(langList, mergeWithCountry = false) {
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

  if (mergeWithCountry) {
    const baseLangs = new Set();
    const mergedResult = {};

    result.forEach((lang) => {
      const [baseLang] = lang.split("-");

      if (!baseLangs.has(baseLang)) {
        baseLangs.add(baseLang);
        mergedResult[baseLang] = lang.includes("-") ? baseLang : lang;
      }
    });

    return Object.values(mergedResult);
  }

  return result;
}

function BrowserDetector(userAgent) { // Browser Detection
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
    webos: "WebOS",
    blackberry: "BlackBerry",
    iemobile: "Internet Explorer Mobile",
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
    webos: "WebOS",
    blackberry: "BlackBerry",
    ipod: "IPod",
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
    /(opera mini)[/]([\w.]+)/.exec(uaLower) ||
    /(msie) ([\w.]+)/.exec(uaLower) ||
    /(webos)[/]([\w.]+)/.exec(uaLower) ||
    /(blackberry)[/]([\w.]+)/.exec(uaLower) ||
    /(iemobile)[/]([\w.]+)/.exec(uaLower) ||
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
    /(webos)/.exec(uaLower) ||
    /(blackberry)/.exec(uaLower) ||
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
        platformName === "windows phone" ||
        platformName === "webos" ||
        platformName === "blackberry" ||
        /opera mini|iemobile/.test(uaLower)
    ),
  };
  return detected;
}

// Ads detection
async function AdsAndScriptsDetection() {
  const results = {
    summary: {
      total: 0,
      blocked: 0,
      notBlocked: 0
    },
    cosmetic: {
      static: null,
      dynamic: null
    },
    scripts: {
      ads: null,
      pagead: null,
      partnerads: null
    },
    domains: {}
  };

  // Test cosmetic filters
  const staticTest = document.createElement('div');
  staticTest.className = 'ad banner adsbox';
  document.body.appendChild(staticTest);
  results.cosmetic.static = !staticTest.offsetHeight;
  staticTest.remove();

  const dynamicTest = document.createElement('div');
  dynamicTest.id = 'ad_tester';
  dynamicTest.className = 'textads banner-ads ad-unit';
  document.body.appendChild(dynamicTest);
  await new Promise(r => setTimeout(r, 100));
  results.cosmetic.dynamic = !dynamicTest.offsetHeight;
  dynamicTest.remove();

  // Test scripts
  results.scripts = {
    ads: typeof s_test_ads === 'undefined',
    pagead: typeof s_test_pagead === 'undefined',
    partnerads: typeof s_test_partnerads === 'undefined'
  };

  // Domain categories and services
  const adServices = {
    "Ads": {
      "Amazon": ["adtago.s3.amazonaws.com", "analyticsengine.s3.amazonaws.com", "analytics.s3.amazonaws.com", "advice-ads.s3.amazonaws.com"],
      "Google Ads": ["pagead2.googlesyndication.com", "adservice.google.com", "pagead2.googleadservices.com", "afs.googlesyndication.com"],
      "Doubleclick": ["stats.g.doubleclick.net", "ad.doubleclick.net", "static.doubleclick.net", "m.doubleclick.net", "mediavisor.doubleclick.net"],
      "Adcolony": ["ads30.adcolony.com", "adc3-launch.adcolony.com", "events3alt.adcolony.com", "wd.adcolony.com"],
      "Media.net": ["static.media.net", "media.net", "adservetx.media.net"]
    },
    "Analytics": {
      "Google Analytics": ["analytics.google.com", "google-analytics.com", "ssl.google-analytics.com"],
      "Hotjar": ["adm.hotjar.com", "identify.hotjar.com", "insights.hotjar.com", "script.hotjar.com"]
    },
    "Social": {
      "Facebook": ["pixel.facebook.com", "an.facebook.com"],
      "Twitter": ["static.ads-twitter.com", "ads-api.twitter.com"],
      "LinkedIn": ["ads.linkedin.com", "analytics.pointdrive.linkedin.com"],
      "TikTok": ["ads-api.tiktok.com", "analytics.tiktok.com"]
    }
  };

  // Test all domains
  for (const [category, services] of Object.entries(adServices)) {
    results.domains[category] = {};
    
    for (const [service, domains] of Object.entries(services)) {
      results.domains[category][service] = {};
      
      for (const domain of domains) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 8000);
          
          const response = await fetch(`https://${domain}/fakepage.html`, {
            method: 'HEAD',
            mode: 'no-cors',
            signal: controller.signal
          });
          
          clearTimeout(timeout);
          if (response.ok) {
            results.domains[category][service][domain] = false;
            results.summary.notBlocked++;
          } else {
            results.domains[category][service][domain] = true;
            results.summary.blocked++;
          }
        } catch {
          results.domains[category][service][domain] = true;
          results.summary.blocked++;
        }
        results.summary.total++;
      }
    }
  }

  return results;
}
function GPUInfo() {
  const canvas = document.createElement("canvas");
  const webgl =canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  const debugInfo = webgl.getExtension("WEBGL_debug_renderer_info");

  const gpuVendor = webgl?.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || null;
  const gpuRenderer = webgl?.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || null;

    canvas.remove();  

    return {
      vendor: gpuVendor,
      renderer: gpuRenderer,
    }
}

async function measurePing() {
  const pingResult = {};
  try {
    const startTime = performance.now();
    await fetch('https://wtfismyip.com/json', { method: "HEAD", cache: "no-cache" });

    const endTime = performance.now();
    pingResult.ping = Math.round(endTime - startTime);
    pingResult.testedURL = 'https://wtfismyip.com/json';
  } catch (error) {
    pingResult.error = "Error: " + error.message;
  }

  return pingResult;
}

async function IPConverter(ip, targetType) {
  // Validate the IPv4 address with regex
  const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])$/;
  const isIpv4 = ipv4Regex.test(ip);

  // Function to convert to IPv6-mapped IPv4 address format
  function convertToIPv6Mapped(octets) {
      return `::ffff:${octets[0].toString(16)}${octets[1].toString(16)}:${octets[2].toString(16)}${octets[3].toString(16)}`;
  }

  // Function to convert to full IPv6 format (IPv4-mapped IPv6)
  function convertToFullIPv6(octets) {
      const hexOctets = octets.map(octet => octet.toString(16).padStart(2, '0'));
      return `0000:0000:0000:0000:0000:ffff:${hexOctets[0]}${hexOctets[1]}:${hexOctets[2]}${hexOctets[3]}`;
  }

  // Function to convert IPv4 to an integer
  function convertToInteger(octets) {
      return (octets[0] << 24) + (octets[1] << 16) + (octets[2] << 8) + octets[3];
  }

  // Function to convert IPv4 to hexadecimal representation
  function convertToHex(octets) {
      const hex = octets.map(octet => octet.toString(16).padStart(2, '0')).join('');
      return `0x${hex}`;
  }

  // Convert IPv6-mapped address back to IPv4
  function convertToIPv4FromMappedIPv6() {
      if (ip.startsWith("::ffff:")) {
          const ipv4 = ip.slice(7);  // Remove the "::ffff:" part
          return ipv4;
      }
      return null;
  }

  // Convert full IPv6 to IPv4 if it's IPv4-mapped
  function convertToIPv4FromFullIPv6() {
      const ipv6Parts = ip.split(':');
      if (ipv6Parts.length === 8 && ipv6Parts[6] === 'ffff') {
          const ipv4Hex = ipv6Parts.slice(6).join(':');
          const octets = ipv4Hex.split(':').map(hex => parseInt(hex, 16));
          return `${octets[0]}.${octets[1]}.${octets[2]}.${octets[3]}`;
      }
      return null;
  }

  // Convert integer to IPv4
  function convertToIPv4FromInteger() {
      const octets = [];
      octets.push((ip >> 24) & 255);
      octets.push((ip >> 16) & 255);
      octets.push((ip >> 8) & 255);
      octets.push(ip & 255);
      return octets.join('.');
  }

  // Convert hexadecimal to IPv4
  function convertToIPv4FromHex() {
      const hex = ip.replace('0x', ''); // Remove '0x' if present
      const octets = [];
      for (let i = 0; i < 8; i += 2) {
          octets.push(parseInt(hex.substr(i, 2), 16));
      }
      return octets.join('.');
  }

  // Handle conversion based on the target type
  switch (targetType) {
      case 'ipv6':
          if (isIpv4) {
              const octets = ip.split('.').map(Number);
              return convertToIPv6Mapped(octets);
          }
          return ip; // Return the same if already IPv6-mapped

      case 'ipv6-full':
          if (isIpv4) {
              const octets = ip.split('.').map(Number);
              return convertToFullIPv6(octets);
          }
          return ip; // Return the same if already full IPv6

      case 'integer':
          if (isIpv4) {
              const octets = ip.split('.').map(Number);
              return convertToInteger(octets);
          }
          return ip; // Return the same if already integer

      case 'hex':
          if (isIpv4) {
              const octets = ip.split('.').map(Number);
              return convertToHex(octets);
          }
          return ip; // Return the same if already hex

      case 'ipv4':
          if (ip.includes('::ffff:')) {
              return convertToIPv4FromMappedIPv6() || ip;
          }
          if (ip.includes(':')) {
              return convertToIPv4FromFullIPv6() || ip;
          }
          if (typeof ip === 'number') {
              return convertToIPv4FromInteger() || ip;
          }
          if (ip.startsWith('0x')) {
              return convertToIPv4FromHex() || ip;
          }
          return ip; // If it's already IPv4, return the same

      default:
          throw new Error("Unsupported target type");
  }
}

function checkLocalStorageSupport() {
  try {
      const testKey = "test";
      localStorage.setItem(testKey, "value");
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
  }
}

// function detectAccessibilityFeatures() {
//   // Shared div for detections
//   const testDiv = document.createElement('div');
//   document.body.appendChild(testDiv);

//   // Detect text size preference
//   function detectTextSizePreference() {
//       testDiv.style.fontSize = '1rem';
//       const computedFontSize = parseFloat(window.getComputedStyle(testDiv).fontSize);
//       return computedFontSize; // Font size in pixels
//   }

//   // Approximate screen reader detection
//   function detectScreenReader() {
//       testDiv.setAttribute('role', 'alert');
//       testDiv.style.position = 'absolute';
//       testDiv.style.left = '-9999px';
//       const detected = window.getComputedStyle(testDiv).position === 'absolute';
//       testDiv.removeAttribute('role'); // Clean up for other tests
//       testDiv.style.position = '';
//       testDiv.style.left = '';
//       return detected;
//   }

//   // Perform detections
//   const features = {
//       textSize: detectTextSizePreference(),
//       screenReader: detectScreenReader(),
//   };

//   // Remove shared div after detection
//   testDiv.remove();

//   return features;
// }

async function collectUserInfo() {
  try {
    const isOnline = navigator.onLine;

    const wtfismyipdata = isOnline ? await fetch("https://wtfismyip.com/json").then(
      (res) => {
        return res.json()
      }
    ) : null;

    const wtfismylocation = isOnline ? wtfismyipdata.yourFuckingLocation : null;

    const detailedIpInfo = isOnline ? await fetch(
      `https://get.geojs.io/v1/ip/geo/${wtfismyipdata.YourFuckingIPAddress}.json`
    ).then((response) => response.json()) : null;

    const detector = new BrowserDetector(window.navigator.userAgent);

    const hasBattery = isOnline && navigator.getBattery() !== null && await navigator.getBattery().then(battery => {return typeof battery.level === 'number'});

    const info = {
      networkInfo: {
        downloadSpeed: isOnline ? navigator.connection.downlink : false,
        generation: isOnline ? navigator.connection.effectiveType.toUpperCase() : false,
        PingInfo: isOnline ? (await measurePing()) : null,
        ip: {
          v4: isOnline ? await IPConverter(wtfismyipdata.YourFuckingIPAddress, "ipv4").then(result => {return result}) : null,
          v6short: isOnline ? await IPConverter(wtfismyipdata.YourFuckingIPAddress, "ipv6").then(result => {return result}) : null,
          v6long: isOnline ? await IPConverter(wtfismyipdata.YourFuckingIPAddress, "ipv6-full").then(result => {return result}) : null,
          integer: isOnline ? await IPConverter(wtfismyipdata.YourFuckingIPAddress, "integer").then(result => {return result}) : null,
          hex: isOnline ? await IPConverter(wtfismyipdata.YourFuckingIPAddress, "hex").then(result => {return result}) : null,
          hostname: isOnline ? wtfismyipdata.YourFuckingHostname : null,
        },
        location: {
          country: isOnline ? wtfismyipdata.YourFuckingCountry : null,
          fullLocation: {
            full: isOnline ? wtfismyipdata.yourFuckingLocation : null,
            city: "city",
            region: "region",
            country: "country",
          },
          countryCode: {
            alpha2: isOnline ? wtfismyipdata.YourFuckingCountryCode : null,
            alpha3: isOnline ? detailedIpInfo.country_code3 : null,
          },
          city: isOnline ? detailedIpInfo.city : null,
          region: isOnline ? detailedIpInfo.region : null,
          continentCode: isOnline ? detailedIpInfo.continent_code : null,
          latitude: isOnline ? detailedIpInfo.latitude : null,
          longitude: isOnline ? detailedIpInfo.longitude : null,
        },
        isp: isOnline ? wtfismyipdata.YourFuckingISP : null,
        organization: {
          name: isOnline ? detailedIpInfo.organization_name : null,
          asn: isOnline ? detailedIpInfo.asn : null,
        },
        torExit: isOnline ? wtfismyipdata.YourFuckingTorExit : null,
      },
      systemInfo: {
        platform: detector.platform || false,
        browser: {
          name: detector.name || false,
          version: detector.version || false,
          versionShort: detector.shortVersion || false,
          tablet: detector.tablet,
          mobile: detector.mobile,
        },
        gpu: {
          vendor: GPUInfo().vendor || false,
          renderer: GPUInfo().renderer || false,
        },
        cpu: {
          threads: navigator.hardwareConcurrency || false,
        },
        memory: {
          device: navigator.deviceMemory || false,
          browser: window.performance.memory
            ? Math.round(
                window.performance.memory.jsHeapSizeLimit / 1024 / 1024
              )
            : false,
        },
        languageInfo: {
          systemLanguages: navigator.languages || false,
          shortened: LanguageListParser(navigator.languages, false) || false,
          baseLanguages: LanguageListParser(navigator.languages, true) || false,
        },
        batteryInfo: hasBattery ? await navigator.getBattery().then(battery => {return {charging: battery.charging, chargingTime: battery.chargingTime, dischargingTime: battery.dischargingTime, level: battery.level}}) : false,
      },
      screenInfo: {
        size: {
          window: {
            width: window.innerWidth || false,
            height: window.innerHeight || false,
          },
          screen: {
            width: window.screen.width || false,
            height: window.screen.height || false,
          },
        },
        display: {
          pixelDepth: window.screen.pixelDepth || false,
          orientation: screen.orientation?.type || false,
        },
      },
      timeInfo: {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || false,
        ipTimezone: isOnline ? detailedIpInfo.timezone : null,
        currentTime: AdvancedDateParsing(new Date().toLocaleString()) || false,
        mismatchedTimezone: isOnline ? Intl.DateTimeFormat().resolvedOptions().timeZone !== detailedIpInfo.timezone : false,
      },
      browserState: {
        online: navigator.onLine || false,
        touchSupport: "ontouchstart" in window || false,
        referrer: document.referrer || false,
        doNotTrack: {
          window: window.doNotTrack || false,
          navigator: navigator.doNotTrack || false,
        },
        cookiesEnabled: navigator.cookieEnabled || false,
        isPrivate: isOnline ? await detectIncognito().then(function(result) {
          return result.isPrivate;
        }) : false,
        localStorageSupported: checkLocalStorageSupport() || false,
        accessibility: {
          reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches || false,
          speechRecognition: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window || false,
          deviceOrientation: 'DeviceOrientationEvent' in window || false,
          deviceMotion: 'DeviceMotionEvent' in window || false,
          dark: window.matchMedia('(prefers-color-scheme: dark)').matches || false,
          highContrast: window.matchMedia('(forced-colors: active)').matches || false,
          zoomLevel: window.devicePixelRatio * 100 || false,
        },
      }
    };
    const location = isOnline ? wtfismyipdata.YourFuckingLocation : null;
    
    // Now parse the location when it's definitely loaded
    if (location) {
      const [city, region, country] = location.split(', ');
      info.networkInfo.location.fullLocation = {
        full: location,
        city: city,
        region: region, 
        country: country
      };
    }

    return info;
  } catch (e) {
    console.error("Error collecting user info:", e);
  }
}