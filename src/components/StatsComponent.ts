import { Component } from '@src/components/Component';
import { Group } from 'three';

export interface Attributes {
    str: number;
    dex: number;
    vit: number;
    agi: number;
    int: number;
    mnd: number;
}

export interface Resistances {
    fire: number;
    ice: number;
    wind: number;
    earth: number;
    lightning: number;
    water: number;
    light: number;
    dark: number;
}

export class StatsComponent implements Component {
    private _components: Component[];
    private _attributes: Attributes;
    private _resistances: Resistances;

    constructor(attributes: Attributes, resistances: Resistances) {
        this._components = [];
        this._attributes = attributes;
        this._resistances = resistances;
    }

    Update(delta: number) {}

    Mesh(): Group | undefined {
        return undefined;
    }

    get name(): string {
        return 'stats';
    }
    get components(): Component[] {
        return this._components;
    }

    get attributes() {
        return this._attributes;
    }
    set attributes(attr: Attributes) {
        this._attributes = attr;
    }
    get resistances() {
        return this._resistances;
    }
    set resistances(res: Resistances) {
        this._resistances = res;
    }

    public AttributesToString(): string {
        return `Strength: ${this._attributes.str}
            Dexterity: ${this._attributes.dex}
            Vitality: ${this._attributes.vit}
            Agility: ${this._attributes.agi}
            Intelligence: ${this._attributes.int}
            Mind: ${this._attributes.mnd}`;
    }
}
