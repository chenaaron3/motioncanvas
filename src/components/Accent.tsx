import { Node, NodeProps, Shape, signal } from '@motion-canvas/2d';
import { all, SignalValue, ThreadGenerator, unwrap } from '@motion-canvas/core';

export interface AccentProps extends NodeProps {
    target: SignalValue<Shape>
}

export class Accent extends Node {
    @signal()
    public declare readonly target: SignalValue<Shape>

    constructor(props: AccentProps) {
        super(props)
    }

    *start(): ThreadGenerator {
        const node = unwrap(this.target);
        yield* all(
            node.scale(2, .25).to(1, .25),
            node.rotation(5, .125).to(-5, .125).to(0, .25)
        )
    }
}