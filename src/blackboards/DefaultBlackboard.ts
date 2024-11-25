import { Entity } from '@src/entities/Entity';
import { Coordinate } from '@src/levels/Level';

let _sendQueue = [];
let _getQueue = [];

export enum BlackboardMsgType {
    Position,
    Health,
    // etc.
}

export interface BlackboardReceipt {
    type: BlackboardMsgType;
    sender: Entity;
    resolver: any;
}

export interface BlackboardMessage {
    receipt: BlackboardReceipt;
    data: any;
}

class BlackboardComms {
    static PUT: BlackboardMessage[];
    static GET: BlackboardReceipt[];
}

export class Blackboard {
    private _data: BlackboardMessage[];
    private _timer: any;

    constructor() {
        this._data = [];
        BlackboardComms.PUT = [];
        BlackboardComms.GET = [];

        this._timer = setInterval(() => {
            this.Proceed();
        }, 250);
    }

    Proceed() {
        let nextPut = BlackboardComms.PUT.shift();
        let nextGet = BlackboardComms.GET.shift();

        if (nextPut) {
            this._data.push(nextPut);
        }
        if (nextGet) {
            let filteredMessages = this._data.filter(
                element => element.receipt.type === nextGet.type,
            );
            let result = [];
            filteredMessages.forEach(msg => {
                result.push(msg.data);
            });

            nextGet.resolver(result);
        }
    }

    PutMessagesRemaining(): number {
        return BlackboardComms.PUT.length;
    }
    GetMessagesRemaining(): number {
        return BlackboardComms.GET.length;
    }

    get data(): BlackboardMessage[] {
        return this._data;
    }
}

export function send(sender: Entity, type: BlackboardMsgType, data: any) {
    BlackboardComms.PUT.push({
        receipt: { type: type, sender: sender, resolver: undefined },
        data,
    });
}

export function getState(
    sender: Entity,
    type: BlackboardMsgType,
): Promise<any> {
    const promise = new Promise((resolve, reject) => {
        BlackboardComms.GET.push({
            type: type,
            sender: sender,
            resolver: resolve,
        });
    });
    return promise;
}
