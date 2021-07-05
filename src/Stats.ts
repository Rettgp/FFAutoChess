interface Attributes 
{
    str: number
    dex: number
    vit: number
    agi: number
    int: number
    mnd: number
}

interface Resistances 
{
    fire: number
    ice: number
    wind: number
    earth: number
    lightning: number
    water: number
    light: number
    dark: number
}

export class Stats 
{
    private m_attributes: Attributes;
    private m_resistances: Resistances;

    constructor(attributes: Attributes = 
        {
            str: 10, dex: 10, vit: 10, agi: 10, 
            int: 10, mnd: 10
        }, 
        resistances: Resistances = 
        {
            fire: 1, ice: 1, wind: 1, earth: 1, lightning: 1,
            water: 1, light: 1, dark: 1
        })
    {
        this.m_attributes = attributes;
        this.m_resistances = resistances;
    }

    get attributes() { return this.m_attributes; }
    get resistances() { return this.m_resistances; }
    set attributes(attr: Attributes) { this.m_attributes = attr; }
    set resistances(res: Resistances) { this.m_resistances = res; }

    public StrString(): string
    {
        return `Strength: ${this.m_attributes.str}`;
    }
    public DexString(): string
    {
        return `Dexterity: ${this.m_attributes.dex}`;
    }
    public VitString(): string
    {
        return `Vitality: ${this.m_attributes.vit}`;
    }
    public AgiString(): string
    {
        return `Agility: ${this.m_attributes.agi}`;
    }
    public IntString(): string
    {
        return `Intelligence: ${this.m_attributes.int}`;
    }
    public MndString(): string
    {
        return `Mind: ${this.m_attributes.mnd}`;
    }
}