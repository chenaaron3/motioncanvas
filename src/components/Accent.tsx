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
            node.scale(1.5, .5).to(1, .5),
            node.rotation(5, .3).to(-5, .3).to(0, .3)
        )
    }
}