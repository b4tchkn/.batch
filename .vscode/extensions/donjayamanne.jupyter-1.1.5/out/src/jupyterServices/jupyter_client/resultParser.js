"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const helpers_1 = require("../../common/helpers");
class MessageParser extends events_1.EventEmitter {
    constructor(outputChannel) {
        super();
        this.outputChannel = outputChannel;
    }
    processResponse(message, observer) {
        if (!message) {
            return;
        }
        if (!helpers_1.Helpers.isValidMessag(message)) {
            return;
        }
        try {
            const msg_type = message.header.msg_type;
            if (msg_type === 'status') {
                this.emit('status', message.content.execution_state);
            }
            const msg_id = message.parent_header.msg_id;
            if (!msg_id) {
                return;
            }
            const status = message.content.status;
            let parsedMesage;
            switch (status) {
                case 'abort':
                case 'aborted':
                case 'error': {
                    // http://jupyter-client.readthedocs.io/en/latest/messaging.html#request-reply
                    if (msg_type !== 'complete_reply' && msg_type !== 'inspect_reply') {
                        parsedMesage = {
                            data: 'error',
                            type: 'text',
                            stream: 'status'
                        };
                    }
                    break;
                }
                case 'ok': {
                    // http://jupyter-client.readthedocs.io/en/latest/messaging.html#request-reply
                    if (msg_type !== 'complete_reply' && msg_type !== 'inspect_reply') {
                        parsedMesage = {
                            data: 'ok',
                            type: 'text',
                            stream: 'status'
                        };
                    }
                }
            }
            if (!parsedMesage) {
                parsedMesage = helpers_1.Helpers.parseIOMessage(message);
            }
            if (!parsedMesage || !observer) {
                return;
            }
            observer.onNext(parsedMesage);
        }
        catch (ex) {
            this.emit('shellmessagepareerror', ex, JSON.stringify(message));
        }
    }
}
exports.MessageParser = MessageParser;
//# sourceMappingURL=resultParser.js.map