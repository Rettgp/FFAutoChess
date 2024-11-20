import { SpriteComponent, SpriteSheet } from '@src/components/SpriteComponent';
import Character from '../Character';
import { Sprite } from 'three';

var Animations = {
    idle: new SpriteSheet({
        name: 'idle',
        path: 'assets/sephiroth/idle.png',
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
    attack: new SpriteSheet({
        name: 'attack',
        path: 'assets/sephiroth/attack.png',
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
    limit_break: new SpriteSheet({
        name: 'limit_break',
        path: 'assets/sephiroth/limit_break.png',
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
    }),
};

export default class Sephiroth extends Character {
    constructor(team: number, three, mirrored?: boolean) {
        super(team, three, mirrored);

        this.stats.attributes.str = 21;
        this.stats.attributes.dex = 17;
        this.stats.attributes.vit = 16;
        this.stats.attributes.agi = 16;
        this.stats.attributes.int = 15;
        this.stats.attributes.mnd = 7;

        this.health.max = 100;
        this.health.current = 100;

        let spriteComponent = new SpriteComponent(three, mirrored);
        spriteComponent.AddSpriteSheet(Animations.idle).then(() => {
            spriteComponent.PlayLoop(Animations.idle.name);
        });
        spriteComponent.AddSpriteSheet(Animations.attack);
        spriteComponent.AddSpriteSheet(Animations.limit_break);
        this.AddComponent(spriteComponent);

        this.controller.targetGridPosition = { x: 0, y: 0, z: 2 };
    }
}
