const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const mapOrder = require('../mappers/order');

module.exports.checkout = async function checkout(ctx, next) {
  const {product, phone, address} = ctx.request.body;
  const user = ctx.user;

  const order = new Order({
    user: user.id,
    product,
    phone,
    address,
  });

  await order.save();

  await sendMail({
    to: user.email,
    subject: `Новый заказ №${order.id}`,
    locals: mapOrder(order),
    template: 'order-confirmation',
  });

  ctx.body = {
    order: order.id,
  };
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const user = ctx.user;
  const orders = await Order.find({user: user.id}).populate('user', 'product');

  ctx.body = {
    orders: orders.map(mapOrder),
  };
};
