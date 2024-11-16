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
    })

    constructor(three, scene, mirrored?: boolean)
    {
        super(three, scene, mirrored);
    }
}