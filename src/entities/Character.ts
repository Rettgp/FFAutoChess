import { HealthComponent } from "@src/components/HealthComponent";
import { Entity } from "@src/Entity"
import { Stats } from "@src/Stats";

export default class Character extends Entity
{
    public stats: Stats = new Stats({
        str: 10,
        dex: 10,
        vit: 10,
        agi: 10,
        int: 10,
        mnd: 10
    });
    public health: HealthComponent;

    constructor(three, scene, mirrored?: boolean)
    {
        super(three, scene, mirrored);

        this.health = new HealthComponent(100);
        this.AddComponent(this.health);
    }
}