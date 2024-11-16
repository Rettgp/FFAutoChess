import ASSETS from "@src/AssetLoader"
import SpriteMixer from "@src/thirdparty/SpriteMixer.js"
import { Stats } from "@src/Stats";
import { Coordinate } from "./levels/Level";

interface SpriteSheetParameters 
{
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

export class SpriteSheet 
{
    private m_name;
    private m_path;
    private m_x_frames;
    private m_y_frames;
    private m_final_frame;
    private m_frame_width;
    private m_frame_height;
    private m_scale_x;
    private m_scale_y;
    private m_offset_x;
    private m_offset_z;
    private m_offset_y;

    constructor({name, path, x_frames, y_frames, final_frame, 
        frame_width, frame_height, scale_x, scale_y, offset_x, offset_z, offset_y}: SpriteSheetParameters)
    {
        this.m_name = name;
        this.m_path = path;
        this.m_x_frames = x_frames;
        this.m_y_frames = y_frames;
        this.m_final_frame = final_frame;
        this.m_frame_width = frame_width;
        this.m_frame_height = frame_height;
        this.m_scale_x = scale_x;
        this.m_scale_y = scale_y;
        this.m_offset_x = offset_x;
        this.m_offset_z = offset_z;
        this.m_offset_y = offset_y;
    }

    get name() { return this.m_name; }
    get x_frames() { return this.m_x_frames; }
    get y_frames() { return this.m_y_frames; }
    get final_frame() { return this.m_final_frame; }
    get path() { return this.m_path; }
    get frame_width() { return this.m_frame_width; }
    get frame_height() { return this.m_frame_height; }
    get scale_x() { return this.m_scale_x; }
    get scale_y() { return this.m_scale_y; }
    get offset_x() { return this.m_offset_x; }
    get offset_z() { return this.m_offset_z; }
    get offset_y() { return this.m_offset_y; }
}

class Action
{
    protected m_id: string;
    protected m_callback: Function;
    protected m_completed: boolean;
    constructor(id: string, callback?: Function)
    {
        this.m_id = id;
        this.m_callback = callback;
        this.m_completed = false;
    }

    public playOnce() {}
    public stop() {}

    get id() { return this.m_id; }
    get callback() { return this.m_callback; }
    get completed() { return this.m_completed; }
    set completed(is_completed: boolean) { this.m_completed = is_completed; }
}

class AnimationAction extends Action
{
    protected m_sprite_action: any;
    constructor(id: string, sprite_action: any, callback?: Function)
    {
        super(id, callback);
        this.m_sprite_action = sprite_action;
    }

    public playOnce() { this.m_sprite_action.playOnce(); }
    public stop() { this.m_sprite_action.stop(); }
    get sprite_action() { return this.m_sprite_action; }
}

class MovementAction extends Action
{
    protected m_target_position: Coordinate;
    constructor(id: string, target_position: Coordinate, callback?: Function)
    {
        super(id, callback);
        this.m_target_position = target_position;
    }

    get target_position() { return this.m_target_position; }
}

export class Entity
{
    static FPS = 100;
    protected m_three;
    protected m_sprite_mixer;
    protected m_scene;
    protected m_animations;
    protected m_group;
    protected m_action_queue;
    protected m_scale;
    protected m_busy;
    protected m_current_action: Action;
    protected m_mirrored: boolean

    constructor(three, scene, mirrored: boolean = false)
    {
        this.m_three = three;
        this.m_sprite_mixer = SpriteMixer(three);
        this.m_scene = scene;
        this.m_animations = new Map<string, AnimationAction>();
        this.m_group = new this.m_three.Group();
        this.m_action_queue = new Array<Action>();
        this.m_action_queue = new Array();
        this.m_scale = {x: 5, y: 5}
        this.m_busy = false;
        this.m_current_action = null;
        this.m_mirrored = mirrored;

        this.m_sprite_mixer.addEventListener('finished', (e)=> {
            if (this.m_animations.has(e.action.name))
            {
                this.m_animations.get(e.action.name).completed = true;
                this.m_current_action.completed = true;
                this.m_busy = false;
            }
        });

        this.m_group.name = "entity";
        this.m_group.entity = this;

        let health_texture = new this.m_three.SpriteMaterial({
            color:0xffffff});

        let health_sprite = new this.m_three.Sprite(health_texture);
        health_sprite.scale.x = 3;
        health_sprite.scale.y = 0.5;
        health_sprite.renderOrder = 2
        health_sprite.translateY( 3 );
        this.m_group.add(health_sprite);

        let health_bar_texture = new this.m_three.SpriteMaterial({
            color:0x43A047});

        let health_bar_sprite = new this.m_three.Sprite(health_bar_texture);
        health_bar_sprite.scale.x = 2.9;
        health_bar_sprite.scale.y = 0.16;
        health_bar_sprite.renderOrder = 2
        health_bar_sprite.translateY( 3.14 );
        health_bar_sprite.translateX( -0.03 );
        this.m_group.add(health_bar_sprite);
    }

    get mirrored() { return this.m_mirrored; }

    public Update(delta)
    {
        this.m_sprite_mixer.update(delta)

        if (this.m_current_action && this.m_current_action instanceof MovementAction)
        {
            let move_action: MovementAction = this.m_current_action as MovementAction;
            let rounded_current_mesh_x = Math.round(this.Mesh().position.x * 10) / 10;
            let rounded_current_mesh_z = Math.round(this.Mesh().position.z * 10) / 10;
            let rounded_target_mesh_x = Math.round(move_action.target_position.x * 10) / 10;
            let rounded_target_mesh_z = Math.round(move_action.target_position.z * 10) / 10;
            if (Math.abs(rounded_current_mesh_x - rounded_target_mesh_x) > 0.2 || 
                Math.abs(rounded_current_mesh_z - rounded_target_mesh_z) > 0.2)
            {
                this.Mesh().position.x += (Math.sign(move_action.target_position.x - this.Mesh().position.x) * 0.15);
                this.Mesh().position.z += (Math.sign(move_action.target_position.z - this.Mesh().position.z) * 0.15);
            }
            else
            {
                move_action.completed = true;
                this.m_busy = false;
            }
        }

        for (let sprite of this.m_group.children)
        {
            if (sprite.visible)
            {
                // console.log(sprite.geometry.boundingBox);
            }
        }
    }

    public Move(target: Coordinate, callback?: Function)
    {
        this.m_action_queue.push(new MovementAction("move", target, callback));
        if (!this.m_busy)
        {
            this.PlayAction(this.m_action_queue.shift());
        }
    }

    public QueueAnimation(name, callback)
    {
        if (this.m_animations.has(name))
        {
            this.m_action_queue.push(
                new AnimationAction(name, this.m_animations.get(name), callback));
            if (!this.m_busy)
            {
                this.PlayAction(this.m_action_queue.shift());
            }
        }
        else
        {
            console.error(`Entity: No animation available: ${name}`);
        }
    }

    protected PlayLoop(name)
    {
        this.m_animations.get(name).playLoop();
    }

    protected PlayAction(action)
    {
        const promise = new Promise<void>((resolve, reject) => {
            action.completed = false;
            this.m_busy = true;
            this.m_current_action = action;
            if (action instanceof AnimationAction)
            {
                this.m_animations.get("idle").stop();
                this.m_animations.get("idle").actionSprite.visible = false;

                var sprite_action = this.m_animations.get(action.id);
                sprite_action.playOnce();
            }

            var wait = () =>
            {
                if (action.completed) 
                {
                    action.stop();
                    this.m_current_action = null;

                    var next_action = this.m_action_queue.shift();
                    if (next_action !== undefined)
                    {
                        this.PlayAction(next_action);
                    }
                    else
                    {
                        this.m_animations.get("idle").playLoop();
                    }

                    if (action.callback !== undefined)
                    {
                        action.callback();
                    }

                    return resolve();
                }
                setTimeout(wait, 10);
            };
            wait();
        });

        return promise;
    }

    public CreateSpriteSheet(sprite_sheet: SpriteSheet)
    {
        const promise = new Promise<void>((resolve, reject) => {
            new this.m_three.TextureLoader().load(sprite_sheet.path, (texture)=> {
                var actionSprite = this.m_sprite_mixer.ActionSprite( 
                    texture, sprite_sheet.x_frames, sprite_sheet.y_frames, this.m_mirrored);
                var action = this.m_sprite_mixer.Action(
                    actionSprite, sprite_sheet.name, 
                    0, sprite_sheet.final_frame, Entity.FPS);
                this.m_animations.set(sprite_sheet.name, action);

                actionSprite.scale.x = this.m_scale.x * sprite_sheet.scale_x;
                actionSprite.scale.y = this.m_scale.y * sprite_sheet.scale_y;
                actionSprite.visible = false;
                
                if (this.m_mirrored)
                {
                    actionSprite.position.x += sprite_sheet.offset_z;
                    actionSprite.position.z += sprite_sheet.offset_x;
                }
                else
                {
                    actionSprite.position.x += sprite_sheet.offset_x;
                    actionSprite.position.z += sprite_sheet.offset_z;
                }

                actionSprite.position.y += sprite_sheet.offset_y;

                actionSprite.renderOrder = 1
                this.m_group.add(actionSprite);
                this.m_group.renderOrder = 1
                this.m_scene.add(this.m_group);

                resolve();
            });
        });

        return promise;
    }

    public Mesh()
    {
        return this.m_group;
    }
}