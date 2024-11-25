import * as THREE from 'three';
import {
    send,
    getState,
    Blackboard,
    BlackboardMsgType,
} from '@src/blackboards/DefaultBlackboard';
import { describe, test, expect, jest } from '@jest/globals';

describe('Blackboard send', () => {
    test('Send stores of data', () => {
        let blackboard = new Blackboard();

        send(undefined, BlackboardMsgType.Position, 123);
        blackboard.Proceed();

        expect(blackboard.data.length).toEqual(1);
        expect(blackboard.data[0].receipt.type).toEqual(
            BlackboardMsgType.Position,
        );
        expect(blackboard.data[0].data).toEqual(123);
    });

    test('Get retrieves data', () => {
        let blackboard = new Blackboard();

        send(undefined, BlackboardMsgType.Position, 123);
        blackboard.Proceed();

        getState(undefined, BlackboardMsgType.Position).then(data => {
            expect(data).toEqual([123]);
        });
        blackboard.Proceed();
    });

    test('Get retrieves empty data if no data of specified type', () => {
        let blackboard = new Blackboard();

        send(undefined, BlackboardMsgType.Health, 123);
        blackboard.Proceed();

        getState(undefined, BlackboardMsgType.Position).then(data => {
            expect(data).toEqual([]);
        });
        blackboard.Proceed();
    });

    test('Get retrieves empty data if no data present', () => {
        let blackboard = new Blackboard();

        getState(undefined, BlackboardMsgType.Position).then(data => {
            expect(data).toEqual([]);
        });
        blackboard.Proceed();
    });

    test('Proceed removes front of PUT communication queue', () => {
        let blackboard = new Blackboard();

        send(undefined, BlackboardMsgType.Position, 123);
        send(undefined, BlackboardMsgType.Position, 456);
        send(undefined, BlackboardMsgType.Position, 789);
        expect(blackboard.PutMessagesRemaining()).toEqual(3);

        blackboard.Proceed();
        expect(blackboard.PutMessagesRemaining()).toEqual(2);

        blackboard.Proceed();
        expect(blackboard.PutMessagesRemaining()).toEqual(1);

        blackboard.Proceed();
        expect(blackboard.PutMessagesRemaining()).toEqual(0);

        blackboard.Proceed();
        expect(blackboard.PutMessagesRemaining()).toEqual(0);
    });

    test('Proceed removes front of GET communication queue', () => {
        let blackboard = new Blackboard();

        getState(undefined, BlackboardMsgType.Position);
        getState(undefined, BlackboardMsgType.Position);
        getState(undefined, BlackboardMsgType.Position);
        expect(blackboard.GetMessagesRemaining()).toEqual(3);

        blackboard.Proceed();
        expect(blackboard.GetMessagesRemaining()).toEqual(2);

        blackboard.Proceed();
        expect(blackboard.GetMessagesRemaining()).toEqual(1);

        blackboard.Proceed();
        expect(blackboard.GetMessagesRemaining()).toEqual(0);

        blackboard.Proceed();
        expect(blackboard.GetMessagesRemaining()).toEqual(0);
    });
});
