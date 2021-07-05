import {Entity, SpriteSheet} from "@src/Entity"
import { Stats } from "@src/Stats";

var Animations = 
{
    idle: new SpriteSheet ({
        name: "idle", 
        path: "src/characters/tidus/idle.png", 
        x_frames: 3, 
        y_frames: 2, 
        final_frame: 3,
        frame_width: 97, 
        frame_height: 68, 
        scale_x: 1, 
        scale_y: 1,
        offset_x: 0, 
        offset_z: 0, 
        offset_y: 0,
    }),
    attack: new SpriteSheet ({
        name: "attack", 
        path: "src/characters/tidus/attack.png", 
        x_frames: 3, 
        y_frames: 4, 
        final_frame: 10,
        frame_width: 167, 
        frame_height: 100, 
        scale_x: 1.72, 
        scale_y: 1.47,
        offset_x: -2.94, 
        offset_z: -0.39,
        offset_y: 0,
    }),
    limit_break: new SpriteSheet ({
        name: "limit_break", 
        path: "src/characters/tidus/limit_break.png", 
        x_frames: 3, 
        y_frames: 27, 
        final_frame: 78,
        frame_width: 287, 
        frame_height: 214, 
        scale_x: 2.959, 
        scale_y: 3.147,
        offset_x: -6.9, 
        offset_z: -3.35,
        offset_y: 0.4,
    })
};

export default class Tidus extends Entity
{
    constructor(three, scene)
    {
        super(three, scene);

        this.m_stats = new Stats(
            {
                str: 16,
                dex: 20,
                vit: 15,
                agi: 20,
                int: 13,
                mnd: 10
            }
        );

        this.CreateSpriteSheet(Animations.idle).then(() =>{
            this.m_actions.get("idle").playLoop();
        });
        this.CreateSpriteSheet(Animations.attack);
        this.CreateSpriteSheet(Animations.limit_break);
    }
}