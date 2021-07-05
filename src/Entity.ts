import ASSETS from "@src/AssetLoader"
import SpriteMixer from "@src/thirdparty/SpriteMixer.js"
import { Stats } from "@src/Stats";

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

export class Entity
{
    static FPS = 100;
    protected m_three;
    protected m_sprite_mixer;
    protected m_scene;
    protected m_actions;
    protected m_group;
    protected m_current_animation_finished;
    protected m_action_queue;
    protected m_max_hp;
    protected m_current_hp;
    protected m_scale;
    protected m_busy;
    protected m_stats: Stats;

    constructor(three, scene)
    {
        this.m_three = three;
        this.m_sprite_mixer = SpriteMixer(three);
        this.m_scene = scene;
        this.m_actions = new Map();
        this.m_group = new this.m_three.Group();
        this.m_current_animation_finished = false;
        this.m_action_queue = new Array();
        this.m_max_hp = 100;
        this.m_current_hp = 100;
        this.m_scale = {x: 5, y: 5}
        this.m_busy = false;
        this.m_stats = new Stats();

        this.m_sprite_mixer.addEventListener('finished', (e)=> {
            if (this.m_actions.has(e.action.name))
            {
                this.m_actions.get(e.action.name).completed = true;
                this.m_busy = false;
            }
        });

        this.m_group.name = "entity";
        this.m_group.entity = this;
    }

    get stats() { return this.m_stats; }

    public Update(delta)
    {
        this.m_sprite_mixer.update(delta)
    }

    public QueueAction(name, callback)
    {
        if (!this.m_actions.has(name))
        {
            console.error(`Entity: No action available: ${name}`);
            return
        }

        this.m_actions.get("idle").stop();
        this.m_actions.get("idle").actionSprite.visible = false;

        var action = {id: name, cb: callback};
        this.m_action_queue.push(action);
        if (!this.m_busy)
        {
            this.PlayAction(this.m_action_queue.shift());
        }
    }

    public PlayLoop(name)
    {
        if (!this.m_actions.has(name))
        {
            console.error(`Entity: No action available: ${name}`);
            return
        }

        this.m_actions.get(name).playLoop();
    }

    public PlayAction(action)
    {
        const promise = new Promise<void>((resolve, reject) => {
            if (!this.m_actions.has(action.id))
            {
                console.error(`Entity: No action available: ${action.id}`);
                resolve();
                return
            }

            var sprite_action = this.m_actions.get(action.id);
            sprite_action.completed = false;
            this.m_busy = true;
            sprite_action.playOnce();

            var wait = () =>
            {
                if (sprite_action.completed) 
                {
                    sprite_action.stop();

                    var next_action = this.m_action_queue.shift();
                    if (next_action !== undefined)
                    {
                        this.PlayAction(next_action);
                    }
                    else
                    {
                        this.m_actions.get("idle").playLoop();
                    }

                    if (action.cb !== undefined)
                    {
                        action.cb();
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
                    texture, sprite_sheet.x_frames, sprite_sheet.y_frames);
                var action = this.m_sprite_mixer.Action(
                    actionSprite, sprite_sheet.name, 
                    0, sprite_sheet.final_frame, Entity.FPS);
                this.m_actions.set(sprite_sheet.name, action);

                actionSprite.scale.x = this.m_scale.x * sprite_sheet.scale_x;
                actionSprite.scale.y = this.m_scale.y * sprite_sheet.scale_y;
                actionSprite.visible = false;
                actionSprite.position.x += sprite_sheet.offset_x;
                actionSprite.position.z += sprite_sheet.offset_z;
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