import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from '@angular/animations'

export function rotateAnimation (degrees: number, animationSpeed: number): AnimationTriggerMetadata {
    return trigger('rotate', [
        state(
            '0',
            style({
                transform: 'rotate(0deg)'
            })
        ),
        state(
            '1',
            style({
                transform: `rotate(${degrees}deg)`
            })
        ),
        transition(
            '0 => 1', [
                animate(animationSpeed)
            ]
        ),
        transition(
            '1 => 0', [
                animate(animationSpeed)
            ]
        )
    ])
}