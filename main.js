/**
 * @author inon13 (https://github.com/inon-13)
 * @license MIT
 */

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

    async function convertIPv4ToIPv6(ipv4) {
      // Validate the IPv4 address
      const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])$/;
      if (!ipv4Regex.test(ipv4)) {
          throw new Error("Invalid IPv4 address");
      }
  
      // Split the IPv4 address into its octets
      const octets = ipv4.split('.').map(Number);
  
      // Convert to IPv6-mapped IPv4 address format
      const ipv6 = `::ffff:${octets[0].toString(16)}${octets[1].toString(16)}:${octets[2].toString(16)}${octets[3].toString(16)}`;
  
      return ipv6;
  }

  function convertIPv4ToFullIPv6(ipv4) {
    // Validate the IPv4 address
    const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])$/;
    if (!ipv4Regex.test(ipv4)) {
        throw new Error("Invalid IPv4 address");
    }

    // Split the IPv4 address into its octets
    const octets = ipv4.split('.').map(Number);

    // Convert each octet to hexadecimal and pad to 2 digits
    const hexOctets = octets.map(octet => octet.toString(16).padStart(2, '0'));

    // Combine into full IPv6 format
    const ipv6 = `0000:0000:0000:0000:0000:ffff:${hexOctets[0]}${hexOctets[1]}:${hexOctets[2]}${hexOctets[3]}`;

    return ipv6;
}

function ipv4ToInteger(ipv4) {
  // Validate the IPv4 address
  const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])$/;
  if (!ipv4Regex.test(ipv4)) {
      throw new Error("Invalid IPv4 address");
  }

  // Split into octets and calculate integer
  const octets = ipv4.split('.').map(Number);
  const integer = (octets[0] << 24) + (octets[1] << 16) + (octets[2] << 8) + octets[3];
  return integer;
}

function ipv4ToHex(ipv4) {
  // Validate the IPv4 address
  const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])$/;
  if (!ipv4Regex.test(ipv4)) {
      throw new Error("Invalid IPv4 address");
  }

  // Split into octets, convert each to hex, and join
  const octets = ipv4.split('.').map(Number);
  const hex = octets.map(octet => octet.toString(16).padStart(2, '0')).join('');
  return `0x${hex}`;
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
    // Detect ad blockers
 function detectAdBlocker() {
      const bait = document.createElement("div");
      bait.className = "ad-banner"; // Common ad-related class name
      bait.style.cssText =
          "width: 1px; height: 1px; position: absolute; top: -9999px;";

      document.body.appendChild(bait);

      const isBlocked = window.getComputedStyle(bait).display === "none";
      document.body.removeChild(bait);

      return isBlocked;
  }


/*!
 *
 * detectIncognito v1.3.7
 *
 * https://github.com/Joe12387/detectIncognito
 *
 * MIT License
 *
 * Copyright (c) 2021 - 2024 Joe Rutkowski <Joe@dreggle.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * Please keep this comment intact in order to properly abide by the MIT License.
 *
 **/
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.detectIncognito=t():e.detectIncognito=t()}(this,(function(){return function(){"use strict";var __webpack_modules__={598:function(__unused_webpack_module,exports){var __awaiter=this&&this.__awaiter||function(e,t,r,o){return new(r||(r=Promise))((function(n,i){function a(e){try{s(o.next(e))}catch(e){i(e)}}function c(e){try{s(o.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?n(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(a,c)}s((o=o.apply(e,t||[])).next())}))},__generator=this&&this.__generator||function(e,t){var r,o,n,i,a={label:0,sent:function(){if(1&n[0])throw n[1];return n[1]},trys:[],ops:[]};return i={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function c(c){return function(s){return function(c){if(r)throw new TypeError("Generator is already executing.");for(;i&&(i=0,c[0]&&(a=0)),a;)try{if(r=1,o&&(n=2&c[0]?o.return:c[0]?o.throw||((n=o.return)&&n.call(o),0):o.next)&&!(n=n.call(o,c[1])).done)return n;switch(o=0,n&&(c=[2&c[0],n.value]),c[0]){case 0:case 1:n=c;break;case 4:return a.label++,{value:c[1],done:!1};case 5:a.label++,o=c[1],c=[0];continue;case 7:c=a.ops.pop(),a.trys.pop();continue;default:if(!(n=a.trys,(n=n.length>0&&n[n.length-1])||6!==c[0]&&2!==c[0])){a=0;continue}if(3===c[0]&&(!n||c[1]>n[0]&&c[1]<n[3])){a.label=c[1];break}if(6===c[0]&&a.label<n[1]){a.label=n[1],n=c;break}if(n&&a.label<n[2]){a.label=n[2],a.ops.push(c);break}n[2]&&a.ops.pop(),a.trys.pop();continue}c=t.call(e,a)}catch(e){c=[6,e],o=0}finally{r=n=0}if(5&c[0])throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}([c,s])}}};function detectIncognito(){return __awaiter(this,void 0,Promise,(function(){return __generator(this,(function(_a){switch(_a.label){case 0:return[4,new Promise((function(resolve,reject){var browserName="Unknown";function __callback(e){resolve({isPrivate:e,browserName:browserName})}function identifyChromium(){var e=navigator.userAgent;return e.match(/Chrome/)?void 0!==navigator.brave?"Brave":e.match(/Edg/)?"Edge":e.match(/OPR/)?"Opera":"Chrome":"Chromium"}function assertEvalToString(e){return e===eval.toString().length}function feid(){var toFixedEngineID=0;try{eval("(-1).toFixed(-1);")}catch(e){toFixedEngineID=e.message.length}return toFixedEngineID}function isSafari(){return 44===feid()}function isChrome(){return 51===feid()}function isFirefox(){return 25===feid()}function isMSIE(){return void 0!==navigator.msSaveBlob&&assertEvalToString(39)}function newSafariTest(){var e=String(Math.random());try{window.indexedDB.open(e,1).onupgradeneeded=function(t){var r,o,n=null===(r=t.target)||void 0===r?void 0:r.result;try{n.createObjectStore("test",{autoIncrement:!0}).put(new Blob),__callback(!1)}catch(e){var i=e;return e instanceof Error&&(i=null!==(o=e.message)&&void 0!==o?o:e),"string"!=typeof i?void __callback(!1):void __callback(i.includes("BlobURLs are not yet supported"))}finally{n.close(),window.indexedDB.deleteDatabase(e)}}}catch(e){__callback(!1)}}function oldSafariTest(){var e=window.openDatabase,t=window.localStorage;try{e(null,null,null,null)}catch(e){return void __callback(!0)}try{t.setItem("test","1"),t.removeItem("test")}catch(e){return void __callback(!0)}__callback(!1)}function safariPrivateTest(){void 0!==navigator.maxTouchPoints?newSafariTest():oldSafariTest()}function getQuotaLimit(){var e=window;return void 0!==e.performance&&void 0!==e.performance.memory&&void 0!==e.performance.memory.jsHeapSizeLimit?performance.memory.jsHeapSizeLimit:1073741824}function storageQuotaChromePrivateTest(){navigator.webkitTemporaryStorage.queryUsageAndQuota((function(e,t){__callback(Math.round(t/1048576)<2*Math.round(getQuotaLimit()/1048576))}),(function(e){reject(new Error("detectIncognito somehow failed to query storage quota: "+e.message))}))}function oldChromePrivateTest(){(0,window.webkitRequestFileSystem)(0,1,(function(){__callback(!1)}),(function(){__callback(!0)}))}function chromePrivateTest(){void 0!==self.Promise&&void 0!==self.Promise.allSettled?storageQuotaChromePrivateTest():oldChromePrivateTest()}function firefoxPrivateTest(){__callback(void 0===navigator.serviceWorker)}function msiePrivateTest(){__callback(void 0===window.indexedDB)}function main(){isSafari()?(browserName="Safari",safariPrivateTest()):isChrome()?(browserName=identifyChromium(),chromePrivateTest()):isFirefox()?(browserName="Firefox",firefoxPrivateTest()):isMSIE()?(browserName="Internet Explorer",msiePrivateTest()):reject(new Error("detectIncognito cannot determine the browser"))}main()}))];case 1:return[2,_a.sent()]}}))}))}Object.defineProperty(exports,"__esModule",{value:!0}),exports.detectIncognito=void 0,exports.detectIncognito=detectIncognito,"undefined"!=typeof window&&(window.detectIncognito=detectIncognito),exports.default=detectIncognito}},__webpack_exports__={};return __webpack_modules__[598](0,__webpack_exports__),__webpack_exports__=__webpack_exports__.default,__webpack_exports__}()}));
var incognitoDetection = false;

detectIncognito().then(function(result) {
  incognitoDetection = result;
})
    const info = {
      networkInfo: {
        generation: navigator.connection.effectiveType.toUpperCase(),
        PingInfo: (await measurePing()),
        ip: {
          v4: wtfismyipdata.YourFuckingIPAddress || null,
          v6short: await convertIPv4ToIPv6(wtfismyipdata.YourFuckingIPAddress) || null,
          v6long: await convertIPv4ToFullIPv6(wtfismyipdata.YourFuckingIPAddress) || null,
          integer: ipv4ToInteger(wtfismyipdata.YourFuckingIPAddress) || null,
          hex: ipv4ToHex(wtfismyipdata.YourFuckingIPAddress) || null,
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
        },
        batteryInfo: {
          level: navigator.battery?.level || null,
          charging: navigator.battery?.charging || null,
          chargingTime: navigator.battery?.chargingTime || null,
          dischargingTime: navigator.battery?.dischargingTime || null
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
        doNotTrack: {
          window: window.doNotTrack || null,
          navigator: navigator.doNotTrack || null,
        },
        adBlockEnabled: detectAdBlocker() || null,
        cookiesEnabled: navigator.cookieEnabled || null,
        isPrivate: incognitoDetection.isPrivate || null,
        localStorageSupported: checkLocalStorageSupport() || null,
      }
    };

    async function getBatteryInfo(info) {
      if ('getBattery' in navigator) {
        try {
          const battery = await navigator.getBattery();
    
          // Update the info object with battery details
          info.systemInfo = info.systemInfo || {}; // Ensure systemInfo exists
          info.systemInfo.batteryInfo = {
            charging: battery.charging,
            chargingTime: battery.chargingTime === Infinity ? null : battery.chargingTime,
            dischargingTime: battery.dischargingTime === Infinity ? null : battery.dischargingTime,
            level: battery.level * 100,
          };
        } catch (error) {
          console.error("An error occurred while retrieving battery info:", error);
          info.systemInfo.batteryInfo = `Error: ${error.message}`;
        }
      } else {
        info.systemInfo.batteryInfo = null;
      }
    }
    getBatteryInfo(info);
    
    

    return info;
  } catch (err) {
    console.error("Error collecting user info:", err);
  }
}