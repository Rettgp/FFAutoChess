import {Element} from "@src/Elements"
import { Entity } from "@src/Entity";

export abstract class Attack
{
	public abstract Damage(entity: Entity): number;
	public abstract Element(): Element;
}

export class MeleeAttack extends Attack
{
	private m_damage: number;
	private m_element: Element = Element.None;

	constructor(damage: number, element?: Element)
	{
		super();
		this.m_damage = damage;
		this.m_element = element;
	}

	public Damage(entity: Entity): number
	{
		// TODO: Fix to access stats component
		// return this.m_damage * entity.stats.attributes.str;
		return 0;
	}
	public Element(): Element
	{
		return this.m_element;
	}
}

export class Spell extends Attack
{
	private m_damage: number;
	private m_element: Element;

	constructor(damage: number, element: Element)
	{
		super();
		this.m_damage = damage;
	}

	public Damage(entity: Entity): number
	{
		// TODO: Fix to access stats component
		// return this.m_damage * entity.stats.attributes.int;
		return 0;
	}
	public Element(): Element
	{
		return this.m_element;
	}
}