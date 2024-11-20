import { HealthComponent } from '@src/components/HealthComponent';
import { Entity } from '@src/Entity';
import { StatsComponent } from '@src/components/StatsComponent';
import { ControllerComponent } from '@src/components/ControllerComponent';

export default class Character extends Entity {
    public stats: StatsComponent;
    public health: HealthComponent;
    public controller: ControllerComponent;

    constructor(team: number, three, mirrored?: boolean) {
        super(three, mirrored);

        this.health = new HealthComponent(100);
        this.stats = new StatsComponent(
            {
                str: 10,
                dex: 10,
                vit: 10,
                agi: 10,
                int: 10,
                mnd: 10,
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
        this.controller = new ControllerComponent(team);

        this.AddComponent(this.health);
        this.AddComponent(this.stats);
        this.AddComponent(this.stats);
        this.AddComponent(this.controller);
    }
}
