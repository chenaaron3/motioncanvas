import { Circle, is, Layout, Node, Rect } from '@motion-canvas/2d';
import { all, PossibleColor, SignalValue, unwrap, useLogger, waitFor } from '@motion-canvas/core';

export function* CircumscribeRect(
    nodeOrRef: SignalValue<Layout>,
    color: PossibleColor,
    scale: number = 1.1,
    lineWidth: number = 5,
    holdSecs: number = 0
) {
    const node = unwrap(nodeOrRef);
    const rect = new Rect({
        layout: false,
        lineWidth: lineWidth,
        stroke: color,
        end: 0,
        position: node.position,
        zIndex: 11000
    });
    const width = node.cacheBBox().width;
    const height = node.cacheBBox().height;
    rect.width(width * scale);
    rect.height(height * scale);
    const parent = node.findAncestor(is(Node));
    if (parent === null) {
        useLogger().debug("Returning");
        return;
    }
    parent.add(rect);
    rect.moveToTop()
    yield* rect.end(1, 1);
    yield* waitFor(holdSecs);
    yield* rect.start(1, 1);
    rect.remove();
}

export function* CircumscribeCircle(
    nodeOrRef: SignalValue<Layout>,
    color: PossibleColor,
    lineWidth: number = 10,
    scale: number = 1,
    drawSecs: number = 2, // Will be divided by 2 for draw on and draw off
    holdSecs: number = 0.1
) {
    const node = unwrap(nodeOrRef);
    const circle = new Circle({
        layout: false,
        lineWidth: lineWidth,
        stroke: color,
        end: 0,
        position: node.position,
    });
    const width = node.cacheBBox().width;
    const height = node.cacheBBox().height;
    circle.width(width * scale);
    circle.height(height * scale);
    const parent = node.findAncestor(is(Node));
    if (parent === null) {
        return;
    }
    parent.add(circle);
    circle.moveAbove(node);
    yield* all(circle.end(1, drawSecs / 2.0), circle.rotation(360, drawSecs / 2));
    yield* waitFor(holdSecs);
    yield* all(circle.start(1, drawSecs / 2.0));
    circle.remove();
}