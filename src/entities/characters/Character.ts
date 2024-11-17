import { HealthComponent } from '@src/components/HealthComponent';
import { Entity } from '@src/Entity';
import { StatsComponent } from '@src/components/StatsComponent';

export default class Character extends Entity {
    public stats: StatsComponent = new StatsComponent(
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
    public health: HealthComponent;

    constructor(three, mirrored?: boolean) {
        super(three, mirrored);

        this.health = new HealthComponent(100);
        this.AddComponent(this.health);
        this.AddComponent(this.stats);
    }
}
