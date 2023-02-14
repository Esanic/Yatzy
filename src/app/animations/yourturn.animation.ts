import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from '@angular/animations'

export function yourTurnAnimation (animationSpeed: number): AnimationTriggerMetadata {
    return trigger('yourTurn', [
        state(
            '0',
            style({
                opacity: '0',
                visibility: 'hidden',
                fontSize: '0rem',

            })
        ),
        state(
            '1',
            style({
                opacity: '1',
                visibility: 'visible',
                fontSize: '3rem',

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