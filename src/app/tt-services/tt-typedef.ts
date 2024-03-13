export type DamageDealer = { 
    damage: number,
    percentage: number,
    job: string,
    skill_used: number,
    skill_spam: number };
export type DamageDealers = { [name: string] : DamageDealer };
export type BattleData = { [name: string] : {
    job: number,
    damage_dealers: DamageDealers,
    damage_received: number}};
