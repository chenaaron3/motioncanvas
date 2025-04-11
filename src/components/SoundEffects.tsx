import { sound, SoundBuilder } from '@motion-canvas/core';

export class SoundEffects {
    static beep(offset?: number): void {
        SoundEffects.defaultBuilder("src/assets/effects/beep.wav").play(offset);
    }

    static boop(offset?: number): void {
        SoundEffects.defaultBuilder("src/assets/effects/boop_airplane.wav").play(offset);
    }

    static pop(offset?: number): void {
        SoundEffects.defaultBuilder("src/assets/effects/lips_pop.wav").play(offset);
    }

    static intro(offset?: number): void {
        SoundEffects.defaultBuilder("src/assets/effects/flip.wav").play(offset);
    }

    static move(offset?: number): void {
        SoundEffects.defaultBuilder("src/assets/effects/whoosh3.mp3").play(offset);
    }

    static good(offset?: number): void {
        SoundEffects.defaultBuilder("src/assets/effects/ding_strong.wav").play(offset);
    }

    static error(offset?: number): void {
        SoundEffects.defaultBuilder("src/assets/effects/oof_minecraft.mp3").play(offset);
    }

    static wow(offset?: number): void {
        SoundEffects.defaultBuilder("src/assets/effects/anime_wow.mp3").trim(0, 2).play(offset);
    }

    static eval(offset?: number): void {
        SoundEffects.defaultBuilder("src/assets/effects/ding_light.wav").play(offset);
    }

    static click(offset?: number): void {
        SoundEffects.defaultBuilder("src/assets/effects/mouse_click.wav").play(offset);
    }

    static letsgo(offset?: number): void {
        SoundEffects.defaultBuilder("src/assets/effects/mario_here_we_go.wav").gain(-10).play(offset);
    }

    static writing(offset?: number): void {
        SoundEffects.defaultBuilder("src/assets/effects/pencil.wav").play(offset);
    }

    static swap(offset?: number): void {
        SoundEffects.defaultBuilder("src/assets/effects/swish_scifi.wav").play(offset);
    }


    private static defaultBuilder(audio: string): SoundBuilder {
        return sound(audio)
            .gain(-2)
    }
}