(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../utils/soap/soap", "../Attachment/Attachment", "../Icon/Icon"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../utils/soap/soap"), require("../Attachment/Attachment"), require("../Icon/Icon"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.soap, global.Attachment, global.Icon);
    global.Message = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _soap, _Attachment, _Icon) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _soap = _interopRequireDefault(_soap);
  _Attachment = _interopRequireDefault(_Attachment);
  _Icon = _interopRequireDefault(_Icon);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /**
   * Message class
   * This is only returned as an array in `Client.messages()` method
   * @constructor
   * @extends {soap.Client}
   */
  class Message extends _soap.default.Client {
    constructor(xmlObject, credentials, hostUrl) {
      super(credentials);
      /**
       * The URL to create POST fetch requests to synergy servers
       * @type {string}
       * @private
       * @readonly
       */

      this.hostUrl = hostUrl;
      /**
       * The message icon
       * @type {Icon}
       * @public
       * @readonly
       */

      this.icon = new _Icon.default(xmlObject['@_IconURL'][0], this.hostUrl);
      /**
       * The ID of the message
       * @type {string}
       * @public
       * @readonly
       */

      this.id = xmlObject['@_ID'][0];
      /**
       * The type of the message
       * @type {string}
       * @public
       * @readonly
       */

      this.type = xmlObject['@_Type'][0];
      /**
       * The date when the message was first posted
       * @type {Date}
       * @public
       * @readonly
       */

      this.beginDate = new Date(xmlObject['@_BeginDate'][0]);
      /**
       * The HTML content of the message
       * @type {string}
       * @public
       * @readonly
       */

      this.htmlContent = unescape(xmlObject['@_Content'][0]);
      /**
       * Whether the message has been read or not
       * @type {boolean}
       * @private
       */

      this.read = JSON.parse(xmlObject['@_Read'][0]);
      /**
       * Whether the message is deletable or not
       * @type {boolean}
       * @private
       */

      this.deletable = JSON.parse(xmlObject['@_Deletable'][0]);
      /**
       * The sender of the message
       * @public
       * @readonly
       * @type {object}
       * @property {string} name - The name of the sender
       * @property {string} staffGu - the staffGu of the sender
       * @property {string} email - The email of the sender
       * @property {string} smMsgPersonGu - The smMsgPersonGu of the sender. Don't know if this property has a real usage or not
       */

      this.from = {
        name: xmlObject['@_From'][0],
        staffGu: xmlObject['@_StaffGU'][0],
        smMsgPersonGu: xmlObject['@_SMMsgPersonGU'][0],
        email: xmlObject['@_Email'][0]
      };
      /**
       * The module of the sender
       * @type {string}
       * @public
       * @readonly
       */

      this.module = xmlObject['@_Module'][0];
      /**
       * The subject of the message
       * @public
       * @readonly
       * @type {object}
       * @property {string} html - The subject of the message with HTML
       * @property {string} raw - The subject of the message without HTML and formatting
       */

      this.subject = {
        html: xmlObject['@_Subject'][0],
        raw: xmlObject['@_SubjectNoHTML'][0]
      };
      /**
       * The attachments included in the message, if there are any.
       * @type {Attachment[]}
       * @public
       * @readonly
       */

      this.attachments = typeof xmlObject.AttachmentDatas[0] !== 'string' ? xmlObject.AttachmentDatas[0].AttachmentData.map(data => {
        return new _Attachment.default(data['@_AttachmentName'][0], data['@_SmAttachmentGU'][0], credentials);
      }) : [];
    }
    /**
     * Check if a message has been read
     * @returns {boolean} Returns a boolean declaring whether or not the message has been previously read
     */


    isRead() {
      return this.read;
    }
    /**
     * Check if a message is deletable
     * @returns {boolean} Returns a boolean declaring whether or not the message is deletable
     */


    isDeletable() {
      return this.deletable;
    }

    setRead(read) {
      this.read = read;
    }

    setDeletable(deletable) {
      this.deletable = deletable;
    }
    /**
     * Marks the message as read
     * @returns {true} Returns true to show that it has been marked as read
     * @description
     * ```js
     * const messages = await client.messages();
     * messages.every((msg) => msg.isRead()) // -> false
     * messages.forEach(async (msg) => !msg.isRead() && await msg.markAsRead());
     * messages.every((msg) => msg.isRead()) // -> true
     * const refetchedMessages = await client.messages(); // See if it updated on the server
     * messages.every((msg) => msg.isRead()) // -> true
     * ```
     * @description
     * ```tsx
     * // In a React project...
     * import React from 'react';
     *
     * const Message = (props) => {
     *  const { message } = props;
     *
     *  async function handleOnClick() {
     *    await message.markAsRead();
     *  }
     *
     *  return (
     *    <button onClick={handleOnClick} style={{ color: message.isRead() ? undefined : 'red' }}>
     *      <p>{message.subject.raw}</p>
     *    </button>
     *  )
     * }
     *
     * export default Message;
     * ```
     */


    markAsRead() {
      return new Promise((res, rej) => {
        if (this.read) {
          return res(true);
        }

        super.processRequest({
          methodName: 'UpdatePXPMessage',
          paramStr: {
            childIntId: 0,
            MessageListing: {
              '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
              '@_xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
              '@_ID': this.id,
              '@_Type': this.type,
              '@_MarkAsRead': 'true'
            }
          }
        }).then(() => {
          this.setRead(true);
          res(true);
        }).catch(rej);
      });
    }

  }

  _exports.default = Message;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL01lc3NhZ2UvTWVzc2FnZS50cyJdLCJuYW1lcyI6WyJNZXNzYWdlIiwic29hcCIsIkNsaWVudCIsImNvbnN0cnVjdG9yIiwieG1sT2JqZWN0IiwiY3JlZGVudGlhbHMiLCJob3N0VXJsIiwiaWNvbiIsIkljb24iLCJpZCIsInR5cGUiLCJiZWdpbkRhdGUiLCJEYXRlIiwiaHRtbENvbnRlbnQiLCJ1bmVzY2FwZSIsInJlYWQiLCJKU09OIiwicGFyc2UiLCJkZWxldGFibGUiLCJmcm9tIiwibmFtZSIsInN0YWZmR3UiLCJzbU1zZ1BlcnNvbkd1IiwiZW1haWwiLCJtb2R1bGUiLCJzdWJqZWN0IiwiaHRtbCIsInJhdyIsImF0dGFjaG1lbnRzIiwiQXR0YWNobWVudERhdGFzIiwiQXR0YWNobWVudERhdGEiLCJtYXAiLCJkYXRhIiwiQXR0YWNobWVudCIsImlzUmVhZCIsImlzRGVsZXRhYmxlIiwic2V0UmVhZCIsInNldERlbGV0YWJsZSIsIm1hcmtBc1JlYWQiLCJQcm9taXNlIiwicmVzIiwicmVqIiwicHJvY2Vzc1JlcXVlc3QiLCJtZXRob2ROYW1lIiwicGFyYW1TdHIiLCJjaGlsZEludElkIiwiTWVzc2FnZUxpc3RpbmciLCJ0aGVuIiwiY2F0Y2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDZSxRQUFNQSxPQUFOLFNBQXNCQyxjQUFLQyxNQUEzQixDQUFrQztBQWlDL0NDLElBQUFBLFdBQVcsQ0FDVEMsU0FEUyxFQUVUQyxXQUZTLEVBR1RDLE9BSFMsRUFJVDtBQUNBLFlBQU1ELFdBQU47QUFDQTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0ksV0FBS0MsT0FBTCxHQUFlQSxPQUFmO0FBQ0E7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNJLFdBQUtDLElBQUwsR0FBWSxJQUFJQyxhQUFKLENBQVNKLFNBQVMsQ0FB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SUFBRCxFQUFnQjtBQUM3QixXQUFLQSxJQUFMLEdBQVlBLElBQVo7QUFDRDs7QUFFT3NCLElBQUFBLFlBQVksQ0FBQ25CLFNBQUQsRUFBcUI7QUFDdkMsV0FBS0EsU0FBTCxHQUFpQkEsU0FBakI7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDU29CLElBQUFBLFVBQVUsR0FBa0I7QUFDakMsYUFBTyxJQUFJQyxPQUFKLENBQWtCLENBQUNDLEdBQUQsRUFBTUMsR0FBTixLQUFjO0FBQ3JDLFlBQUksS0FBSzFCLElBQVQ7QUFBZSxpQkFBT3lCLEdBQUcsQ0FBQyxJQUFELENBQVY7QUFBZjs7QUFDQSxjQUNHRSxjQURILENBQ2tCO0FBQ2RDLFVBQUFBLFVBQVUsRUFBRSxrQkFERTtBQUVkQyxVQUFBQSxRQUFRLEVBQUU7QUFDUkMsWUFBQUEsVUFBVSxFQUFFLENBREo7QUFFUkMsWUFBQUEsY0FBYyxFQUFFO0FBQ2QsNkJBQWUsMkNBREQ7QUFFZCw2QkFBZSxrQ0FGRDtBQUdkLHNCQUFRLEtBQUtyQyxFQUhDO0FBSWQsd0JBQVUsS0FBS0MsSUFKRDtBQUtkLDhCQUFnQjtBQUxGO0FBRlI7QUFGSSxTQURsQixFQWNHcUMsSUFkSCxDQWNRLE1BQU07QUFDVixlQUFLWCxPQUFMLENBQWEsSUFBYjtBQUNBSSxVQUFBQSxHQUFHLENBQUMsSUFBRCxDQUFIO0FBQ0QsU0FqQkgsRUFrQkdRLEtBbEJILENBa0JTUCxHQWxCVDtBQW1CRCxPQXJCTSxDQUFQO0FBc0JEOztBQS9OOEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMb2dpbkNyZWRlbnRpYWxzIH0gZnJvbSAnLi4vLi4vdXRpbHMvc29hcC9DbGllbnQvQ2xpZW50LmludGVyZmFjZXMnO1xuaW1wb3J0IHNvYXAgZnJvbSAnLi4vLi4vdXRpbHMvc29hcC9zb2FwJztcbmltcG9ydCBBdHRhY2htZW50IGZyb20gJy4uL0F0dGFjaG1lbnQvQXR0YWNobWVudCc7XG5pbXBvcnQgeyBNZXNzYWdlWE1MT2JqZWN0IH0gZnJvbSAnLi9NZXNzYWdlLnhtbCc7XG5pbXBvcnQgSWNvbiBmcm9tICcuLi9JY29uL0ljb24nO1xuXG4vKipcbiAqIE1lc3NhZ2UgY2xhc3NcbiAqIFRoaXMgaXMgb25seSByZXR1cm5lZCBhcyBhbiBhcnJheSBpbiBgQ2xpZW50Lm1lc3NhZ2VzKClgIG1ldGhvZFxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyB7c29hcC5DbGllbnR9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lc3NhZ2UgZXh0ZW5kcyBzb2FwLkNsaWVudCB7XG4gIHByaXZhdGUgcmVhZG9ubHkgaG9zdFVybDogc3RyaW5nO1xuXG4gIHB1YmxpYyByZWFkb25seSBpY29uOiBJY29uO1xuXG4gIHB1YmxpYyByZWFkb25seSBpZDogc3RyaW5nO1xuXG4gIHB1YmxpYyByZWFkb25seSBiZWdpbkRhdGU6IERhdGU7XG5cbiAgcHVibGljIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcblxuICBwdWJsaWMgcmVhZG9ubHkgaHRtbENvbnRlbnQ6IHN0cmluZztcblxuICBwcml2YXRlIHJlYWQ6IGJvb2xlYW47XG5cbiAgcHJpdmF0ZSBkZWxldGFibGU6IGJvb2xlYW47XG5cbiAgcHVibGljIHJlYWRvbmx5IGZyb206IHtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgc3RhZmZHdTogc3RyaW5nO1xuICAgIGVtYWlsOiBzdHJpbmc7XG4gICAgc21Nc2dQZXJzb25HdTogc3RyaW5nO1xuICB9O1xuXG4gIHB1YmxpYyByZWFkb25seSBtb2R1bGU6IHN0cmluZztcblxuICBwdWJsaWMgcmVhZG9ubHkgc3ViamVjdDoge1xuICAgIGh0bWw6IHN0cmluZztcbiAgICByYXc6IHN0cmluZztcbiAgfTtcblxuICBwdWJsaWMgcmVhZG9ubHkgYXR0YWNobWVudHM6IEF0dGFjaG1lbnRbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICB4bWxPYmplY3Q6IE1lc3NhZ2VYTUxPYmplY3RbJ1BYUE1lc3NhZ2VzRGF0YSddWzBdWydNZXNzYWdlTGlzdGluZ3MnXVswXVsnTWVzc2FnZUxpc3RpbmcnXVswXSxcbiAgICBjcmVkZW50aWFsczogTG9naW5DcmVkZW50aWFscyxcbiAgICBob3N0VXJsOiBzdHJpbmdcbiAgKSB7XG4gICAgc3VwZXIoY3JlZGVudGlhbHMpO1xuICAgIC8qKlxuICAgICAqIFRoZSBVUkwgdG8gY3JlYXRlIFBPU1QgZmV0Y2ggcmVxdWVzdHMgdG8gc3luZXJneSBzZXJ2ZXJzXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHRoaXMuaG9zdFVybCA9IGhvc3RVcmw7XG4gICAgLyoqXG4gICAgICogVGhlIG1lc3NhZ2UgaWNvblxuICAgICAqIEB0eXBlIHtJY29ufVxuICAgICAqIEBwdWJsaWNcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB0aGlzLmljb24gPSBuZXcgSWNvbih4bWxPYmplY3RbJ0BfSWNvblVSTCddWzBdLCB0aGlzLmhvc3RVcmwpO1xuICAgIC8qKlxuICAgICAqIFRoZSBJRCBvZiB0aGUgbWVzc2FnZVxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICogQHB1YmxpY1xuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHRoaXMuaWQgPSB4bWxPYmplY3RbJ0BfSUQnXVswXTtcbiAgICAvKipcbiAgICAgKiBUaGUgdHlwZSBvZiB0aGUgbWVzc2FnZVxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICogQHB1YmxpY1xuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHRoaXMudHlwZSA9IHhtbE9iamVjdFsnQF9UeXBlJ11bMF07XG4gICAgLyoqXG4gICAgICogVGhlIGRhdGUgd2hlbiB0aGUgbWVzc2FnZSB3YXMgZmlyc3QgcG9zdGVkXG4gICAgICogQHR5cGUge0RhdGV9XG4gICAgICogQHB1YmxpY1xuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHRoaXMuYmVnaW5EYXRlID0gbmV3IERhdGUoeG1sT2JqZWN0WydAX0JlZ2luRGF0ZSddWzBdKTtcbiAgICAvKipcbiAgICAgKiBUaGUgSFRNTCBjb250ZW50IG9mIHRoZSBtZXNzYWdlXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKiBAcHVibGljXG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgdGhpcy5odG1sQ29udGVudCA9IHVuZXNjYXBlKHhtbE9iamVjdFsnQF9Db250ZW50J11bMF0pO1xuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdGhlIG1lc3NhZ2UgaGFzIGJlZW4gcmVhZCBvciBub3RcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMucmVhZCA9IEpTT04ucGFyc2UoeG1sT2JqZWN0WydAX1JlYWQnXVswXSk7XG4gICAgLyoqXG4gICAgICogV2hldGhlciB0aGUgbWVzc2FnZSBpcyBkZWxldGFibGUgb3Igbm90XG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmRlbGV0YWJsZSA9IEpTT04ucGFyc2UoeG1sT2JqZWN0WydAX0RlbGV0YWJsZSddWzBdKTtcbiAgICAvKipcbiAgICAgKiBUaGUgc2VuZGVyIG9mIHRoZSBtZXNzYWdlXG4gICAgICogQHB1YmxpY1xuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgc2VuZGVyXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IHN0YWZmR3UgLSB0aGUgc3RhZmZHdSBvZiB0aGUgc2VuZGVyXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IGVtYWlsIC0gVGhlIGVtYWlsIG9mIHRoZSBzZW5kZXJcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gc21Nc2dQZXJzb25HdSAtIFRoZSBzbU1zZ1BlcnNvbkd1IG9mIHRoZSBzZW5kZXIuIERvbid0IGtub3cgaWYgdGhpcyBwcm9wZXJ0eSBoYXMgYSByZWFsIHVzYWdlIG9yIG5vdFxuICAgICAqL1xuICAgIHRoaXMuZnJvbSA9IHtcbiAgICAgIG5hbWU6IHhtbE9iamVjdFsnQF9Gcm9tJ11bMF0sXG4gICAgICBzdGFmZkd1OiB4bWxPYmplY3RbJ0BfU3RhZmZHVSddWzBdLFxuICAgICAgc21Nc2dQZXJzb25HdTogeG1sT2JqZWN0WydAX1NNTXNnUGVyc29uR1UnXVswXSxcbiAgICAgIGVtYWlsOiB4bWxPYmplY3RbJ0BfRW1haWwnXVswXSxcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFRoZSBtb2R1bGUgb2YgdGhlIHNlbmRlclxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICogQHB1YmxpY1xuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHRoaXMubW9kdWxlID0geG1sT2JqZWN0WydAX01vZHVsZSddWzBdO1xuICAgIC8qKlxuICAgICAqIFRoZSBzdWJqZWN0IG9mIHRoZSBtZXNzYWdlXG4gICAgICogQHB1YmxpY1xuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IGh0bWwgLSBUaGUgc3ViamVjdCBvZiB0aGUgbWVzc2FnZSB3aXRoIEhUTUxcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gcmF3IC0gVGhlIHN1YmplY3Qgb2YgdGhlIG1lc3NhZ2Ugd2l0aG91dCBIVE1MIGFuZCBmb3JtYXR0aW5nXG4gICAgICovXG4gICAgdGhpcy5zdWJqZWN0ID0ge1xuICAgICAgaHRtbDogeG1sT2JqZWN0WydAX1N1YmplY3QnXVswXSxcbiAgICAgIHJhdzogeG1sT2JqZWN0WydAX1N1YmplY3ROb0hUTUwnXVswXSxcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFRoZSBhdHRhY2htZW50cyBpbmNsdWRlZCBpbiB0aGUgbWVzc2FnZSwgaWYgdGhlcmUgYXJlIGFueS5cbiAgICAgKiBAdHlwZSB7QXR0YWNobWVudFtdfVxuICAgICAqIEBwdWJsaWNcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB0aGlzLmF0dGFjaG1lbnRzID1cbiAgICAgIHR5cGVvZiB4bWxPYmplY3QuQXR0YWNobWVudERhdGFzWzBdICE9PSAnc3RyaW5nJ1xuICAgICAgICA/IHhtbE9iamVjdC5BdHRhY2htZW50RGF0YXNbMF0uQXR0YWNobWVudERhdGEubWFwKFxuICAgICAgICAgICAgKGRhdGEpID0+IG5ldyBBdHRhY2htZW50KGRhdGFbJ0BfQXR0YWNobWVudE5hbWUnXVswXSwgZGF0YVsnQF9TbUF0dGFjaG1lbnRHVSddWzBdLCBjcmVkZW50aWFscylcbiAgICAgICAgICApXG4gICAgICAgIDogW107XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYSBtZXNzYWdlIGhhcyBiZWVuIHJlYWRcbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYSBib29sZWFuIGRlY2xhcmluZyB3aGV0aGVyIG9yIG5vdCB0aGUgbWVzc2FnZSBoYXMgYmVlbiBwcmV2aW91c2x5IHJlYWRcbiAgICovXG4gIHB1YmxpYyBpc1JlYWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucmVhZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBhIG1lc3NhZ2UgaXMgZGVsZXRhYmxlXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGEgYm9vbGVhbiBkZWNsYXJpbmcgd2hldGhlciBvciBub3QgdGhlIG1lc3NhZ2UgaXMgZGVsZXRhYmxlXG4gICAqL1xuICBwdWJsaWMgaXNEZWxldGFibGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZGVsZXRhYmxlO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRSZWFkKHJlYWQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLnJlYWQgPSByZWFkO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXREZWxldGFibGUoZGVsZXRhYmxlOiBib29sZWFuKSB7XG4gICAgdGhpcy5kZWxldGFibGUgPSBkZWxldGFibGU7XG4gIH1cblxuICAvKipcbiAgICogTWFya3MgdGhlIG1lc3NhZ2UgYXMgcmVhZFxuICAgKiBAcmV0dXJucyB7dHJ1ZX0gUmV0dXJucyB0cnVlIHRvIHNob3cgdGhhdCBpdCBoYXMgYmVlbiBtYXJrZWQgYXMgcmVhZFxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogYGBganNcbiAgICogY29uc3QgbWVzc2FnZXMgPSBhd2FpdCBjbGllbnQubWVzc2FnZXMoKTtcbiAgICogbWVzc2FnZXMuZXZlcnkoKG1zZykgPT4gbXNnLmlzUmVhZCgpKSAvLyAtPiBmYWxzZVxuICAgKiBtZXNzYWdlcy5mb3JFYWNoKGFzeW5jIChtc2cpID0+ICFtc2cuaXNSZWFkKCkgJiYgYXdhaXQgbXNnLm1hcmtBc1JlYWQoKSk7XG4gICAqIG1lc3NhZ2VzLmV2ZXJ5KChtc2cpID0+IG1zZy5pc1JlYWQoKSkgLy8gLT4gdHJ1ZVxuICAgKiBjb25zdCByZWZldGNoZWRNZXNzYWdlcyA9IGF3YWl0IGNsaWVudC5tZXNzYWdlcygpOyAvLyBTZWUgaWYgaXQgdXBkYXRlZCBvbiB0aGUgc2VydmVyXG4gICAqIG1lc3NhZ2VzLmV2ZXJ5KChtc2cpID0+IG1zZy5pc1JlYWQoKSkgLy8gLT4gdHJ1ZVxuICAgKiBgYGBcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIGBgYHRzeFxuICAgKiAvLyBJbiBhIFJlYWN0IHByb2plY3QuLi5cbiAgICogaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbiAgICpcbiAgICogY29uc3QgTWVzc2FnZSA9IChwcm9wcykgPT4ge1xuICAgKiAgY29uc3QgeyBtZXNzYWdlIH0gPSBwcm9wcztcbiAgICpcbiAgICogIGFzeW5jIGZ1bmN0aW9uIGhhbmRsZU9uQ2xpY2soKSB7XG4gICAqICAgIGF3YWl0IG1lc3NhZ2UubWFya0FzUmVhZCgpO1xuICAgKiAgfVxuICAgKlxuICAgKiAgcmV0dXJuIChcbiAgICogICAgPGJ1dHRvbiBvbkNsaWNrPXtoYW5kbGVPbkNsaWNrfSBzdHlsZT17eyBjb2xvcjogbWVzc2FnZS5pc1JlYWQoKSA/IHVuZGVmaW5lZCA6ICdyZWQnIH19PlxuICAgKiAgICAgIDxwPnttZXNzYWdlLnN1YmplY3QucmF3fTwvcD5cbiAgICogICAgPC9idXR0b24+XG4gICAqICApXG4gICAqIH1cbiAgICpcbiAgICogZXhwb3J0IGRlZmF1bHQgTWVzc2FnZTtcbiAgICogYGBgXG4gICAqL1xuICBwdWJsaWMgbWFya0FzUmVhZCgpOiBQcm9taXNlPHRydWU+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8dHJ1ZT4oKHJlcywgcmVqKSA9PiB7XG4gICAgICBpZiAodGhpcy5yZWFkKSByZXR1cm4gcmVzKHRydWUpO1xuICAgICAgc3VwZXJcbiAgICAgICAgLnByb2Nlc3NSZXF1ZXN0KHtcbiAgICAgICAgICBtZXRob2ROYW1lOiAnVXBkYXRlUFhQTWVzc2FnZScsXG4gICAgICAgICAgcGFyYW1TdHI6IHtcbiAgICAgICAgICAgIGNoaWxkSW50SWQ6IDAsXG4gICAgICAgICAgICBNZXNzYWdlTGlzdGluZzoge1xuICAgICAgICAgICAgICAnQF94bWxuczp4c2knOiAnaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UnLFxuICAgICAgICAgICAgICAnQF94bWxuczp4c2QnOiAnaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEnLFxuICAgICAgICAgICAgICAnQF9JRCc6IHRoaXMuaWQsXG4gICAgICAgICAgICAgICdAX1R5cGUnOiB0aGlzLnR5cGUsXG4gICAgICAgICAgICAgICdAX01hcmtBc1JlYWQnOiAndHJ1ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnNldFJlYWQodHJ1ZSk7XG4gICAgICAgICAgcmVzKHRydWUpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2gocmVqKTtcbiAgICB9KTtcbiAgfVxufVxuIl19