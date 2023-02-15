import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from '@angular/animations'

/**
 * Function that animates a rotation based upon the number of spins and how fast the animation should be.
 */
export function rotateAnimation (spins: number, animationSpeed: number): AnimationTriggerMetadata {
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
                transform: `rotate(${spins*360}deg)`
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