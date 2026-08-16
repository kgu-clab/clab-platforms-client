'use client';

import gsap from 'gsap';
import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef,
} from 'react';

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  dropDistance?: number;
  duration?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  skewAmount?: number;
  easing?: 'linear' | 'elastic';
  children: ReactNode;
  className?: string;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ customClass, className, ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={`absolute left-1/2 top-1/2 rounded-xl border border-white bg-black backface-hidden transform-3d will-change-transform ${customClass ?? ''} ${className ?? ''}`.trim()}
    />
  )
);
Card.displayName = 'Card';

type CardRef = RefObject<HTMLDivElement | null>;

interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true,
  });

const CardSwap: React.FC<CardSwapProps> = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  dropDistance = 500,
  duration,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 6,
  easing = 'elastic',
  children,
  className,
}) => {
  const config = useMemo(() => {
    const base =
      easing === 'elastic'
        ? {
            ease: 'elastic.out(0.6,0.9)',
            durDrop: 2,
            durMove: 2,
            durReturn: 2,
            promoteOverlap: 0.9,
            returnDelay: 0.05,
          }
        : {
            ease: 'power1.inOut',
            durDrop: 0.8,
            durMove: 0.8,
            durReturn: 0.8,
            promoteOverlap: 0.45,
            returnDelay: 0.2,
          };

    return duration ? { ...base, durDrop: duration, durMove: duration, durReturn: duration } : base;
  }, [duration, easing]);

  const childArr = useMemo(
    () => Children.toArray(children).filter(isValidElement) as ReactElement<CardProps>[],
    [children]
  );
  const refs = useMemo<CardRef[]>(
    () => childArr.map(() => React.createRef<HTMLDivElement>()),
    [childArr]
  );
  const order = useRef<number[]>(Array.from({ length: childArr.length }, (_, i) => i));
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number | null>(null);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (refs.length === 0) return;

    order.current = Array.from({ length: refs.length }, (_, i) => i);

    const total = refs.length;
    refs.forEach((r, i) => {
      if (r.current)
        placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount);
    });

    const swap = () => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front]?.current;
      if (!elFront) return;
      if (tlRef.current?.isActive()) return;

      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, {
        y: `+=${dropDistance}`,
        duration: config.durDrop,
        ease: config.ease,
      });

      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx]?.current;
        if (!el) return;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, 'promote');
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease,
          },
          `promote+=${i * 0.15}`
        );
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      const lastPromoteOffset = Math.max(0, (rest.length - 1) * 0.15);
      tl.addLabel(
        'return',
        `promote+=${lastPromoteOffset + config.durMove * (1 + config.returnDelay)}`
      );
      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        'return'
      );
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease,
        },
        'return'
      );

      tl.call(() => {
        order.current = [...rest, front];
      });
    };

    const reduceMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
    const node = container.current;
    const pause = () => {
      tlRef.current?.pause();
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
    const resume = () => {
      tlRef.current?.play();
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (!reduceMotionMedia.matches) {
        intervalRef.current = window.setInterval(swap, delay);
      }
    };
    const syncMotionPreference = () => {
      if (reduceMotionMedia.matches) {
        pause();
        return;
      }
      resume();
    };

    if (!reduceMotionMedia.matches) {
      swap();
      intervalRef.current = window.setInterval(swap, delay);
    }
    reduceMotionMedia.addEventListener('change', syncMotionPreference);

    if (pauseOnHover && node) {
      node.addEventListener('mouseenter', pause);
      node.addEventListener('mouseleave', resume);
      node.addEventListener('focusin', pause);
      node.addEventListener('focusout', resume);
    }

    return () => {
      tlRef.current?.kill();
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      reduceMotionMedia.removeEventListener('change', syncMotionPreference);
      if (pauseOnHover && node) {
        node.removeEventListener('mouseenter', pause);
        node.removeEventListener('mouseleave', resume);
        node.removeEventListener('focusin', pause);
        node.removeEventListener('focusout', resume);
      }
    };
  }, [cardDistance, verticalDistance, dropDistance, delay, pauseOnHover, skewAmount, refs, config]);

  const rendered = childArr.map((child, i) =>
    isValidElement<CardProps>(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          role: onCardClick ? (child.props.role ?? 'button') : child.props.role,
          tabIndex: onCardClick ? (child.props.tabIndex ?? 0) : child.props.tabIndex,
          onClick: (event: React.MouseEvent<HTMLDivElement>) => {
            child.props.onClick?.(event);
            onCardClick?.(i);
          },
          onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
            child.props.onKeyDown?.(event);
            if (
              !event.defaultPrevented &&
              onCardClick &&
              (event.key === 'Enter' || event.key === ' ')
            ) {
              event.preventDefault();
              onCardClick(i);
            }
          },
        } as CardProps & React.RefAttributes<HTMLDivElement>)
      : child
  );

  return (
    <div
      ref={container}
      className={`absolute bottom-0 right-0 origin-bottom-right overflow-visible perspective-[900px] ${className ?? ''}`.trim()}
      style={{ width, height }}
    >
      {rendered}
    </div>
  );
};

export default CardSwap;
