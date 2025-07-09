import { BeltColor } from '@renderer/db/member.schema'
import {
  BELT_CONFIG,
  beltColorToHex,
  getRankBarColor,
  getBeltMidlineStripe,
  BeltWrapper,
  BeltBand,
  OverlayStripe,
  BlackBeltStripe,
  BlackBeltStripeContainer,
  RedBeltStripe,
  RedBeltStripeContainer,
  Stripe,
  StripeContainer,
  BJJ_BELT_HEX
} from './belt.component.styled'

interface BeltIconProps {
  belt?: BeltColor
  stripes?: number
  scale?: number
}

export const BeltIcon: React.FC<BeltIconProps> = ({
  belt = BeltColor.WHITE,
  stripes = 0,
  scale = 1
}) => {
  if (belt.startsWith('RED')) {
    const stripeColor = belt.endsWith('_WHITE')
      ? BJJ_BELT_HEX[BeltColor.WHITE]
      : belt.endsWith('_BLACK')
        ? BJJ_BELT_HEX[BeltColor.BLACK]
        : undefined
    return (
      <BeltWrapper scale={scale}>
        <BeltBand color={beltColorToHex(belt)} scale={scale}>
          {stripeColor && (
            <RedBeltStripeContainer scale={scale}>
              {[...Array(2)].map((_, i) => (
                <RedBeltStripe key={i} color={stripeColor} scale={scale} />
              ))}
            </RedBeltStripeContainer>
          )}
        </BeltBand>
      </BeltWrapper>
    )
  }

  if (belt === BeltColor.BLACK) {
    const stripeCount = Math.max(0, Math.min(stripes, BELT_CONFIG.black.maxStripes))
    const barColor = getRankBarColor(BeltColor.BLACK)!
    const stripeColor = BJJ_BELT_HEX[BeltColor.WHITE]
    const midline = getBeltMidlineStripe(BeltColor.BLACK)

    return (
      <BeltWrapper scale={scale}>
        <BeltBand color={beltColorToHex(BeltColor.BLACK)} scale={scale}>
          {midline && <OverlayStripe color={midline} scale={scale} />}
          <BlackBeltStripeContainer color={barColor} scale={scale}>
            {[...Array(stripeCount)].map((_, i) => (
              <BlackBeltStripe key={i} color={stripeColor} scale={scale} />
            ))}
          </BlackBeltStripeContainer>
        </BeltBand>
      </BeltWrapper>
    )
  }

  const stripeCount = Math.max(0, Math.min(stripes, BELT_CONFIG.default.maxStripes))
  const barColor = getRankBarColor(belt)!

  const midline = getBeltMidlineStripe(belt)

  return (
    <BeltWrapper scale={scale}>
      <BeltBand color={beltColorToHex(belt)} scale={scale}>
        {midline && <OverlayStripe color={midline} scale={scale} />}
        <StripeContainer color={barColor} scale={scale}>
          {[...Array(stripeCount)].map((_, i) => (
            <Stripe key={i} color={BJJ_BELT_HEX[BeltColor.WHITE]} scale={scale} />
          ))}
        </StripeContainer>
      </BeltBand>
    </BeltWrapper>
  )
}
