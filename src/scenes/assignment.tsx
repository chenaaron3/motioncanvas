import {
    Code, CODE, Img, Line, lines, makeScene2D, Rect, Txt, View2D, word
} from '@motion-canvas/2d';
import {
    all, chain, createRef, createSignal, DEFAULT, easeInCubic, Reference, waitFor, waitUntil
} from '@motion-canvas/core';

import Mess from '../assets/images/mess.jpg';
import Potatoes from '../assets/images/potato.png';
import Success from '../assets/images/success.jpg';
import Tupperware from '../assets/images/tupperware.png';
import { Check } from '../components/Check';
import { Cross } from '../components/Cross';
import { Expression } from '../components/Expression';
import { SoundEffects } from '../components/SoundEffects';
import { Variable } from '../components/Variable';
import { Colors } from '../utils/utils';

export default makeScene2D(function* (view) {
    view.fill(Colors.Background);
    const text = createSignal("");
    const value = Code.createSignal(`1`);
    const body = Code.createSignal(CODE`x = ${value}`);

    const txtRef = createRef<Txt>();
    const variableRef = createRef<Variable>();
    const codeRef = createRef<Code>();
    const tupperwareRef = createRef<Img>();
    const potatoRef = createRef<Img>();

    view.add(
        <Rect>
            <Txt textAlign={'center'} ref={txtRef} text={text} fill={"white"}></Txt>
            <Code
                ref={codeRef}
                code={CODE`${body}`}
                opacity={0}
            />
            <Variable ref={variableRef} />
            <Img ref={tupperwareRef} size={250} src={Tupperware} opacity={0}>
                <Txt text="Variable" y={125} fill={Colors.Variable}></Txt>
            </Img>
            <Img ref={potatoRef} size={100} src={Potatoes} opacity={0}>
                <Txt text="Value" y={125} fill={Colors.Value}></Txt>
            </Img>
        </Rect>
    );

    // Text description of a variable
    yield* waitUntil("Variables Intro")
    SoundEffects.writing();
    yield* text("Python Variables\nin 5 Minutes", 1)
    SoundEffects.writing();
    yield* waitUntil("Lets Go Intro")
    yield* text("Lets go", 1)
    SoundEffects.letsgo(.25);
    yield* txtRef().opacity(0, 1)

    // Display empty box
    yield* waitUntil("Box Intro")
    yield* variableRef().declare("x");

    // Introduce value and assigment
    yield* waitUntil("Value Intro");
    yield* variableRef().assignValue('1');

    // Show code
    yield* waitUntil("Assignment Intro");
    SoundEffects.intro();
    text("Assignment")
    txtRef().y(-350);
    codeRef().position([0, -200]);
    yield* all(
        txtRef().opacity(1, 1),
        codeRef().opacity(1, 1),
    )

    // Highlight from right to left
    yield* waitUntil("Read RL");
    SoundEffects.click();
    yield* codeRef().selection(codeRef().findFirstRange('1'), 0.2);
    SoundEffects.click();
    yield* codeRef().selection(codeRef().findFirstRange('='), 0.2);
    SoundEffects.click();
    yield* codeRef().selection(codeRef().findFirstRange('x'), 0.2);
    yield* codeRef().selection(lines(-1), 0.2);

    yield* waitUntil("Highlight 1");
    SoundEffects.click();
    yield* codeRef().selection(codeRef().findFirstRange('1'), 0.2);
    yield* waitUntil("Highlight =");
    SoundEffects.click();
    yield* codeRef().selection(codeRef().findFirstRange('='), 0.2);
    yield* waitUntil("Highlight x");
    SoundEffects.click();
    yield* codeRef().selection(codeRef().findFirstRange('x'), 0.2);
    yield* waitFor(.1);
    yield* codeRef().selection(DEFAULT, 0.2);

    // Show pattern
    yield* waitUntil("Leftover Example");
    yield* all(
        variableRef().opacity(0, 1)
    )

    // Explain direction with an example
    const exampleY = 100;
    body(CODE`x = 1`);
    tupperwareRef().position([-350, exampleY]);
    potatoRef().position([350, exampleY]);
    potatoRef().zIndex(1);
    yield* all(
        tupperwareRef().opacity(1, 1),
        potatoRef().opacity(1, 1),
    )

    yield* waitUntil("Move Food");
    yield* arrowMove(view, potatoRef, tupperwareRef);
    // Show success
    potatoRef().opacity(0);
    tupperwareRef().opacity(0);
    const img = <Img size={250} src={Success} position={tupperwareRef().position()}></Img>
    view.add(img);
    const check = <Check position={[0, exampleY]} /> as Check;
    view.add(check);
    yield* check.animate(.7);

    yield* waitUntil("Invalid Food");
    yield* all(
        img.opacity(0, 1),
        check.opacity(0, 1),
    )
    img.remove();
    check.remove();

    // Invalid 
    tupperwareRef().position([350, exampleY]);
    potatoRef().position([-350, exampleY]);
    SoundEffects.swap();
    yield* all(
        body(CODE`1 = x`, 1),
        tupperwareRef().opacity(1, 1),
        potatoRef().opacity(1, 1)
    )
    yield* arrowMove(view, tupperwareRef, potatoRef);
    // Show fail
    potatoRef().opacity(0);
    tupperwareRef().opacity(0);
    const img2 = <Img height={300} src={Mess} position={tupperwareRef().position()}></Img>
    view.add(img2);
    const cross = <Cross position={[0, exampleY]} /> as Cross;
    view.add(cross);
    yield* cross.animate(.7);
    yield* all(
        img2.opacity(0, 1),
        cross.opacity(0, 1),
    );
    img2.remove();
    cross.remove();
});

function* arrowMove(view: View2D, source: Reference<any>, target: Reference<any>) {
    const arrowStart = source().position();
    const arrowEnd = target().position();
    const lineRef = createRef<Line>();
    // Draw the arrow
    view.add(<Line
        ref={lineRef}
        stroke={Colors.Assignment}
        lineWidth={8}
        endArrow
    ></Line>);
    lineRef().points([arrowStart, arrowStart]);
    yield* lineRef().points([arrowStart, arrowEnd], 1);
    // Move the source
    const moveSignal = createSignal(arrowStart);
    source().position(moveSignal);
    lineRef().points([moveSignal, arrowEnd]);
    SoundEffects.move(.25);
    yield* moveSignal(arrowEnd, 1, easeInCubic);
    lineRef().remove();
}
