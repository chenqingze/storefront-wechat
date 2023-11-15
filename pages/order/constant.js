export const OrderStatus = {
  PENDING_PAYMENT: 5, // 待支付
  PENDING_DELIVERY: 10, // 待发货
  PENDING_RECEIPT: 40, // 待收货
  COMPLETE: 50, // 已完成/待评价
  PAYMENT_TIMEOUT: 80, // 已取消，支付超时
  CANCELED_NOT_PAYMENT: 80, // 已取消，未支付主动取消
  CANCELED_PAYMENT: 80, // 已取消，已支付主动取消
  CANCELED_REJECTION: 80, // 已取消，拒收
};
