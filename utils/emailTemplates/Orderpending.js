// 📁 utils/emailTemplates/pending.js

module.exports = function pendingTemplate({ user, product, order }) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2 style="color: #ff9800;">⏳ Order Pending</h2>
      <p>Hi ${user.name}, your order for <strong>${product.title}</strong> is still pending.</p>
      <p>We are currently reviewing it and will confirm shortly.</p>
      <p>Order ID: ${order._id}</p>
      <p>Thanks,<br/>Team Ecomzy</p>
    </div>
  `;
};
