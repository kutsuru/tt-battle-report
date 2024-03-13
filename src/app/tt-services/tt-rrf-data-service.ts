import { Injectable, WritableSignal, signal } from '@angular/core';
import { DamageDealer, DamageDealers, BattleData } from './tt-typedef';
import { Entries } from 'type-fest';

interface JsonDamageDealer {
    'damage': number; 'job': number; 'skill_timers': number[]
}

@Injectable()
export class TTRRFDataService {
    count: WritableSignal<number> = signal(0);
    rrf_data : any | null = null;
    battle_data : BattleData = {};
    shared_battle_data: WritableSignal<BattleData> = signal(this.battle_data);

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

        for (const [id, battle_info] of Object.entries(this.rrf_data) as Entries<{[id:string] : any}>) {
            let mob_name: string = `${battle_info['name']}#${id}`
            let damage_received: number = 0;

            // FIXME: Unless MaxHP is provided, first iteration to compute total damage received
            for (const [name, damage_info] of Object.entries(battle_info['damage_dealers']) as Entries<{[name:string] : any}>)
                damage_received += damage_info['damage'];

            let current_damage_dealers: DamageDealers = {};
            let damage_percentage: number = 0;
            for (const [name, damage_info] of Object.entries(battle_info['damage_dealers']) as Entries<{[name:string] : JsonDamageDealer}>) {
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

                let current_damage_dealer : DamageDealer = {
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
        return job_id.toString();
    }
}