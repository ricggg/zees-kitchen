import type { FulfilmentType, OrderStatus } from './types';

export const stepsFor = (f: FulfilmentType): OrderStatus[] =>
  f === 'delivery'
    ? ['received', 'preparing', 'ready', 'out_for_delivery', 'delivered']
    : ['received', 'preparing', 'ready', 'picked_up'];

export const statusLabel: Record<OrderStatus, string> = {
  received: 'Order received',
  preparing: 'Preparing your food',
  ready: 'Ready',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  picked_up: 'Picked up',
  cancelled: 'Cancelled',
};
export const statusHint = (s: OrderStatus, f: FulfilmentType) =>
  ({
    received: 'We have your order and payment.',
    preparing: 'The kitchen is cooking it fresh.',
    ready: f === 'pickup' ? 'Come with your code. It is packed and waiting.' : 'Packed and waiting for the rider.',
    out_for_delivery: 'Your rider is on the way to you.',
    delivered: 'Enjoy your meal! Try Dey Chop!',
    picked_up: 'Enjoy your meal! Try Dey Chop!',
    cancelled: 'This order was cancelled. Please call us if this is a surprise.',
  } as Record<OrderStatus, string>)[s];
