import { HealthComponent } from '@src/components/HealthComponent';
import { Entity } from '@src/Entity';
import { StatsComponent } from '@src/components/StatsComponent';
import { ControllerComponent } from '@src/components/ControllerComponent';
import { SpriteComponent, SpriteSheet } from '@src/components/SpriteComponent';
import characters from '@src/entities/characters.json';

export class Character extends Entity {
    public stats: StatsComponent;
    public health: HealthComponent;
    public controller: ControllerComponent;

    constructor(name: string, team: number, three, mirrored?: boolean) {
        super(three, mirrored);

        this.controller = new ControllerComponent(team);

        this.stats = new StatsComponent(
            {
                str: characters[name].stats.str,
                dex: characters[name].stats.dex,
                vit: characters[name].stats.vit,
                agi: characters[name].stats.agi,
                int: characters[name].stats.int,
                mnd: characters[name].stats.mnd,
            },
            {
                fire: 1,
                ice: 1,
                wind: 1,
                earth: 1,
                lightning: 1,
                water: 1,
                light: 1,
                dark: 1,
            },
        );

        this.health = new HealthComponent(characters[name].health.max);
        this.health.current = this.health.max;

        this.AddComponent(this.health);
        this.AddComponent(this.stats);
        this.AddComponent(this.stats);
        this.AddComponent(this.controller);

        const sheetPromises: Promise<any>[] = [];
        let spriteComponent = new SpriteComponent(three, mirrored);
        characters[name].animations.forEach(sheet => {
            sheetPromises.push(spriteComponent.AddSpriteSheet(sheet));
        });

        Promise.all(sheetPromises).then(() => {
            spriteComponent.PlayLoop('idle');
        });
        this.AddComponent(spriteComponent);
        this.controller.targetGridPosition = { x: 1, y: 0, z: 0 };
    }
}
