"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const es = require('event-stream');
class StreamLogger {
    constructor() {
        // Set up some default loggers
        this.prefixes = {
            'info': '[Info]',
            'warn': '[Warn]',
            'error': '[Error]',
            'success': '[Success]',
            'debug': '[Debug]'
        };
    }
    /**
     * addPrefix
     *	add a prefix to the internal prefix object,
     *	which can then be used to create through streams
     */
    addPrefix(name, prefix) {
        this.prefixes[name] = prefix;
    }
    /**
     * getLogStream
     *	get a stream that when logged to will split up the info by lines,
     *	apply a prefix, and forward it on.
     */
    createLogStream(prefixName) {
        const self = this;
        return es.pipe(es.split(), es.through(function (data) {
            if (data == '')
                return;
            this.emit('data', self.formatWithPrefix(prefixName, data));
        }));
    }
    /**
     * formatWithPrefix
     *	Format a string to send through the stream. This can be used
     *	standalone for special situations.
     */
    formatWithPrefix(name, message) {
        const prefix = this.prefixes[name];
        if (!prefix)
            throw new Error(`Unknown prefix ${name}`);
        const maxLength = this.getMaxPrefixLength();
        const spaces = _.times(maxLength - prefix.length, _.constant(' ')).join('');
        return `${prefix}${spaces} ${message}\n`;
    }
    getMaxPrefixLength() {
        return _.max(_.map(this.prefixes, (prefix) => prefix.length));
    }
}
exports.StreamLogger = StreamLogger;
//# sourceMappingURL=index.js.map