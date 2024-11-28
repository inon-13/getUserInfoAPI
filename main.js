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

async function collectUserInfo() {
  try {
    const wtfismyipdata = await fetch("https://wtfismyip.com/json").then(
      (res) => {
        return res.json()
      }
    );

    const wtfismylocation = await wtfismyipdata.yourFuckingLocation;

    const detailedIpInfo = await fetch(
      `https://get.geojs.io/v1/ip/geo/${wtfismyipdata.YourFuckingIPAddress}.json`
    ).then((response) => response.json());

    const detector = new BrowserDetector(window.navigator.userAgent);


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

const hasBattery = navigator.getBattery() !== null && await navigator.getBattery().then(battery => {return typeof battery.level === 'number'});

const info = {
      networkInfo: {
        downloadSpeed: navigator.connection.downlink || null,
        generation: navigator.connection.effectiveType.toUpperCase(),
        PingInfo: (await measurePing()),
        ip: {
          v4: await IPConverter(wtfismyipdata.YourFuckingIPAddress, "ipv4").then(result => {return result}) || null,
          v6short: await IPConverter(wtfismyipdata.YourFuckingIPAddress, "ipv6").then(result => {return result}) || null,
          v6long: await IPConverter(wtfismyipdata.YourFuckingIPAddress, "ipv6-full").then(result => {return result}) || null,
          integer: await IPConverter(wtfismyipdata.YourFuckingIPAddress, "integer").then(result => {return result}) || null,
          hex: await IPConverter(wtfismyipdata.YourFuckingIPAddress, "hex").then(result => {return result}) || null,
          hostname: wtfismyipdata.YourFuckingHostname || null,
        },
        location: {
          country: wtfismyipdata.YourFuckingCountry || null,
          fullLocation: {
            full: wtfismyipdata.yourFuckingLocation || null,
            city: "city",
            region: "region",
            country: "country",
          },
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
          vendor: GPUInfo().vendor || null,
          renderer: GPUInfo().renderer || null,
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
          shortened: LanguageListParser(navigator.languages, false) || null,
          baseLanguages: LanguageListParser(navigator.languages, true) || null,
        },
        batteryInfo: hasBattery ? await navigator.getBattery().then(battery => {return {charging: battery.charging, chargingTime: battery.chargingTime, dischargingTime: battery.dischargingTime, level: battery.level}}) : null,
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
        currentTime: AdvancedDateParsing(new Date().toLocaleString()) || null,
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
        cookiesEnabled: navigator.cookieEnabled || null,
        isPrivate: await detectIncognito().then(function(result) {
          return result.isPrivate;
        }) || null,
        localStorageSupported: checkLocalStorageSupport() || null,
      }
    };

    const location = wtfismyipdata.YourFuckingLocation;
    
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