import SpriteMixer from '@src/thirdparty/SpriteMixer.js';
import { Component } from '@src/components/Component';
import { Group, Object3DEventMap } from 'three';
import { Level } from '@src/levels/Level';

interface SpriteSheetParameters {
    name: string;
    path: string;
    x_frames: number;
    y_frames: number;
    final_frame: number;
    frame_width: number;
    frame_height: number;
    scale_x: number;
    scale_y: number;
    offset_x: number;
    offset_z: number;
    offset_y: number;
}

interface SpriteMixerValues {
    actionSprite: any;
    action: any;
}

export interface SpriteSheet {
    name: string;
    path: string;
    x_frames: number;
    y_frames: number;
    final_frame: number;
    frame_width: number;
    frame_height: number;
    scale_x: number;
    scale_y: number;
    offset_x: number;
    offset_z: number;
    offset_y: number;
}

export class SpriteComponent implements Component {
    private _name: string;
    private _components: Array<Component>;
    private _callback?: Function | undefined;
    private _completed: boolean = true;
    private _animations: Map<string, SpriteMixerValues> = new Map<
        string,
        SpriteMixerValues
    >();
    private _animationsQueue: Array<SpriteSheet>;
    private _busy: boolean = false;
    private _spriteMixer: any;
    private _three: any;
    private _group: Group;
    private _mirrored: boolean;
    private _fps: number = 100;
    private _scale = { x: 5, y: 5 };

    constructor(three, mirrored: boolean = false) {
        this._name = 'sprite';
        this._components = [];
        this._spriteMixer = SpriteMixer(three);
        this._three = three;
        this._mirrored = mirrored;
        this._group = new this._three.Group();

        this._spriteMixer.addEventListener('finished', e => {
            let found = this._animations.get(e.name);
            if (found) {
                // TODO: Figure out if this is still needed
                // this.m_animations.get(e.action.name).completed = true;
                // this.m_current_action.completed = true;
                // this.m_busy = false;
            }
        });
    }
    get callback() {
        return this._callback;
    }
    set callback(func: Function) {
        this._callback = func;
    }
    get completed() {
        return this._completed;
    }
    set completed(is_completed: boolean) {
        this._completed = is_completed;
    }
    get name(): string {
        return this._name;
    }
    get group(): Group {
        return this._group;
    }
    get components(): Array<Component> {
        return this._components;
    }

    Update(level: Level, delta: number) {
        this._spriteMixer.update(delta);
    }

    Mesh(): Group | undefined {
        return this._group;
    }

    AddSpriteSheet(sprite_sheet: SpriteSheet) {
        const promise = new Promise<void>((resolve, reject) => {
            new this._three.TextureLoader().load(sprite_sheet.path, texture => {
                var actionSprite = this._spriteMixer.ActionSprite(
                    texture,
                    sprite_sheet.x_frames,
                    sprite_sheet.y_frames,
                    this._mirrored,
                );
                var action = this._spriteMixer.Action(
                    actionSprite,
                    sprite_sheet.name,
                    0,
                    sprite_sheet.final_frame,
                    this._fps,
                );

                actionSprite.scale.x = this._scale.x * sprite_sheet.scale_x;
                actionSprite.scale.y = this._scale.y * sprite_sheet.scale_y;
                actionSprite.visible = false;

                if (this._mirrored) {
                    actionSprite.position.x += sprite_sheet.offset_z;
                    actionSprite.position.z += sprite_sheet.offset_x;
                } else {
                    actionSprite.position.x += sprite_sheet.offset_x;
                    actionSprite.position.z += sprite_sheet.offset_z;
                }

                actionSprite.position.y += sprite_sheet.offset_y;
                this._animations.set(sprite_sheet.name, {
                    actionSprite: actionSprite,
                    action: action,
                });
                actionSprite.renderOrder = 1;
                this._group.add(actionSprite);
                this._group.renderOrder = 1;

                resolve();
            });
        });

        return promise;
    }

    QueueAnimation(name, callback) {
        if (this._animations.get(name)) {
            this._animationsQueue.push(name);
            if (!this._busy) {
                this.PlayAction(this._animationsQueue.shift());
            }
        } else {
            console.error(`Entity: No animation available: ${name}`);
        }
    }

    PlayLoop(name: string) {
        let found = this._animations.get(name);
        if (found) {
            found.action.playLoop();
        }
    }

    PlayAction(action) {
        // const promise = new Promise<void>((resolve, reject) => {
        //     action.completed = false;
        //     this.m_busy = true;
        //     this.m_current_action = action;
        //     if (action instanceof SpriteComponent)
        //     {
        //         this.m_animations.get("idle").stop();
        //         this.m_animations.get("idle").actionSprite.visible = false;
        //         var sprite_action = this.m_animations.get(action.id);
        //         sprite_action.playOnce();
        //     }
        //     var wait = () =>
        //     {
        //         if (action.completed)
        //         {
        //             action.stop();
        //             this.m_current_action = null;
        //             var next_action = this.m_action_queue.shift();
        //             if (next_action !== undefined)
        //             {
        //                 this.PlayAction(next_action);
        //             }
        //             else
        //             {
        //                 this.m_animations.get("idle").playLoop();
        //             }
        //             if (action.callback !== undefined)
        //             {
        //                 action.callback();
        //             }
        //             return resolve();
        //         }
        //         setTimeout(wait, 10);
        //     };
        //     wait();
        // });
        // return promise;
    }
}
