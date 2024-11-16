import { Component } from "@src/components/Component";

export default class AnimationComponent implements Component
{
    private _name: string
    private _components: Array<Component>
    protected _sprite_action: any;
    // TODO: These are old from the "Action" class
    private _id: string;
    private _callback: Function;
    private _completed: boolean;

    constructor(id: string, sprite_action: any, otherComponents: Array<Component> = [], callback?: Function )
    {
        this._id = id;
        this._callback = callback;
        this._sprite_action = sprite_action;
        this._name = "animation";
        this._components = otherComponents;
    }
    
    get id() { return this._id; }
    get callback() { return this._callback; }
    get completed() { return this._completed; }
    set completed(is_completed: boolean) { this._completed = is_completed; }
    get sprite_action() { return this._sprite_action; }
    get name() : string { return this._name; }
    get components() : Array<Component> { return this._components; }

    playOnce() { this._sprite_action.playOnce(); }
    stop() { this._sprite_action.stop(); }
}