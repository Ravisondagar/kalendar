import { i as isWeekend, a as isToday, g as getLocaleTime, b as _objectSpread2, c as cloneObject, d as __vue_normalize__, e as __vue_create_injector__, f as isBefore, h as getHourlessDate, j as addTimezoneInfo } from './index-2862990c.js';
import 'vue';

function PromiseWorker (worker) {
  var messageIds = 0;
  var callbacks = {};
  worker.addEventListener("message", function (e) {
    return onMessage(e);
  });
  var onMessage = function onMessage(e) {
    var message = e.data;
    if (!Array.isArray(message) || message.length < 2) {
      return;
    }
    var messageId = message[0];
    var error = message[1];
    var result = message[2];
    var callback = callbacks[messageId];
    if (!callback) return;
    delete callbacks[messageId];
    callback(error, result);
  };
  return {
    initiateWorker: function initiateWorker(_worker) {},
    postMessage: function postMessage(userMessage) {
      var messageId = messageIds++;
      var messageToSend = [messageId, userMessage];
      return new Promise(function (resolve, reject) {
        callbacks[messageId] = function (error, result) {
          if (error) return reject(new Error(error.message));
          resolve(result);
        };
        if (typeof worker.controller !== "undefined") {
          // service worker, use MessageChannels because e.source is broken in Chrome < 51:
          // https://bugs.chromium.org/p/chromium/issues/detail?id=543198
          var channel = new MessageChannel();
          channel.port1.onmessage = function (e) {
            onMessage(e);
          };
          worker.controller.postMessage(messageToSend, [channel.port2]);
        } else {
          // web worker
          worker.postMessage(messageToSend);
        }
      });
    }
  };
}

const kIsNodeJS = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
const kRequire = kIsNodeJS && typeof module.require === 'function' ? module.require : null; // eslint-disable-line

function browserDecodeBase64(base64, enableUnicode) {
    const binaryString = atob(base64);
    if (enableUnicode) {
        const binaryView = new Uint8Array(binaryString.length);
        Array.prototype.forEach.call(binaryView, (el, idx, arr) => {
            arr[idx] = binaryString.charCodeAt(idx);
        });
        return String.fromCharCode.apply(null, new Uint16Array(binaryView.buffer));
    }
    return binaryString;
}

function nodeDecodeBase64(base64, enableUnicode) {
    return Buffer.from(base64, 'base64').toString(enableUnicode ? 'utf16' : 'utf8');
}

function createBase64WorkerFactory(base64, sourcemap = null, enableUnicode = false) {
    const source = kIsNodeJS ? nodeDecodeBase64(base64, enableUnicode) : browserDecodeBase64(base64, enableUnicode);
    const start = source.indexOf('\n', 10) + 1;
    const body = source.substring(start) + (sourcemap ? `\/\/# sourceMappingURL=${sourcemap}` : '');

    if (kRequire) {
        /* node.js */
        const Worker = kRequire('worker_threads').Worker; // eslint-disable-line
        return function WorkerFactory(options) {
            return new Worker(body, Object.assign({}, options, { eval: true }));
        };
    }

    /* browser */
    const blob = new Blob([body], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    return function WorkerFactory(options) {
        return new Worker(url, options);
    };
}

/* eslint-disable */
var WorkerFactory = createBase64WorkerFactory('Lyogcm9sbHVwLXBsdWdpbi13ZWItd29ya2VyLWxvYWRlciAqLwpmdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5TGltaXQociwgbCkgewogIHZhciB0ID0gbnVsbCA9PSByID8gbnVsbCA6ICJ1bmRlZmluZWQiICE9IHR5cGVvZiBTeW1ib2wgJiYgcltTeW1ib2wuaXRlcmF0b3JdIHx8IHJbIkBAaXRlcmF0b3IiXTsKICBpZiAobnVsbCAhPSB0KSB7CiAgICB2YXIgZSwKICAgICAgbiwKICAgICAgaSwKICAgICAgdSwKICAgICAgYSA9IFtdLAogICAgICBmID0gITAsCiAgICAgIG8gPSAhMTsKICAgIHRyeSB7CiAgICAgIGlmIChpID0gKHQgPSB0LmNhbGwocikpLm5leHQsIDAgPT09IGwpIHsKICAgICAgICBpZiAoT2JqZWN0KHQpICE9PSB0KSByZXR1cm47CiAgICAgICAgZiA9ICExOwogICAgICB9IGVsc2UgZm9yICg7ICEoZiA9IChlID0gaS5jYWxsKHQpKS5kb25lKSAmJiAoYS5wdXNoKGUudmFsdWUpLCBhLmxlbmd0aCAhPT0gbCk7IGYgPSAhMCk7CiAgICB9IGNhdGNoIChyKSB7CiAgICAgIG8gPSAhMCwgbiA9IHI7CiAgICB9IGZpbmFsbHkgewogICAgICB0cnkgewogICAgICAgIGlmICghZiAmJiBudWxsICE9IHQucmV0dXJuICYmICh1ID0gdC5yZXR1cm4oKSwgT2JqZWN0KHUpICE9PSB1KSkgcmV0dXJuOwogICAgICB9IGZpbmFsbHkgewogICAgICAgIGlmIChvKSB0aHJvdyBuOwogICAgICB9CiAgICB9CiAgICByZXR1cm4gYTsKICB9Cn0KZnVuY3Rpb24gb3duS2V5cyhlLCByKSB7CiAgdmFyIHQgPSBPYmplY3Qua2V5cyhlKTsKICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykgewogICAgdmFyIG8gPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKGUpOwogICAgciAmJiAobyA9IG8uZmlsdGVyKGZ1bmN0aW9uIChyKSB7CiAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGUsIHIpLmVudW1lcmFibGU7CiAgICB9KSksIHQucHVzaC5hcHBseSh0LCBvKTsKICB9CiAgcmV0dXJuIHQ7Cn0KZnVuY3Rpb24gX29iamVjdFNwcmVhZDIoZSkgewogIGZvciAodmFyIHIgPSAxOyByIDwgYXJndW1lbnRzLmxlbmd0aDsgcisrKSB7CiAgICB2YXIgdCA9IG51bGwgIT0gYXJndW1lbnRzW3JdID8gYXJndW1lbnRzW3JdIDoge307CiAgICByICUgMiA/IG93bktleXMoT2JqZWN0KHQpLCAhMCkuZm9yRWFjaChmdW5jdGlvbiAocikgewogICAgICBfZGVmaW5lUHJvcGVydHkoZSwgciwgdFtyXSk7CiAgICB9KSA6IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzID8gT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnModCkpIDogb3duS2V5cyhPYmplY3QodCkpLmZvckVhY2goZnVuY3Rpb24gKHIpIHsKICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsIHIsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodCwgcikpOwogICAgfSk7CiAgfQogIHJldHVybiBlOwp9CmZ1bmN0aW9uIF90b1ByaW1pdGl2ZSh0LCByKSB7CiAgaWYgKCJvYmplY3QiICE9IHR5cGVvZiB0IHx8ICF0KSByZXR1cm4gdDsKICB2YXIgZSA9IHRbU3ltYm9sLnRvUHJpbWl0aXZlXTsKICBpZiAodm9pZCAwICE9PSBlKSB7CiAgICB2YXIgaSA9IGUuY2FsbCh0LCByIHx8ICJkZWZhdWx0Iik7CiAgICBpZiAoIm9iamVjdCIgIT0gdHlwZW9mIGkpIHJldHVybiBpOwogICAgdGhyb3cgbmV3IFR5cGVFcnJvcigiQEB0b1ByaW1pdGl2ZSBtdXN0IHJldHVybiBhIHByaW1pdGl2ZSB2YWx1ZS4iKTsKICB9CiAgcmV0dXJuICgic3RyaW5nIiA9PT0gciA/IFN0cmluZyA6IE51bWJlcikodCk7Cn0KZnVuY3Rpb24gX3RvUHJvcGVydHlLZXkodCkgewogIHZhciBpID0gX3RvUHJpbWl0aXZlKHQsICJzdHJpbmciKTsKICByZXR1cm4gInN5bWJvbCIgPT0gdHlwZW9mIGkgPyBpIDogU3RyaW5nKGkpOwp9CmZ1bmN0aW9uIF90eXBlb2YobykgewogICJAYmFiZWwvaGVscGVycyAtIHR5cGVvZiI7CgogIHJldHVybiBfdHlwZW9mID0gImZ1bmN0aW9uIiA9PSB0eXBlb2YgU3ltYm9sICYmICJzeW1ib2wiID09IHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPyBmdW5jdGlvbiAobykgewogICAgcmV0dXJuIHR5cGVvZiBvOwogIH0gOiBmdW5jdGlvbiAobykgewogICAgcmV0dXJuIG8gJiYgImZ1bmN0aW9uIiA9PSB0eXBlb2YgU3ltYm9sICYmIG8uY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvICE9PSBTeW1ib2wucHJvdG90eXBlID8gInN5bWJvbCIgOiB0eXBlb2YgbzsKICB9LCBfdHlwZW9mKG8pOwp9CmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsKICBrZXkgPSBfdG9Qcm9wZXJ0eUtleShrZXkpOwogIGlmIChrZXkgaW4gb2JqKSB7CiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsKICAgICAgdmFsdWU6IHZhbHVlLAogICAgICBlbnVtZXJhYmxlOiB0cnVlLAogICAgICBjb25maWd1cmFibGU6IHRydWUsCiAgICAgIHdyaXRhYmxlOiB0cnVlCiAgICB9KTsKICB9IGVsc2UgewogICAgb2JqW2tleV0gPSB2YWx1ZTsKICB9CiAgcmV0dXJuIG9iajsKfQpmdW5jdGlvbiBfc2xpY2VkVG9BcnJheShhcnIsIGkpIHsKICByZXR1cm4gX2FycmF5V2l0aEhvbGVzKGFycikgfHwgX2l0ZXJhYmxlVG9BcnJheUxpbWl0KGFyciwgaSkgfHwgX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KGFyciwgaSkgfHwgX25vbkl0ZXJhYmxlUmVzdCgpOwp9CmZ1bmN0aW9uIF9hcnJheVdpdGhIb2xlcyhhcnIpIHsKICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gYXJyOwp9CmZ1bmN0aW9uIF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvLCBtaW5MZW4pIHsKICBpZiAoIW8pIHJldHVybjsKICBpZiAodHlwZW9mIG8gPT09ICJzdHJpbmciKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsKICB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7CiAgaWYgKG4gPT09ICJPYmplY3QiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7CiAgaWYgKG4gPT09ICJNYXAiIHx8IG4gPT09ICJTZXQiKSByZXR1cm4gQXJyYXkuZnJvbShvKTsKICBpZiAobiA9PT0gIkFyZ3VtZW50cyIgfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QobikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOwp9CmZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7CiAgaWYgKGxlbiA9PSBudWxsIHx8IGxlbiA+IGFyci5sZW5ndGgpIGxlbiA9IGFyci5sZW5ndGg7CiAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkobGVuKTsgaSA8IGxlbjsgaSsrKSBhcnIyW2ldID0gYXJyW2ldOwogIHJldHVybiBhcnIyOwp9CmZ1bmN0aW9uIF9ub25JdGVyYWJsZVJlc3QoKSB7CiAgdGhyb3cgbmV3IFR5cGVFcnJvcigiSW52YWxpZCBhdHRlbXB0IHRvIGRlc3RydWN0dXJlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC4iKTsKfQoKLy90b2RvOiByZW1vdmUgdGhpcyBhbmQgZm9yayBwcm9taXNlLXdvcmtlciB0byBwcm92aWRlIEVTTQpmdW5jdGlvbiBpc1Byb21pc2Uob2JqKSB7CiAgLy8gdmlhIGh0dHBzOi8vdW5wa2cuY29tL2lzLXByb21pc2VAMi4xLjAvaW5kZXguanMKICByZXR1cm4gISFvYmogJiYgKF90eXBlb2Yob2JqKSA9PT0gIm9iamVjdCIgfHwgdHlwZW9mIG9iaiA9PT0gImZ1bmN0aW9uIikgJiYgdHlwZW9mIG9iai50aGVuID09PSAiZnVuY3Rpb24iOwp9CmZ1bmN0aW9uIHJlZ2lzdGVyUHJvbWlzZVdvcmtlciAoY2FsbGJhY2spIHsKICBmdW5jdGlvbiBwb3N0T3V0Z29pbmdNZXNzYWdlKGUsIG1lc3NhZ2VJZCwgZXJyb3IsIHJlc3VsdCkgewogICAgZnVuY3Rpb24gcG9zdE1lc3NhZ2UobXNnKSB7CiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqLwogICAgICBpZiAodHlwZW9mIHNlbGYucG9zdE1lc3NhZ2UgIT09ICJmdW5jdGlvbiIpIHsKICAgICAgICAvLyBzZXJ2aWNlIHdvcmtlcgogICAgICAgIGUucG9ydHNbMF0ucG9zdE1lc3NhZ2UobXNnKTsKICAgICAgfSBlbHNlIHsKICAgICAgICAvLyB3ZWIgd29ya2VyCiAgICAgICAgc2VsZi5wb3N0TWVzc2FnZShtc2cpOwogICAgICB9CiAgICB9CiAgICBpZiAoZXJyb3IpIHsKICAgICAgcG9zdE1lc3NhZ2UoW21lc3NhZ2VJZCwgewogICAgICAgIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UKICAgICAgfV0pOwogICAgfSBlbHNlIHsKICAgICAgcG9zdE1lc3NhZ2UoW21lc3NhZ2VJZCwgbnVsbCwgcmVzdWx0XSk7CiAgICB9CiAgfQogIGZ1bmN0aW9uIHRyeUNhdGNoRnVuYyhjYWxsYmFjaywgbWVzc2FnZSkgewogICAgdHJ5IHsKICAgICAgcmV0dXJuIHsKICAgICAgICByZXM6IGNhbGxiYWNrKG1lc3NhZ2UpCiAgICAgIH07CiAgICB9IGNhdGNoIChlKSB7CiAgICAgIHJldHVybiB7CiAgICAgICAgZXJyOiBlCiAgICAgIH07CiAgICB9CiAgfQogIGZ1bmN0aW9uIGhhbmRsZUluY29taW5nTWVzc2FnZShlLCBjYWxsYmFjaywgbWVzc2FnZUlkLCBtZXNzYWdlKSB7CiAgICB2YXIgcmVzdWx0ID0gdHJ5Q2F0Y2hGdW5jKGNhbGxiYWNrLCBtZXNzYWdlKTsKICAgIGlmIChyZXN1bHQuZXJyKSB7CiAgICAgIHBvc3RPdXRnb2luZ01lc3NhZ2UoZSwgbWVzc2FnZUlkLCByZXN1bHQuZXJyKTsKICAgIH0gZWxzZSBpZiAoIWlzUHJvbWlzZShyZXN1bHQucmVzKSkgewogICAgICBwb3N0T3V0Z29pbmdNZXNzYWdlKGUsIG1lc3NhZ2VJZCwgbnVsbCwgcmVzdWx0LnJlcyk7CiAgICB9IGVsc2UgewogICAgICByZXN1bHQucmVzLnRoZW4oZnVuY3Rpb24gKGZpbmFsUmVzdWx0KSB7CiAgICAgICAgcG9zdE91dGdvaW5nTWVzc2FnZShlLCBtZXNzYWdlSWQsIG51bGwsIGZpbmFsUmVzdWx0KTsKICAgICAgfSwgZnVuY3Rpb24gKGZpbmFsRXJyb3IpIHsKICAgICAgICBwb3N0T3V0Z29pbmdNZXNzYWdlKGUsIG1lc3NhZ2VJZCwgZmluYWxFcnJvcik7CiAgICAgIH0pOwogICAgfQogIH0KICBmdW5jdGlvbiBvbkluY29taW5nTWVzc2FnZShlKSB7CiAgICB2YXIgcGF5bG9hZCA9IGUuZGF0YTsKICAgIGlmICghQXJyYXkuaXNBcnJheShwYXlsb2FkKSB8fCBwYXlsb2FkLmxlbmd0aCAhPT0gMikgewogICAgICAvLyBtZXNzYWdlIGRvZW5zJ3QgbWF0Y2ggY29tbXVuaWNhdGlvbiBmb3JtYXQ7IGlnbm9yZQogICAgICByZXR1cm47CiAgICB9CiAgICB2YXIgbWVzc2FnZUlkID0gcGF5bG9hZFswXTsKICAgIHZhciBtZXNzYWdlID0gcGF5bG9hZFsxXTsKICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09ICJmdW5jdGlvbiIpIHsKICAgICAgcG9zdE91dGdvaW5nTWVzc2FnZShlLCBtZXNzYWdlSWQsIG5ldyBFcnJvcigiUGxlYXNlIHBhc3MgYSBmdW5jdGlvbiBpbnRvIHJlZ2lzdGVyKCkuIikpOwogICAgfSBlbHNlIHsKICAgICAgaGFuZGxlSW5jb21pbmdNZXNzYWdlKGUsIGNhbGxiYWNrLCBtZXNzYWdlSWQsIG1lc3NhZ2UpOwogICAgfQogIH0KICBzZWxmLmFkZEV2ZW50TGlzdGVuZXIoIm1lc3NhZ2UiLCBvbkluY29taW5nTWVzc2FnZSk7Cn0KCnZhciBjcmVhdG9yc19vZmZzZXQgPSBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MDsKaWYgKGNyZWF0b3JzX29mZnNldCAqIC0xID49IDApIHsKICBjcmVhdG9yc19vZmZzZXQgKj0gLTE7CiAgY3JlYXRvcnNfb2Zmc2V0ID0gIiIuY29uY2F0KChjcmVhdG9yc19vZmZzZXQgKyAnJykucGFkU3RhcnQoMiwgJzAnKSwgIjowMCIpOwogIGNyZWF0b3JzX29mZnNldCA9ICIrIi5jb25jYXQoY3JlYXRvcnNfb2Zmc2V0KTsKfSBlbHNlIHsKICBjcmVhdG9yc19vZmZzZXQgPSAiIi5jb25jYXQoKGNyZWF0b3JzX29mZnNldCArICcnKS5wYWRTdGFydCgyLCAnMCcpLCAiOjAwIik7CiAgY3JlYXRvcnNfb2Zmc2V0ID0gIi0iLmNvbmNhdChjcmVhdG9yc19vZmZzZXQpOwp9CnZhciBnZXRIb3VybGVzc0RhdGUgPSBmdW5jdGlvbiBnZXRIb3VybGVzc0RhdGUoZGF0ZV9zdHJpbmcpIHsKICB2YXIgdG9kYXkgPSBkYXRlX3N0cmluZyA/IG5ldyBEYXRlKGRhdGVfc3RyaW5nKSA6IG5ldyBEYXRlKCk7CiAgdmFyIHllYXIgPSB0b2RheS5nZXRGdWxsWWVhcigpICsgJycsCiAgICBtb250aCA9ICh0b2RheS5nZXRNb250aCgpICsgMSArICcnKS5wYWRTdGFydCgyLCAnMCcpLAogICAgZGF5ID0gKHRvZGF5LmdldERhdGUoKSArICcnKS5wYWRTdGFydCgyLCAnMCcpOwogIHJldHVybiAiIi5jb25jYXQoeWVhciwgIi0iKS5jb25jYXQobW9udGgsICItIikuY29uY2F0KGRheSwgIlQwMDowMDowMC4wMDBaIik7Cn07CnZhciBnZXRZZWFyTW9udGhEYXkgPSBmdW5jdGlvbiBnZXRZZWFyTW9udGhEYXkoZGF0ZV9zdHJpbmcpIHsKICByZXR1cm4gZ2V0SG91cmxlc3NEYXRlKGRhdGVfc3RyaW5nKS5zbGljZSgwLCAxMCk7Cn07CnZhciBhZGREYXlzID0gZnVuY3Rpb24gYWRkRGF5cyhkYXRlLCBkYXlzKSB7CiAgdmFyIGRhdGVPYmogPSBuZXcgRGF0ZShkYXRlKTsKICBkYXRlT2JqLnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApOwogIGRhdGVPYmouc2V0RGF0ZShkYXRlT2JqLmdldERhdGUoKSArIGRheXMpOwogIHJldHVybiBkYXRlT2JqOwp9Owp2YXIgZ2VuZXJhdGVVVUlEID0gZnVuY3Rpb24gZ2VuZXJhdGVVVUlEKCkgewogIHJldHVybiAoWzFlN10gKyAtMWUzICsgLTRlMyArIC04ZTMgKyAtMWUxMSkucmVwbGFjZSgvWzAxOF0vZywgZnVuY3Rpb24gKGMpIHsKICAgIHJldHVybiAoYyBeIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQ4QXJyYXkoMSkpWzBdICYgMTUgPj4gYyAvIDQpLnRvU3RyaW5nKDE2KTsKICB9KTsKfTsKdmFyIGdldExvY2FsZVRpbWUgPSBmdW5jdGlvbiBnZXRMb2NhbGVUaW1lKGRhdGVTdHJpbmcpIHsKICB2YXIgX0RhdGUkdG9Mb2NhbGVTdHJpbmckID0gbmV3IERhdGUoZGF0ZVN0cmluZykudG9Mb2NhbGVTdHJpbmcoJ2VuLUdCJykuc3BsaXQoJywgJyksCiAgICBfRGF0ZSR0b0xvY2FsZVN0cmluZyQyID0gX3NsaWNlZFRvQXJyYXkoX0RhdGUkdG9Mb2NhbGVTdHJpbmckLCAyKSwKICAgIGRhdGUgPSBfRGF0ZSR0b0xvY2FsZVN0cmluZyQyWzBdLAogICAgaG91ciA9IF9EYXRlJHRvTG9jYWxlU3RyaW5nJDJbMV07CiAgZGF0ZSA9IGRhdGUuc3BsaXQoJy8nKS5yZXZlcnNlKCkuam9pbignLScpOwogIHJldHVybiAiIi5jb25jYXQoZGF0ZSwgIlQiKS5jb25jYXQoaG91ciwgIi4wMDBaIik7Cn07Cgp2YXIgaG91clV0aWxzID0gewogIGdldEFsbEhvdXJzOiBmdW5jdGlvbiBnZXRBbGxIb3VycygpIHsKICAgIHJldHVybiBbJzA2OjAwOjAwJywgJzA2OjEwOjAwJywgJzA2OjIwOjAwJywgJzA2OjMwOjAwJywgJzA2OjQwOjAwJywgJzA2OjUwOjAwJywgJzA3OjAwOjAwJywgJzA3OjEwOjAwJywgJzA3OjIwOjAwJywgJzA3OjMwOjAwJywgJzA3OjQwOjAwJywgJzA3OjUwOjAwJywgJzA4OjAwOjAwJywgJzA4OjEwOjAwJywgJzA4OjIwOjAwJywgJzA4OjMwOjAwJywgJzA4OjQwOjAwJywgJzA4OjUwOjAwJywgJzA5OjAwOjAwJywgJzA5OjEwOjAwJywgJzA5OjIwOjAwJywgJzA5OjMwOjAwJywgJzA5OjQwOjAwJywgJzA5OjUwOjAwJywgJzEwOjAwOjAwJywgJzEwOjEwOjAwJywgJzEwOjIwOjAwJywgJzEwOjMwOjAwJywgJzEwOjQwOjAwJywgJzEwOjUwOjAwJywgJzExOjAwOjAwJywgJzExOjEwOjAwJywgJzExOjIwOjAwJywgJzExOjMwOjAwJywgJzExOjQwOjAwJywgJzExOjUwOjAwJywgJzEyOjAwOjAwJywgJzEyOjEwOjAwJywgJzEyOjIwOjAwJywgJzEyOjMwOjAwJywgJzEyOjQwOjAwJywgJzEyOjUwOjAwJywgJzEzOjAwOjAwJywgJzEzOjEwOjAwJywgJzEzOjIwOjAwJywgJzEzOjMwOjAwJywgJzEzOjQwOjAwJywgJzEzOjUwOjAwJywgJzE0OjAwOjAwJywgJzE0OjEwOjAwJywgJzE0OjIwOjAwJywgJzE0OjMwOjAwJywgJzE0OjQwOjAwJywgJzE0OjUwOjAwJywgJzE1OjAwOjAwJywgJzE1OjEwOjAwJywgJzE1OjIwOjAwJywgJzE1OjMwOjAwJywgJzE1OjQwOjAwJywgJzE1OjUwOjAwJywgJzE2OjAwOjAwJywgJzE2OjEwOjAwJywgJzE2OjIwOjAwJywgJzE2OjMwOjAwJywgJzE2OjQwOjAwJywgJzE2OjUwOjAwJywgJzE3OjAwOjAwJywgJzE3OjEwOjAwJywgJzE3OjIwOjAwJywgJzE3OjMwOjAwJywgJzE3OjQwOjAwJywgJzE3OjUwOjAwJywgJzE4OjAwOjAwJywgJzE4OjEwOjAwJywgJzE4OjIwOjAwJywgJzE4OjMwOjAwJywgJzE4OjQwOjAwJywgJzE4OjUwOjAwJywgJzE5OjAwOjAwJywgJzE5OjEwOjAwJywgJzE5OjIwOjAwJywgJzE5OjMwOjAwJywgJzE5OjQwOjAwJywgJzE5OjUwOjAwJywgJzIwOjAwOjAwJywgJzIwOjEwOjAwJywgJzIwOjIwOjAwJywgJzIwOjMwOjAwJywgJzIwOjQwOjAwJywgJzIwOjUwOjAwJywgJzIxOjAwOjAwJywgJzIxOjEwOjAwJywgJzIxOjIwOjAwJywgJzIxOjMwOjAwJywgJzIxOjQwOjAwJywgJzIxOjUwOjAwJywgJzIyOjAwOjAwJywgJzIyOjEwOjAwJywgJzIyOjIwOjAwJywgJzIyOjMwOjAwJywgJzIyOjQwOjAwJywgJzIyOjUwOjAwJywgJzIzOjAwOjAwJywgJzIzOjEwOjAwJywgJzIzOjIwOjAwJywgJzIzOjMwOjAwJywgJzIzOjQwOjAwJywgJzIzOjUwOjAwJywgJzAwOjAwOjAwJywgJzAwOjEwOjAwJywgJzAwOjIwOjAwJywgJzAwOjMwOjAwJywgJzAwOjQwOjAwJywgJzAwOjUwOjAwJywgJzAxOjAwOjAwJywgJzAxOjEwOjAwJywgJzAxOjIwOjAwJywgJzAxOjMwOjAwJywgJzAxOjQwOjAwJywgJzAxOjUwOjAwJywgJzAyOjAwOjAwJywgJzAyOjEwOjAwJywgJzAyOjIwOjAwJywgJzAyOjMwOjAwJywgJzAyOjQwOjAwJywgJzAyOjUwOjAwJywgJzAzOjAwOjAwJywgJzAzOjEwOjAwJywgJzAzOjIwOjAwJywgJzAzOjMwOjAwJywgJzAzOjQwOjAwJywgJzAzOjUwOjAwJywgJzA0OjAwOjAwJywgJzA0OjEwOjAwJywgJzA0OjIwOjAwJywgJzA0OjMwOjAwJywgJzA0OjQwOjAwJywgJzA0OjUwOjAwJywgJzA1OjAwOjAwJywgJzA1OjEwOjAwJywgJzA1OjIwOjAwJywgJzA1OjMwOjAwJywgJzA1OjQwOjAwJywgJzA1OjUwOjAwJywgJzA2OjAwOjAwJ107CiAgfSwKICBnZXRGdWxsSG91cnM6IGZ1bmN0aW9uIGdldEZ1bGxIb3VycygpIHsKICAgIHJldHVybiBbJzAxOjAwOjAwJywgJzAyOjAwOjAwJywgJzAzOjAwOjAwJywgJzA0OjAwOjAwJywgJzA1OjAwOjAwJywgJzA2OjAwOjAwJywgJzA3OjAwOjAwJywgJzA4OjAwOjAwJywgJzA5OjAwOjAwJywgJzEwOjAwOjAwJywgJzExOjAwOjAwJywgJzEyOjAwOjAwJywgJzEzOjAwOjAwJywgJzE0OjAwOjAwJywgJzE1OjAwOjAwJywgJzE2OjAwOjAwJywgJzE3OjAwOjAwJywgJzE4OjAwOjAwJywgJzE5OjAwOjAwJywgJzIwOjAwOjAwJywgJzIxOjAwOjAwJywgJzIyOjAwOjAwJywgJzIzOjAwOjAwJywgJzAwOjAwOjAwJ107CiAgfQp9OwoKcmVnaXN0ZXJQcm9taXNlV29ya2VyKGZ1bmN0aW9uIChtZXNzYWdlKSB7CiAgdmFyIHR5cGUgPSBtZXNzYWdlLnR5cGUsCiAgICBkYXRhID0gbWVzc2FnZS5kYXRhOwogIGlmICh0eXBlID09PSAibWVzc2FnZSIpIHsKICAgIHJldHVybiAiV29ya2VyIHJlcGxpZXM6ICIuY29uY2F0KG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSk7CiAgfQogIHN3aXRjaCAodHlwZSkgewogICAgY2FzZSAiZ2V0RGF5cyI6CiAgICAgIHJldHVybiBnZXREYXlzKGRhdGEuZGF5LCBkYXRhLm9wdGlvbnMpOwogICAgY2FzZSAiZ2V0SG91cnMiOgogICAgICByZXR1cm4gZ2V0SG91cnMoZGF0YS5ob3VyT3B0aW9ucyk7CiAgICBjYXNlICJnZXREYXlDZWxscyI6CiAgICAgIHJldHVybiBnZXREYXlDZWxscyhkYXRhLmRheSwgZGF0YS5ob3VyT3B0aW9ucywgZGF0YS5ob3VybHlTZWxlY3Rpb24pOwogICAgY2FzZSAiY29uc3RydWN0RGF5RXZlbnRzIjoKICAgICAgcmV0dXJuIGNvbnN0cnVjdERheUV2ZW50cyhkYXRhLmRheSwgZGF0YS5ldmVudHMpOwogICAgY2FzZSAiY29uc3RydWN0TmV3RXZlbnQiOgogICAgICByZXR1cm4gY29uc3RydWN0TmV3RXZlbnQoZGF0YS5ldmVudCk7CiAgfQp9KTsKZnVuY3Rpb24gZ2V0RGF5cyhkYXlTdHJpbmcsIF9yZWYpIHsKICB2YXIgaGlkZV9kYXRlcyA9IF9yZWYuaGlkZV9kYXRlcywKICAgIGhpZGVfZGF5cyA9IF9yZWYuaGlkZV9kYXlzLAogICAgdmlld190eXBlID0gX3JlZi52aWV3X3R5cGU7CiAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgiIi5jb25jYXQoZGF5U3RyaW5nLCAiVDAwOjAwOjAwLjAwMFoiKSk7CiAgdmFyIGRheV9vZl93ZWVrID0gZGF0ZS5nZXRVVENEYXkoKSAtIDE7CiAgdmFyIGRheXMgPSBbXTsKICBpZiAodmlld190eXBlID09PSAiZGF5IikgewogICAgZGF5cyA9IFt7CiAgICAgIHZhbHVlOiBkYXRlLnRvSVNPU3RyaW5nKCksCiAgICAgIGluZGV4OiAwCiAgICB9XTsKICB9IGVsc2UgewogICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgNzsgaWR4KyspIHsKICAgICAgZGF5cy5wdXNoKHsKICAgICAgICB2YWx1ZTogYWRkRGF5cyhkYXRlLCBpZHggLSBkYXlfb2Zfd2VlaykudG9JU09TdHJpbmcoKSwKICAgICAgICBpbmRleDogaWR4CiAgICAgIH0pOwogICAgfQogIH0KICBpZiAoaGlkZV9kYXRlcyAmJiBoaWRlX2RhdGVzLmxlbmd0aCA+IDApIHsKICAgIGRheXMgPSBkYXlzLmZpbHRlcihmdW5jdGlvbiAoX3JlZjIpIHsKICAgICAgdmFyIHZhbHVlID0gX3JlZjIudmFsdWU7CiAgICAgIHJldHVybiBoaWRlX2RhdGVzLmluZGV4T2YodmFsdWUuc2xpY2UoMCwgMTApKSA8IDA7CiAgICB9KTsKICB9CiAgaWYgKGhpZGVfZGF5cyAmJiBoaWRlX2RheXMubGVuZ3RoID4gMCkgewogICAgZGF5cyA9IGRheXMuZmlsdGVyKGZ1bmN0aW9uIChfcmVmMykgewogICAgICB2YXIgaW5kZXggPSBfcmVmMy5pbmRleDsKICAgICAgcmV0dXJuIGhpZGVfZGF5cy5pbmRleE9mKGluZGV4KSA8IDA7CiAgICB9KTsKICB9CiAgcmV0dXJuIGRheXM7Cn0KZnVuY3Rpb24gZ2V0SG91cnMoaG91cl9vcHRpb25zKSB7CiAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpOwogIGRhdGUuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7CiAgdmFyIGlzb19kYXRlID0gZ2V0WWVhck1vbnRoRGF5KGRhdGUpOwogIHZhciBkYXlfaG91cnMgPSBob3VyVXRpbHMuZ2V0RnVsbEhvdXJzKCk7CiAgaWYgKGhvdXJfb3B0aW9ucykgewogICAgdmFyIHN0YXJ0X2hvdXIgPSBob3VyX29wdGlvbnMuc3RhcnRfaG91ciwKICAgICAgZW5kX2hvdXIgPSBob3VyX29wdGlvbnMuZW5kX2hvdXI7CiAgICBkYXlfaG91cnMgPSBkYXlfaG91cnMuc2xpY2Uoc3RhcnRfaG91ciwgZW5kX2hvdXIpOwogIH0KICB2YXIgaG91cnMgPSBbXTsKICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBkYXlfaG91cnMubGVuZ3RoOyBpZHgrKykgewogICAgdmFyIHZhbHVlID0gIiIuY29uY2F0KGlzb19kYXRlLCAiVCIpLmNvbmNhdChkYXlfaG91cnNbaWR4XSwgIi4wMDBaIik7CiAgICBob3Vycy5wdXNoKHsKICAgICAgdmFsdWU6IHZhbHVlLAogICAgICBpbmRleDogaWR4LAogICAgICB2aXNpYmxlOiB0cnVlCiAgICB9KTsKICB9CiAgcmV0dXJuIGhvdXJzOwp9CnZhciBnZXREYXlDZWxscyA9IGZ1bmN0aW9uIGdldERheUNlbGxzKGRheVN0cmluZywgZGF5X29wdGlvbnMsIGhvdXJseVNlbGVjdGlvbikgewogIGlmIChuZXcgRGF0ZShkYXlTdHJpbmcpLnRvSVNPU3RyaW5nKCkgIT09IGRheVN0cmluZykgewogICAgdGhyb3cgbmV3IEVycm9yKCJVbnN1cHBvcnRlZCBkYXlTdHJpbmcgcGFyYW1ldGVyIHByb3ZpZGVkIik7CiAgfQogIHZhciBjZWxscyA9IFtdOwogIHZhciBkYXRlX3BhcnQgPSBkYXlTdHJpbmcuc2xpY2UoMCwgMTApOwogIHZhciBhbGxfaG91cnMgPSBob3VybHlTZWxlY3Rpb24gPyBob3VyVXRpbHMuZ2V0RnVsbEhvdXJzKCkgOiBob3VyVXRpbHMuZ2V0QWxsSG91cnMoKTsKICBpZiAoZGF5X29wdGlvbnMpIHsKICAgIHZhciBzdGFydF9ob3VyID0gZGF5X29wdGlvbnMuc3RhcnRfaG91ciwKICAgICAgZW5kX2hvdXIgPSBkYXlfb3B0aW9ucy5lbmRfaG91cjsKICAgIHZhciBzdGFydF9pbmRleCA9IHN0YXJ0X2hvdXIgKiAoaG91cmx5U2VsZWN0aW9uID8gMSA6IDYpOwogICAgdmFyIGVuZF9pbmRleCA9IGVuZF9ob3VyICogKGhvdXJseVNlbGVjdGlvbiA/IDEgOiA2KSArIDE7CiAgICBhbGxfaG91cnMgPSBhbGxfaG91cnMuc2xpY2Uoc3RhcnRfaW5kZXgsIGVuZF9pbmRleCk7CiAgfQogIGZvciAodmFyIGhvdXJJZHggPSAwOyBob3VySWR4IDwgYWxsX2hvdXJzLmxlbmd0aDsgaG91cklkeCsrKSB7CiAgICB2YXIgaG91ciA9IGFsbF9ob3Vyc1tob3VySWR4XTsKICAgIHZhciB2YWx1ZSA9ICIiLmNvbmNhdChkYXRlX3BhcnQsICJUIikuY29uY2F0KGhvdXIsICIuMDAwWiIpOwogICAgY2VsbHMucHVzaCh7CiAgICAgIHZhbHVlOiB2YWx1ZSwKICAgICAgaW5kZXg6IGhvdXJJZHgsCiAgICAgIHZpc2libGU6IHRydWUKICAgIH0pOwogIH0KICByZXR1cm4gY2VsbHM7Cn07CnZhciBjb25zdHJ1Y3REYXlFdmVudHMgPSBmdW5jdGlvbiBjb25zdHJ1Y3REYXlFdmVudHMoZGF5LCBleGlzdGluZ19ldmVudHMpIHsKICB2YXIgZXZlbnRzX2Zvcl90aGlzX2RheSA9IGV4aXN0aW5nX2V2ZW50cy5tYXAoZnVuY3Rpb24gKGV2ZW50KSB7CiAgICB2YXIgZnJvbSA9IGV2ZW50LmZyb20sCiAgICAgIHRvID0gZXZlbnQudG87CiAgICBmcm9tID0gZ2V0TG9jYWxlVGltZShmcm9tKTsKICAgIHRvID0gZ2V0TG9jYWxlVGltZSh0byk7CiAgICByZXR1cm4gX29iamVjdFNwcmVhZDIoX29iamVjdFNwcmVhZDIoe30sIGV2ZW50KSwge30sIHsKICAgICAgZnJvbTogZnJvbSwKICAgICAgdG86IHRvCiAgICB9KTsKICB9KS5maWx0ZXIoZnVuY3Rpb24gKF9yZWY0KSB7CiAgICB2YXIgZnJvbSA9IF9yZWY0LmZyb207CiAgICByZXR1cm4gZnJvbS5zbGljZSgwLCAxMCkgPT09IGRheS5zbGljZSgwLCAxMCk7CiAgfSk7CiAgaWYgKGV2ZW50c19mb3JfdGhpc19kYXkubGVuZ3RoID09PSAwKSByZXR1cm4ge307CiAgdmFyIGZpbHRlcmVkX2V2ZW50cyA9IHt9OwogIGV2ZW50c19mb3JfdGhpc19kYXkuZm9yRWFjaChmdW5jdGlvbiAoZXZlbnQpIHsKICAgIHZhciBjb25zdHJ1Y3RlZEV2ZW50ID0gY29uc3RydWN0TmV3RXZlbnQoZXZlbnQpOwogICAgdmFyIGtleSA9IGNvbnN0cnVjdGVkRXZlbnQua2V5OwogICAgaWYgKGZpbHRlcmVkX2V2ZW50cy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7CiAgICAgIGZpbHRlcmVkX2V2ZW50c1trZXldLnB1c2goY29uc3RydWN0ZWRFdmVudCk7CiAgICB9IGVsc2UgewogICAgICBmaWx0ZXJlZF9ldmVudHNba2V5XSA9IFtjb25zdHJ1Y3RlZEV2ZW50XTsKICAgIH0KICB9KTsKICByZXR1cm4gZmlsdGVyZWRfZXZlbnRzOwp9Owp2YXIgY29uc3RydWN0TmV3RXZlbnQgPSBmdW5jdGlvbiBjb25zdHJ1Y3ROZXdFdmVudChldmVudCkgewogIHZhciBmcm9tID0gZXZlbnQuZnJvbSwKICAgIHRvID0gZXZlbnQudG87CiAgZnJvbSA9IG5ldyBEYXRlKGZyb20pOwogIHRvID0gbmV3IERhdGUodG8pOwogIGZyb20uc2V0VVRDU2Vjb25kcygwLCAwKTsKICB0by5zZXRVVENTZWNvbmRzKDAsIDApOwogIHZhciBmcm9tX3ZhbHVlID0gZnJvbS50b0lTT1N0cmluZygpOwogIHZhciBtYXNrZWRfZnJvbSA9IG5ldyBEYXRlKGZyb20uZ2V0VGltZSgpKTsKICB2YXIgbWFza2VkX3RvID0gbmV3IERhdGUodG8uZ2V0VGltZSgpKTsKICB2YXIgZnJvbURhdGEgPSB7CiAgICB2YWx1ZTogZnJvbV92YWx1ZSwKICAgIG1hc2tlZF92YWx1ZTogbWFza2VkX2Zyb20udG9JU09TdHJpbmcoKSwKICAgIHJvdW5kZWQ6IGZhbHNlLAogICAgcm91bmRfb2Zmc2V0OiBudWxsCiAgfTsKICB2YXIgdG9fdmFsdWUgPSB0by50b0lTT1N0cmluZygpOwogIHZhciB0b0RhdGEgPSB7CiAgICB2YWx1ZTogdG9fdmFsdWUsCiAgICBtYXNrZWRfdmFsdWU6IG1hc2tlZF90by50b0lTT1N0cmluZygpLAogICAgcm91bmRlZDogZmFsc2UsCiAgICByb3VuZF9vZmZzZXQ6IG51bGwKICB9OwogIHZhciBtdWx0aXBsZU9mMTAgPSBmdW5jdGlvbiBtdWx0aXBsZU9mMTAoZGF0ZVN0cikgewogICAgcmV0dXJuIG5ldyBEYXRlKGRhdGVTdHIpLmdldE1pbnV0ZXMoKSAlIDEwOwogIH07CiAgaWYgKG11bHRpcGxlT2YxMChmcm9tRGF0YS52YWx1ZSkgIT09IDApIHsKICAgIGZyb21EYXRhLnJvdW5kZWQgPSB0cnVlOwogICAgZnJvbURhdGEucm91bmRfb2Zmc2V0ID0gbXVsdGlwbGVPZjEwKGZyb21EYXRhLnZhbHVlKTsKICAgIHZhciBtaW51dGVzID0gbmV3IERhdGUoZnJvbURhdGEudmFsdWUpLmdldE1pbnV0ZXMoKTsKICAgIHZhciBtYXNrZWRNaW51dGVzID0gTWF0aC5mbG9vcihtaW51dGVzIC8gMTApICogMTA7CiAgICBtYXNrZWRfZnJvbS5zZXRNaW51dGVzKG1hc2tlZE1pbnV0ZXMpOwogICAgZnJvbURhdGEubWFza2VkX3ZhbHVlID0gbWFza2VkX2Zyb20udG9JU09TdHJpbmcoKTsKICB9CiAgdmFyIGV2ZW50S2V5ID0gbWFza2VkX2Zyb20udG9JU09TdHJpbmcoKTsKCiAgLy8gMSBtaW51dGUgZXF1YWxzIDEgcGl4ZWwgaW4gb3VyIHZpZXcuIFRoYXQgbWVhbnMgd2UgbmVlZCB0byBmaW5kIHRoZSBsZW5ndGgKICAvLyBvZiB0aGUgZXZlbnQgYnkgZmluZGluZyBvdXQgdGhlIGRpZmZlcmVuY2UgaW4gbWludXRlcwogIHZhciBkaWZmSW5NcyA9IHRvIC0gZnJvbTsKICB2YXIgZGlmZkluSHJzID0gTWF0aC5mbG9vcihkaWZmSW5NcyAlIDg2NDAwMDAwIC8gMzYwMDAwMCk7CiAgdmFyIGRpZmZNaW5zID0gTWF0aC5yb3VuZChkaWZmSW5NcyAlIDg2NDAwMDAwICUgMzYwMDAwMCAvIDYwMDAwKTsKICB2YXIgY29uc3RydWN0ZWRFdmVudCA9IHsKICAgIHN0YXJ0OiBmcm9tRGF0YSwKICAgIGVuZDogdG9EYXRhLAogICAgZGF0YTogZXZlbnQuZGF0YSwKICAgIGlkOiBldmVudC5pZCB8fCBnZW5lcmF0ZVVVSUQoKSwKICAgIGRpc3RhbmNlOiBkaWZmTWlucyArIGRpZmZJbkhycyAqIDYwLAogICAgc3RhdHVzOiAiY29tcGxldGVkIiwKICAgIGtleTogZXZlbnRLZXkKICB9OwogIHJldHVybiBjb25zdHJ1Y3RlZEV2ZW50Owp9OwoK', null, false);
/* eslint-enable */

//}
var worker = new WorkerFactory();
var promiseWorker = PromiseWorker(worker);
var send = function send() {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "message";
  var data = arguments.length > 1 ? arguments[1] : undefined;
  return promiseWorker.postMessage({
    type: type,
    data: data
  });
};
var myWorker = {
  send: send
};

var script = {
  props: ["day", "passedTime"],
  created: function created() {
    // get and render day cells
    // and then render any event
    // on top of them
    this.renderDay();
  },
  components: {
    kalendarCell: function kalendarCell() {
      return import('./kalendar-cell-2e0d66d0.js');
    }
  },
  provide: function provide() {
    // provide these methods to children components
    // for easier access
    return {
      kalendarAddEvent: this.addEvent,
      kalendarClearPopups: this.clearCreatingLeftovers
    };
  },
  // inject kalendar options from parent component
  inject: ["kalendar_options"],
  mounted: function mounted() {
    if (this.kalendar_options.scrollToNow && this.isToday) this.scrollView();
  },
  computed: {
    isWeekend: function isWeekend$1() {
      return isWeekend(this.day.value);
    },
    isToday: function isToday$1() {
      return isToday(this.day.value);
    }
  },
  data: function data() {
    return {
      // this is the main object
      // we use to make selections
      // and control their flows
      creator: {
        creating: false,
        starting_cell: null,
        original_starting_cell: null,
        current_cell: null,
        ending_cell: null,
        status: null
      },
      // temporary event is an object
      // that holds values of creator
      // when the popup is initiated
      temporary_event: null,
      // day cells and events are used for rendering purposes
      day_cells: [],
      day_events: null
    };
  },
  methods: {
    renderDay: function renderDay() {
      var _this = this;
      myWorker.send("getDayCells", {
        day: this.day.value,
        hourOptions: {
          start_hour: this.kalendar_options.day_starts_at,
          end_hour: this.kalendar_options.day_ends_at
        },
        hourlySelection: this.kalendar_options.hourlySelection
      }).then(function (reply) {
        _this.day_cells = reply;
        return _this.getDayEvents(_this.$kalendar.getEvents());
      });
    },
    addEvent: function addEvent(payload) {
      var _this2 = this;
      // validation
      var validation_message = this.checkEventValidity(payload);
      if (validation_message !== null) {
        return Promise.reject(validation_message);
      }

      // use web worker to generate event
      // and then render it in the day_events objects
      var from = payload.from,
        to = payload.to;
      from = getLocaleTime(from);
      to = getLocaleTime(to);
      return myWorker.send("constructNewEvent", {
        event: _objectSpread2(_objectSpread2({}, payload), {}, {
          from: from,
          to: to
        })
      }).then(function (constructed_event) {
        var key = constructed_event.key;
        if (_this2.day_events.hasOwnProperty(key)) {
          _this2.day_events[key].push(constructed_event);
        } else {
          // must use $set since key wasnt present in the object
          // vue will fail to render it
          _this2.$set(_this2.day_events, key, [constructed_event]);
        }
        var events = _this2.$kalendar.getEvents();
        events.push(_objectSpread2(_objectSpread2({}, payload), {}, {
          id: constructed_event.id
        }));
        _this2.$kalendar.updateEvents(events);
      });
    },
    // this is not called inside this component
    // but rather from the kalendar-weekview component
    // which targets it using $refs object.
    removeEvent: function removeEvent(payload) {
      var events = this.$kalendar.getEvents();
      var eventIndex = events.findIndex(function (event) {
        return event.id === payload.id;
      });
      if (eventIndex < 0) return;
      events.splice(eventIndex, 1);
      var index = this.day_events[payload.key].findIndex(function (event) {
        return event.id === payload.id;
      });
      this.day_events[payload.key].splice(index, 1);
      this.$kalendar.updateEvents(events);
      return Promise.resolve();
    },
    checkEventValidity: function checkEventValidity(payload) {
      var from = payload.from,
        to = payload.to;
      if (!from || !to) return "No dates were provided in the payload";
      /*if (isoFrom !== from) {
        return 'From date is not ISO format';
      }
      if (isoTo !== to) {
        return 'To date is not ISO format';
      }*/
      return null;
    },
    getDayEvents: function getDayEvents(events) {
      var _this3 = this;
      var clonedEvents = events.map(function (event) {
        return cloneObject(event);
      });
      return myWorker.send("constructDayEvents", {
        events: clonedEvents,
        day: this.day.value
      }).then(function (constructed_events) {
        _this3.day_events = constructed_events;
      });
    },
    clearCreatingLeftovers: function clearCreatingLeftovers() {
      for (var key in this.day_events) {
        var hasPending = this.day_events[key].some(function (event) {
          return event.status === "popup-initiated" || event.status === "creating";
        });
        if (hasPending) {
          var completed = this.day_events[key].filter(function (event) {
            return event.status === "completed";
          });
          this.$set(this.day_events, key, completed);
          if (completed.length === 0) {
            delete this.day_events[key];
          }
        }
      }
      this.resetEvents();
    },
    resetEvents: function resetEvents() {
      if (!this.creator.creating && this.creator.status === null) return;
      this.creator = {
        creating: false,
        starting_cell: null,
        original_starting_cell: null,
        current_cell: null,
        ending_cell: null,
        status: null,
        temporary_id: null
      };
      this.temporary_event = null;
    },
    // this method is what we use
    // to start the flow of selecting a new cell
    // while the creator is enabled
    updateCreator: function updateCreator(payload) {
      this.creator = _objectSpread2(_objectSpread2({}, this.validateSelection(payload)), {}, {
        status: "creating"
      });
      if (this.kalendar_options.overlap === false && Object.keys(this.day_events).length > 0) {
        var fixedOverlap = this.overlapPolice(payload);
        if (fixedOverlap) {
          this.creator = this.validateSelection(fixedOverlap);
          this.selectCell();
          this.initiatePopup();
          return;
        }
      }
      this.selectCell();
    },
    // when the direction is reversed,
    // the ending cell is actually the originally selected cell
    validateSelection: function validateSelection(event) {
      var original_starting_cell = event.original_starting_cell,
        starting_cell = event.starting_cell,
        current_cell = event.current_cell;
      if (event.direction === "reverse" && original_starting_cell.index > current_cell.index) {
        return _objectSpread2(_objectSpread2({}, event), {}, {
          starting_cell: current_cell,
          ending_cell: original_starting_cell
        });
      }
      return event;
    },
    selectCell: function selectCell() {
      if (!this.creator.creating) return;
      var _this$creator = this.creator,
        creating = _this$creator.creating,
        ending_cell = _this$creator.ending_cell,
        current_cell = _this$creator.current_cell,
        starting_cell = _this$creator.starting_cell,
        original_starting_cell = _this$creator.original_starting_cell;
      var real_ending_cell_index = ending_cell.index + 1;
      ending_cell = this.day_cells[real_ending_cell_index];
      var diffInMs = new Date(ending_cell.value) - new Date(starting_cell.value);
      var diffInHrs = Math.floor(diffInMs % 86400000 / 3600000);
      var diffMins = Math.round(diffInMs % 86400000 % 3600000 / 60000);
      var startDate = new Date(starting_cell.value);
      var endDate = new Date(ending_cell.value);
      var distance = diffMins + diffInHrs * (this.kalendar_options.hourlySelection ? 10 : 60);
      this.temporary_event = {
        start: {
          masked_value: startDate.toISOString(),
          value: startDate.toISOString(),
          rounded: false,
          round_offset: null
        },
        end: {
          masked_value: endDate.toISOString(),
          value: endDate.toISOString(),
          rounded: false,
          round_offset: null
        },
        distance: distance,
        status: "creating"
      };
    },
    initiatePopup: function initiatePopup() {
      if (this.creating && this.creator.status !== "creating") return;
      this.creator = _objectSpread2(_objectSpread2({}, this.creator), {}, {
        status: "popup-initiated",
        creating: false
      });
      var _this$creator2 = this.creator,
        ending_cell = _this$creator2.ending_cell,
        current_cell = _this$creator2.current_cell,
        starting_cell = _this$creator2.starting_cell,
        original_starting_cell = _this$creator2.original_starting_cell;
      var real_ending_cell_index = ending_cell.index + 1;
      ending_cell = this.day_cells[real_ending_cell_index];
      var diffInMs = new Date(ending_cell.value) - new Date(starting_cell.value);
      var diffInHrs = Math.floor(diffInMs % 86400000 / 3600000);
      var diffMins = Math.round(diffInMs % 86400000 % 3600000 / 60000);
      var startDate = new Date(starting_cell.value);
      var endDate = new Date(ending_cell.value);
      var finalEvent = {
        start: {
          masked_value: startDate.toISOString(),
          value: startDate.toISOString(),
          rounded: false,
          round_offset: null
        },
        end: {
          masked_value: endDate.toISOString(),
          value: endDate.toISOString(),
          rounded: false,
          round_offset: null
        },
        distance: diffMins + diffInHrs * (this.kalendar_options.hourlySelection ? 10 : 60),
        status: "popup-initiated"
      };
      var updated_events = this.day_events[starting_cell.value];
      if (!updated_events) updated_events = [];
      updated_events.push(finalEvent);
      this.$set(this.day_events, starting_cell.value, updated_events);
      this.temporary_event = null;
    },
    overlapPolice: function overlapPolice(payload) {
      var _this4 = this;
      if (!payload.current_cell) return;
      var overlapped = Object.keys(this.day_events).map(function (evKey) {
        return _this4.day_events[evKey];
      }).flat().filter(function (event) {
        var cellStart = new Date(payload.starting_cell.value);
        var cellEnd = new Date(payload.ending_cell.value);
        var eventStarts = new Date(event.start.value);
        var eventEnds = new Date(event.end.value);
        return cellEnd > eventStarts && cellEnd < eventEnds || cellStart < eventStarts && cellEnd > eventStarts;
      });
      if (!overlapped || overlapped.length === 0) {
        return;
      }
      var newPayload = payload;
      if (payload.direction === "reverse") {
        var needed_cell = overlapped[0].end;
        var event_cell = this.day_cells.find(function (c) {
          return c.value === needed_cell.masked_value;
        });
        var cell = this.day_cells[event_cell.index];
        newPayload.starting_cell = {
          value: cell.value,
          index: cell.index
        };
        newPayload.current_cell = {
          value: cell.value,
          index: cell.index
        };
      } else {
        var _needed_cell = overlapped[0].start;
        var _event_cell = this.day_cells.find(function (c) {
          return c.value === _needed_cell.masked_value;
        });
        var _cell = this.day_cells[_event_cell.index - 1];
        newPayload.ending_cell = {
          value: _cell.value,
          index: _cell.index
        };
      }
      return newPayload;
    },
    scrollView: function scrollView() {
      var topoffset = this.$refs.nowIndicator.offsetTop;
      setTimeout(function () {
        window.scroll({
          top: topoffset,
          left: 0,
          behavior: "smooth"
        });
      }, 500);
    }
  }
};

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c('ul', {
    ref: _vm.day.value + '-reference',
    staticClass: "kalendar-day",
    class: {
      'is-weekend': _vm.isWeekend,
      'is-today': _vm.isToday,
      creating: _vm.creator.creating || _vm.creator.status === 'popup-initiated'
    },
    staticStyle: {
      "position": "relative"
    }
  }, [_vm.isToday && _vm.passedTime ? _c('div', {
    ref: "nowIndicator",
    class: _vm.kalendar_options.style === 'material_design' ? 'hour-indicator-line' : 'hour-indicator-tooltip',
    style: "top:" + _vm.passedTime + "px"
  }, [_c('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.kalendar_options.style === 'material_design',
      expression: "kalendar_options.style === 'material_design'"
    }],
    staticClass: "line"
  })]) : _vm._e(), _vm._v(" "), _vm._l(_vm.day_cells, function (cell, index) {
    return _c('kalendar-cell', {
      key: "cell-" + index,
      attrs: {
        "constructed-events": _vm.day_events,
        "creator": _vm.creator,
        "cell-data": cell,
        "index": index,
        "temporary-event": _vm.temporary_event
      },
      on: {
        "select": _vm.updateCreator,
        "reset": function reset($event) {
          return _vm.resetEvents();
        },
        "initiatePopup": function initiatePopup($event) {
          return _vm.initiatePopup();
        }
      }
    });
  })], 2);
};
var __vue_staticRenderFns__ = [];

/* style */
var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-f46e040c_0", {
    source: "ul.kalendar-day{position:relative;background-color:#fff}ul.kalendar-day.is-weekend{background-color:var(--weekend-color)}ul.kalendar-day.is-today{background-color:var(--current-day-color)}ul.kalendar-day .clear{position:absolute;z-index:1;top:-20px;right:0;font-size:10px}ul.kalendar-day.creating{z-index:11}ul.kalendar-day.creating .created-event{pointer-events:none}",
    map: undefined,
    media: undefined
  });
};
/* scoped */
var __vue_scope_id__ = undefined;
/* module identifier */
var __vue_module_identifier__ = undefined;
/* functional template */
var __vue_is_functional_template__ = false;
/* style inject SSR */

/* style inject shadow dom */

var __vue_component__ = /*#__PURE__*/__vue_normalize__({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, __vue_create_injector__, undefined, undefined);

//
var script$1 = {
  props: {
    current_day: {
      required: true,
      type: String,
      validator: function validator(d) {
        return !isNaN(Date.parse(d));
      }
    }
  },
  components: {
    KalendarDays: __vue_component__
  },
  created: function created() {
    var _this = this;
    this.addHelperMethods();
    setInterval(function () {
      return _this.kalendar_options.now = new Date();
    }, 1000 * 60);
    this.constructWeek();
  },
  inject: ['kalendar_options', 'kalendar_events'],
  data: function data() {
    return {
      hours: null,
      days: []
    };
  },
  computed: {
    hoursVisible: function hoursVisible() {
      if (!this.hours) return [];
      return this.hours.filter(function (x) {
        return !!x.visible;
      });
    },
    colsSpace: function colsSpace() {
      return this.kalendar_options.style === 'flat_design' ? '5px' : '0px';
    },
    hourHeight: function hourHeight() {
      return (this.kalendar_options.hourlySelection ? 1 : 6) * this.kalendar_options.cell_height;
      //this.kalendar_options.cell_height * (60 / this.kalendar_options.split_value);
      // * this.kalendar_options.hour_parts;
    },
    passedTime: function passedTime() {
      var _this$kalendar_option = this.kalendar_options,
        day_starts_at = _this$kalendar_option.day_starts_at,
        day_ends_at = _this$kalendar_option.day_ends_at,
        now = _this$kalendar_option.now,
        cell_height = _this$kalendar_option.cell_height;
      var time = getLocaleTime(now);
      var day_starts = "".concat(time.split('T')[0], "T").concat((day_starts_at + '').padStart(2, '0'), ":00:00.000Z");
      var day_ends = "".concat(time.split('T')[0], "T").concat((day_ends_at + '').padStart(2, '0'), ":00:00.000Z");
      var time_obj = new Date(time);
      if (new Date(day_ends) < time_obj || time_obj < new Date(day_starts)) return null;
      var distance = (time_obj - new Date(day_starts)) / 1000 / 60 / 10 * cell_height;
      return {
        distance: distance,
        time: time
      };
    }
  },
  methods: {
    _isToday: function _isToday(day) {
      return isToday(day);
    },
    updateAppointments: function updateAppointments(_ref) {
      var id = _ref.id,
        data = _ref.data;
      this.$emit('update', {
        id: id,
        data: data
      });
    },
    deleteAppointment: function deleteAppointment(id) {
      this.$emit('delete', {
        id: id
      });
    },
    clearAppointments: function clearAppointments() {
      this.$emit('clear');
    },
    isDayBefore: function isDayBefore(day) {
      var now = new Date(this.kalendar_options.now);
      var formattedNow = getLocaleTime(now.toISOString());
      return isBefore(day, getHourlessDate(formattedNow));
    },
    constructWeek: function constructWeek() {
      var _this2 = this;
      var date = this.current_day.slice(0, 10);
      var _this$kalendar_option2 = this.kalendar_options,
        hide_dates = _this$kalendar_option2.hide_dates,
        hide_days = _this$kalendar_option2.hide_days,
        view_type = _this$kalendar_option2.view_type;
      return Promise.all([myWorker.send('getDays', {
        day: date,
        options: {
          hide_dates: hide_dates,
          hide_days: hide_days,
          view_type: view_type
        }
      }).then(function (reply) {
        _this2.days = reply; //.slice(0,1);
      }), myWorker.send('getHours', {
        hourOptions: {
          start_hour: this.kalendar_options.day_starts_at,
          end_hour: this.kalendar_options.day_ends_at
        }
      }).then(function (reply) {
        // Handle the reply
        _this2.hours = reply;
      })]);
    },
    addHelperMethods: function addHelperMethods() {
      var _this3 = this;
      this.$kalendar.buildWeek = function () {
        return _this3.constructWeek();
      }, this.$kalendar.getVisibleDays = function () {
        return _this3.days;
      };
      this.$kalendar.addNewEvent = function (payload) {
        if (!payload) return Promise.reject('No payload');
        var from = payload.from,
          to = payload.to;
        if (from.slice(-4) === '000Z') payload.from = addTimezoneInfo(from);
        if (to.slice(-4) === '000Z') payload.to = addTimezoneInfo(to);
        var targetRef = payload.from.slice(0, 10);
        var refObject = _this3.$refs[targetRef];
        if (refObject && refObject[0]) {
          refObject[0].addEvent(payload);
        } else {
          // appointment is not in this view
          var events = _this3.$kalendar.getEvents();
          events.push(payload);
          _this3.$kalendar.updateEvents(events);
        }
      };
      this.$kalendar.removeEvent = function (options) {
        var day = options.day,
          key = options.key,
          id = options.id;
        if (day.length > 10) {
          day = day.slice(0, 10);
        }
        if (!day) return Promise.reject("Day wasn't provided");
        if (!id) return Promise.reject('No ID was provided');
        if (!key) return Promise.reject('No key was provided in the object');
        var targetRef = day;
        _this3.$refs[targetRef][0].removeEvent({
          id: id,
          key: key
        });
      };
      this.$kalendar.closePopups = function () {
        var refs = _this3.days.map(function (day) {
          return day.value.slice(0, 10);
        });
        refs.forEach(function (ref) {
          _this3.$refs[ref][0].clearCreatingLeftovers();
        });
      };
    }
  }
};

/* script */
var __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c('div', {
    staticClass: "calendar-wrap",
    style: "--space-between-cols: " + _vm.colsSpace
  }, [_c('div', {
    staticClass: "sticky-top"
  }, [_c('ul', {
    staticClass: "days"
  }, _vm._l(_vm.days || [], function (ref, index) {
    var value = ref.value;
    return _c('li', {
      key: index,
      staticClass: "day-indicator",
      class: {
        today: _vm._isToday(value),
        'is-before': _vm.isDayBefore(value)
      }
    }, [_c('div', [_c('span', {
      staticClass: "letters-date"
    }, [_vm._v("\n                        " + _vm._s(_vm.kalendar_options.formatDayTitle(value)[0]) + "\n                    ")]), _vm._v(" "), _c('span', {
      staticClass: "number-date"
    }, [_vm._v("\n                        " + _vm._s(_vm.kalendar_options.formatDayTitle(value)[1]) + "\n                    ")])])]);
  }), 0), _vm._v(" "), _c('ul', {
    staticClass: "all-day"
  }, [_c('span', [_vm._v("All Day")]), _vm._v(" "), _vm._l(_vm.days || [], function (date, index) {
    return _c('li', {
      key: index,
      class: {
        'all-today': _vm._isToday(date.value),
        'is-all-day': false
      },
      style: "height:" + (_vm.kalendar_options.cell_height + 5) + "px"
    });
  })], 2)]), _vm._v(" "),  _vm._e(), _vm._v(" "), _vm.hours ? _c('div', {
    staticClass: "blocks"
  }, [_c('div', {
    staticClass: "calendar-blocks"
  }, [_c('ul', {
    staticClass: "hours"
  }, _vm._l(_vm.hoursVisible, function (hour, index) {
    return _c('li', {
      key: index,
      staticClass: "hour-row-identifier",
      style: "height:" + _vm.hourHeight + "px"
    }, [_c('span', [_vm._v("\n                        " + _vm._s(_vm.kalendar_options.formatLeftHours(hour.value)) + "\n                    ")])]);
  }), 0), _vm._v(" "), _vm.passedTime ? _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.kalendar_options.style !== 'material_design',
      expression: "kalendar_options.style !== 'material_design'"
    }],
    staticClass: "hour-indicator-line",
    style: "top:" + _vm.passedTime.distance + "px"
  }, [_c('span', {
    staticClass: "time-value"
  }, [_vm._v(_vm._s(_vm.passedTime.value))]), _vm._v(" "), _c('span', {
    staticClass: "line"
  })]) : _vm._e(), _vm._v(" "), _vm._l(_vm.days, function (day, index) {
    return _c('kalendar-days', {
      key: day.value.slice(0, 10),
      ref: day.value.slice(0, 10),
      refInFor: true,
      staticClass: "building-blocks",
      class: "day-" + (index + 1),
      attrs: {
        "day": day,
        "passed-time": _vm.passedTime ? _vm.passedTime.distance : false
      }
    });
  })], 2)]) : _vm._e()]);
};
var __vue_staticRenderFns__$1 = [];

/* style */
var __vue_inject_styles__$1 = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-25676f85_0", {
    source: ".calendar-wrap{display:flex;flex-direction:column}.calendar-wrap ul{list-style:none;padding:0}.calendar-wrap ul>li{display:flex}.sticky-top{position:sticky;top:0;z-index:20;background-color:#fff}.sticky-top .days{margin:0;display:flex;margin-left:55px}.sticky-top .days li{display:inline-flex;align-items:flex-end;padding-top:10px;flex:1;font-size:1.1rem;color:#666;font-weight:300;margin-right:var(--space-between-cols);border-bottom:solid 1px #e5e5e5;padding-bottom:5px;position:relative;font-size:18px}.sticky-top .days li span{margin-right:3px}.sticky-top .days li span:first-child{font-size:20px;font-weight:500}.sticky-top .days .today{border-bottom-color:var(--main-color);color:var(--main-color)!important}.sticky-top .days .today::after{content:\"\";position:absolute;height:2px;bottom:0;left:0;width:100%;background-color:var(--main-color)}.sticky-top .all-day{display:flex;margin-bottom:0;margin-top:0;border-bottom:solid 2px #e5e5e5}.sticky-top .all-day span{display:flex;align-items:center;padding:0 5px;width:55px;font-weight:500;font-size:.8rem;color:#b8bbca;text-transform:lowercase}.sticky-top .all-day li{flex:1;margin-right:var(--space-between-cols)}.sticky-top .all-day li.all-today{background-color:#fef4f4}.dummy-row{display:flex;padding-left:55px}.dummy-row ul{display:flex;flex:1;margin:0}.dummy-row li{flex:1;height:15px;margin-right:var(--space-between-cols);border-bottom:solid 1px #e5e5e5}.blocks{display:flex;position:relative;height:100%}.blocks ul{margin-top:0}.blocks .building-blocks{flex:1;margin-right:var(--space-between-cols);margin-bottom:0;display:flex;flex-direction:column}.blocks .calendar-blocks{width:100%;display:flex;position:relative}.hours{display:flex;flex-direction:column;color:#b8bbca;font-weight:500;font-size:.85rem;width:55px;height:100%;margin-bottom:0}.hours li{color:var(--hour-row-color);border-bottom:solid 1px transparent;padding-left:8px}.hours li span{margin-top:-8px}.hours li:first-child span{visibility:hidden}",
    map: undefined,
    media: undefined
  });
};
/* scoped */
var __vue_scope_id__$1 = undefined;
/* module identifier */
var __vue_module_identifier__$1 = undefined;
/* functional template */
var __vue_is_functional_template__$1 = false;
/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$1 = /*#__PURE__*/__vue_normalize__({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, __vue_create_injector__, undefined, undefined);

export default __vue_component__$1;
