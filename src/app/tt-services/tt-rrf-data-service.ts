import { Injectable, WritableSignal, signal } from '@angular/core';
import { DamageDealer, DamageDealers, BattleData } from './tt-typedef';
import { Entries } from 'type-fest';

interface JsonDamageDealer {
    'damage': number; 'job': number; 'skill_timers': number[]
}

@Injectable()
export class TTRRFDataService {
    count: WritableSignal<number> = signal(0);
    rrf_data: any | null = null;
    battle_data: BattleData = {};
    shared_battle_data: WritableSignal<BattleData> = signal(this.battle_data);

    job_id_map: { [id: number]: string } = {
        0: 'Novice',
        1: 'Swordman',
        2: 'Mage',
        3: 'Archer',
        4: 'Acolyte',
        5: 'Merchant',
        6: 'Thief',
        7: 'Knight',
        8: 'Priest',
        9: 'Wizard',
        10: 'Blacksmith',
        11: 'Hunter',
        12: 'Assassin',
        13: 'Knight',
        14: 'Crusader',
        15: 'Monk',
        16: 'Sage',
        17: 'Rogue',
        18: 'Alchemist',
        19: 'Bard',
        20: 'Dancer',
        21: 'Crusader',
        22: 'Wedding',
        23: 'SuperNovice',
        24: 'Gunslinger',
        25: 'Ninja',
        26: 'Xmas',
        1002: 'Poring',
        4001: 'Novice High',
        4002: 'Swordman High',
        4003: 'Mage High',
        4004: 'Archer High',
        4005: 'Acolyte High',
        4006: 'Merchant High',
        4007: 'Thief High',
        4008: 'Lord Knight',
        4009: 'High Priest',
        4010: 'High Wizard',
        4011: 'Whitesmith',
        4012: 'Sniper',
        4013: 'Assassin Cross',
        4014: 'Lord Knight',
        4015: 'Paladin',
        4016: 'Champion',
        4017: 'Professor',
        4018: 'Stalker',
        4019: 'Creator',
        4020: 'Clown',
        4021: 'Gypsy',
        4022: 'Paladin',
        4023: 'Baby',
        4024: 'Baby Swordman',
        4025: 'Baby Mage',
        4026: 'Baby Archer',
        4027: 'Baby Acolyte',
        4028: 'Baby Merchant',
        4029: 'Baby Thief',
        4030: 'Baby Knight',
        4031: 'Baby Priest',
        4032: 'Baby Wizard',
        4033: 'Baby Blacksmith',
        4034: 'Baby Hunter',
        4035: 'Baby Assassin',
        4036: 'Baby Knight',
        4037: 'Baby Crusader',
        4038: 'Baby Monk',
        4039: 'Baby Sage',
        4040: 'Baby Rogue',
        4041: 'Baby Alchemist',
        4042: 'Baby Bard',
        4043: 'Baby Dancer',
        4044: 'Baby Crusader',
        4045: 'Super Baby',
        4046: 'Taekwon',
        4047: 'Star Gladiator',
        4048: 'Star Gladiator',
        4049: 'SoulLinker'
    }

    update_data(data: any) {
        this.rrf_data = data;
        this.process_data();
    }

    clear_data() {
        this.rrf_data = null;
        this.battle_data = {};
        this.shared_battle_data.set({});
    }

    get_data() {
        return this.shared_battle_data;
    }

    get_counter() {
        return this.count;
    }

    process_data() {
        this.count.set(this.count() + 1);

        for (const [id, battle_info] of Object.entries(this.rrf_data) as Entries<{ [id: string]: any }>) {
            let mob_name: string = `${battle_info['name']}#${id}`
            let damage_received: number = 0;

            // FIXME: Unless MaxHP is provided, first iteration to compute total damage received
            for (const [name, damage_info] of Object.entries(battle_info['damage_dealers']) as Entries<{ [name: string]: any }>)
                damage_received += damage_info['damage'];

            let current_damage_dealers: DamageDealers = {};
            let damage_percentage: number = 0;
            for (const [name, damage_info] of Object.entries(battle_info['damage_dealers']) as Entries<{ [name: string]: JsonDamageDealer }>) {
                let skill_spam: number = damage_info['skill_timers'].length;
                let percentage: number = damage_info['damage'] / damage_received * 100;

                // Ensure that total percentage between damage dealer never exceed 100%
                damage_percentage += percentage;
                if (damage_percentage > 100)
                    percentage -= (damage_percentage - 100);

                // Timers are expressed in milliseconds while skill spam in seconds
                // FIXME: skill_timer cannot be empty, force usage of ! operator
                // damage_info['skill_timers'] is respecting a descending order, latest skill timer will then be at first index
                let battle_duration: number = (damage_info['skill_timers'].at(0)! - damage_info['skill_timers'].at(-1)!) / 1000;
                if (battle_duration)
                    skill_spam /= battle_duration;

                let current_damage_dealer: DamageDealer = {
                    'damage': damage_info['damage'],
                    'job': this.map_job_id(damage_info['job']),
                    'skill_used': damage_info['skill_timers'].length,
                    'skill_spam': skill_spam,
                    'percentage': percentage
                }

                current_damage_dealers[name] = current_damage_dealer;
            }

            this.battle_data[mob_name] = {
                'job': battle_info['job'],
                'damage_dealers': current_damage_dealers,
                'damage_received': damage_received
            };
        }

        // Publish post processed data
        this.shared_battle_data.set(this.battle_data);
        console.log(this.count());
    }

    increment() {
        this.count.set(this.count() + 1);
    }

    map_job_id(job_id: number) {
        return this.job_id_map[job_id];
    }
}