import * as THREE from 'three';
import { Entity } from '@src/entities/Entity';
import { Component } from '@src/components/Component';
import { describe, test, expect, jest } from '@jest/globals';
import { ControllerComponent } from '@src/components/ControllerComponent';
import { Level } from '@src/levels/Level';

describe('Entity three setup', () => {
    test('Mesh name is entity', () => {
        let entity = new Entity(THREE);
        expect(entity.Mesh().name).toEqual('entity');
    });

    test('Mirrored is set', () => {
        let entity = new Entity(THREE);
        expect(entity.mirrored).toEqual(false);

        entity = new Entity(THREE, true);
        expect(entity.mirrored).toEqual(true);
    });

    test('Mesh entity is set to this', () => {
        let entity = new Entity(THREE);
        expect(entity.Mesh().entity).toEqual(entity);
    });
});

describe('Entity components', () => {
    test('FindComponent finds corresponding component by name', () => {
        let entity = new Entity(THREE);

        let component1: Component = {
            name: 'testcomponent1',
            components: [],
            Update(level, delta) {},
            Mesh() {
                return undefined;
            },
        };
        let component2: Component = {
            name: 'testcomponent2',
            components: [],
            Update(level, delta) {},
            Mesh() {
                return undefined;
            },
        };
        entity.AddComponent(component1);
        entity.AddComponent(component2);
        expect(entity.FindComponent('testcomponent1')).toEqual(component1);
        expect(entity.FindComponent('testcomponent2')).toEqual(component2);
    });

    test('FindComponent finds corresponding component with composition', () => {
        let entity = new Entity(THREE);

        let component1: Component = {
            name: 'testcomponent1&testcomponent2',
            components: [],
            Update(level, delta) {},
            Mesh() {
                return undefined;
            },
        };
        entity.AddComponent(component1);
        expect(entity.FindComponent('testcomponent1')).toEqual(component1);
        expect(entity.FindComponent('testcomponent2')).toEqual(component1);
        expect(entity.FindComponent('testcomponent1&testcomponent2')).toEqual(
            component1,
        );
    });

    test('Update will update all components attached', () => {
        let entity = new Entity(THREE);

        const component1Update = jest.fn();
        const component2Update = jest.fn();
        const nonAttachedComponentUpdate = jest.fn();

        let component1: Component = {
            name: 'component1',
            components: [],
            Update(level, delta) {},
            Mesh() {
                return undefined;
            },
        };
        let component2: Component = {
            name: 'component2',
            components: [],
            Update(level, delta) {},
            Mesh() {
                return undefined;
            },
        };
        let nonAttachedComponent: Component = {
            name: 'notattached',
            components: [],
            Update(level, delta) {},
            Mesh() {
                return undefined;
            },
        };

        component1.Update = component1Update;
        component2.Update = component2Update;
        nonAttachedComponent.Update = nonAttachedComponentUpdate;

        entity.AddComponent(component1);
        entity.AddComponent(component2);
        entity.Update(undefined, 0);
        expect(component1Update).toHaveBeenCalledTimes(1);
        expect(component2Update).toHaveBeenCalledTimes(1);
        expect(nonAttachedComponentUpdate).toHaveBeenCalledTimes(0);
    });

    test.skip('Update will update entity position based on controller', () => {
        let entity = new Entity(THREE);

        let controller: ControllerComponent = new ControllerComponent();
        controller.position = { x: 10, y: 20, z: 30 };

        entity.AddComponent(controller);
        entity.Update(undefined, 0);
        expect(entity.Mesh().position).toEqual({ x: 10, y: 20, z: 30 });
    });
});
