import { Attack } from '@src/attacks/Attacks';
import { Entity } from '@src/Entity';

export default class Calculations {
    constructor() {}

    public ApplyDamage(attack: Attack, attacker: Entity, defender: Entity) {
        // TODO: Fix to try to access stats
        // defender.stats.hp -= attack.Damage(attacker);
    }
}
