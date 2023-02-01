import { type } from 'os';
import { assert, expect, test } from 'vitest'
import {paypal, ClientInstance} from '../public/js/client';


test('Base main namespace test.', () => {

    expect(paypal).toBeTruthy();
});

test('Client namespace test.', () => {

    expect(paypal.client).toBeTruthy();
});

test('Client basic parameter test.', () => {

    expect(() => paypal.client()).toThrowError(TypeError);
    expect(() => paypal.client()).toThrowError(/Token invalid or null/);
});

test('Client parameter type test.', () => {

    expect(() => paypal.client(123)).toThrowError(TypeError);
    expect(() => paypal.client(123)).toThrowError(/Token must be object/)
});

test('Checking for client token authorization property.', () => {

    const token = {};
    console.log('Token typeof: ', typeof token);
    expect(() => paypal.client({})).toThrowError(TypeError);
    expect(() => paypal.client({})).toThrowError(/Token missing authorization property/);
});

test("Looking for an instance of client.", async () => {

    const token = {authorization: 'abc123'};
    const instance = await paypal.client(token);
    expect(instance).toBeInstanceOf(ClientInstance);
});