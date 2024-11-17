import { Component } from '@src/components/Component';
import { Level } from '@src/levels/Level';
import { Group } from 'three';

export class HealthComponent implements Component {
    private _max: number;
    private _current: number;
    private _components: Component[];

    constructor(max: number) {
        this._max = max;
        this._current = this._max;
        this._components = [];
    }

    Update(level: Level, delta: number) {}

    Mesh(): Group | undefined {
        return undefined;
    }

    get name(): string {
        return 'health';
    }
    get components(): Component[] {
        return this._components;
    }
    get current(): number {
        return this._current;
    }
    set current(new_hp: number) {
        this._current = new_hp;
    }
    get max(): number {
        return this._max;
    }
    set max(new_hp: number) {
        this._max = new_hp;
    }

    public toString(): string {
        return `HP: ${this._current}/${this._max}`;
    }
}
