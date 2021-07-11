import { Attack } from "@src/attacks/Attacks";
import { Entity } from "@src/Entity";

export default class Calculations
{
	constructor()
	{
	}

	public ApplyDamage(attack: Attack, attacker: Entity, defender: Entity)
	{
		defender.stats.hp -= attack.Damage(attacker);
	}
}