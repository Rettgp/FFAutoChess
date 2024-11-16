import {SpriteSheet} from "@src/Entity"
import {Attributes} from "@src/Stats"
import Character from "@src/entities/Character";

var Animations = 
{
    idle: new SpriteSheet ({
        name: "idle", 
        path: "src/entities/sephiroth/idle.png", 
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
        path: "src/entities/sephiroth/attack.png", 
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
        path: "src/entities/sephiroth/limit_break.png", 
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

export default class Sephiroth extends Character
{
    constructor(three, scene, mirrored?: boolean)
    {
        super(three, scene, mirrored);

        this.stats.attributes.str = 21;
        this.stats.attributes.dex = 17;
        this.stats.attributes.vit = 16;
        this.stats.attributes.agi = 16;
        this.stats.attributes.int = 15;
        this.stats.attributes.mnd = 7;
        this.stats.max_hp = 100;
        this.stats.hp = 100;

        this.CreateSpriteSheet(Animations.idle).then(() =>{
            this.m_animations.get("idle").playLoop();
        });
        this.CreateSpriteSheet(Animations.attack);
        this.CreateSpriteSheet(Animations.limit_break);
    }
}