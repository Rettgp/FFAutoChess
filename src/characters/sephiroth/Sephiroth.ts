import {Entity, SpriteSheet} from "@src/Entity"

var Animations = 
{
    idle: new SpriteSheet ({
        name: "idle", 
        path: "src/characters/sephiroth/idle.png", 
        x_frames: 3, 
        y_frames: 2, 
        final_frame: 3,
        frame_width: 128, 
        frame_height: 76, 
        scale_x: 1, 
        scale_y: 1,
        offset_x: 0, 
        offset_z: 0, 
        offset_y: 0,
    }),
    attack: new SpriteSheet ({
        name: "attack", 
        path: "src/characters/sephiroth/attack.png", 
        x_frames: 3, 
        y_frames: 9, 
        final_frame: 26,
        frame_width: 280, 
        frame_height: 185, 
        scale_x: 2.1875, 
        scale_y: 2.43,
        offset_x: -3.75, 
        offset_z: 0.6,
        offset_y: 0,
    }),
    limit_break: new SpriteSheet ({
        name: "limit_break", 
        path: "src/characters/sephiroth/limit_break.png", 
        x_frames: 3, 
        y_frames: 15, 
        final_frame: 43,
        frame_width: 1010, 
        frame_height: 207, 
        scale_x: 7.89, 
        scale_y: 2.73,
        offset_x: -6.9, 
        offset_z: -0.2,
        offset_y: 0,
    })
};

export default class Sephiroth extends Entity
{
    constructor(three, scene)
    {
        super(three, scene);

        this.CreateSpriteSheet(Animations.idle).then(() =>{
            this.m_actions.get("idle").playLoop();
        });
        this.CreateSpriteSheet(Animations.attack);
        this.CreateSpriteSheet(Animations.limit_break);
    }
}